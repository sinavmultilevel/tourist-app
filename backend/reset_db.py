import sqlite3
import os

DB_FILE = "backend/sql_app.db"

def reset_db():
    if not os.path.exists(DB_FILE):
        print("Database not found, nothing to reset.")
        return

    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        
        # Get all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        for table in tables:
            table_name = table[0]
            if table_name != "sqlite_sequence": # Don't drop sequence
                print(f"Dropping table {table_name}...")
                cursor.execute(f"DROP TABLE IF EXISTS {table_name}")
        
        conn.commit()
        conn.close()
        print("Database reset successfully.")
    except Exception as e:
        print(f"Error resetting database: {e}")

if __name__ == "__main__":
    reset_db()
