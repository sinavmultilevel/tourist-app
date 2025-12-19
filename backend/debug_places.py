
import os
import sys

# Add project root to path
sys.path.append(os.getcwd())

from app.db.session import SessionLocal
from app.models import all_models

def list_places():
    db = SessionLocal()
    try:
        places = db.query(all_models.Place).all()
        print(f"Index | Name | Lat | Lng | Active")
        print(f"-"*50)
        for p in places:
            print(f"{p.id} | {p.name} | {p.latitude} | {p.longitude} | {p.is_active}")
    finally:
        db.close()

if __name__ == "__main__":
    list_places()
