import sqlite3
import os
import sys

# Add the parent directory to sys.path so we can import app modules if needed
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

DB_FILE = "backend/sql_app.db"

def check_db():
    print(f"Checking database at: {DB_FILE}")
    if not os.path.exists(DB_FILE):
        print("ERROR: Database file does not exist!")
        return

    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        
        # Check Tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = [t[0] for t in cursor.fetchall()]
        print(f"Tables found: {tables}")
        
        required_tables = ["users", "places", "hotels", "restaurants", "shops", "global_config"]
        missing = [t for t in required_tables if t not in tables]
        
        if missing:
            print(f"ERROR: Missing tables: {missing}")
        else:
            print("SUCCESS: All required tables exist.")

        # Check Admin User
        if "users" in tables:
            cursor.execute("SELECT email, is_admin FROM users WHERE email='admin@ichankala.com'")
            admin = cursor.fetchone()
            if admin:
                print(f"SUCCESS: Admin user found: {admin}")
            else:
                print("ERROR: Admin user NOT found.")
        
        conn.close()
    except Exception as e:
        print(f"EXCEPTION: {e}")

if __name__ == "__main__":
    check_db()
