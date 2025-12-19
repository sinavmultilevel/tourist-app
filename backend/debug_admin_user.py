from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models import all_models

def check_admin_user():
    db = SessionLocal()
    try:
        user = db.query(all_models.User).filter(all_models.User.email == "admin@ichankala.com").first()
        if user:
            print(f"User found: {user.email}")
            print(f"ID: {user.id}")
            print(f"Is Active: {user.is_active}")
            # Check for possible admin flags
            if hasattr(user, 'is_admin'):
                print(f"Is Admin: {user.is_admin}")
            if hasattr(user, 'is_superuser'):
                print(f"Is Superuser: {user.is_superuser}")
        else:
            print("User admin@ichankala.com NOT found")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_admin_user()
