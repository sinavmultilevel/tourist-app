from sqlalchemy.orm import Session
from app.db.session import SessionLocal, engine
from app.models import all_models
from app.core.security import get_password_hash

def init_db(db: Session):
    # Create tables
    # (The call to create_all is now inside app.db.init_db.init_db but we can leave it here or delegate fully)
    # To keep it completely consistent, let's delegate fully.
    
    from app.db.init_db import init_db as init_db_central
    init_db_central(db)

if __name__ == "__main__":
    db = SessionLocal()
    init_db(db)
