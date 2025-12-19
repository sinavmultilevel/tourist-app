from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.api.endpoints import api_v1, upload
from app.db.session import engine, Base
from app.models import all_models
import os

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

# Ensure uploads directory exists
os.makedirs("uploads", exist_ok=True)

# Mount uploads directory for static access
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_v1.router, prefix=settings.API_V1_STR)
app.include_router(upload.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {"message": "Welcome to Ichan Kala AI Guide API"}

@app.on_event("startup")
def init_data():
    from app.db.init_db import init_db
    from app.db.session import SessionLocal
    
    db = SessionLocal()
    try:
        init_db(db)
        print("Database initialized and seeded")
    except Exception as e:
        print(f"Error initializing data: {e}")
    finally:
        db.close()
