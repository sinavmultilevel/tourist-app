
import uvicorn

if __name__ == "__main__":
    print("Starting server on 0.0.0.0:8000 (Accessible via LAN)...")
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
