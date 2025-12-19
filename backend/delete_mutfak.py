import sqlite3
import sys
import io

# Force UTF-8 for Windows output
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

DB_PATH = 'sql_app.db'

def delete_mutfak():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    print("Attempting to delete 'mutfak' (ID: 8)...")
    
    try:
        # 1. Delete children (though we know there are none)
        cursor.execute("DELETE FROM places WHERE parent_id = 8")
        
        # 2. Delete parent
        cursor.execute("DELETE FROM places WHERE id = 8")
        
        if cursor.rowcount > 0:
            print("Successfully deleted 'mutfak'.")
        else:
            print("Failed to delete 'mutfak' (rowcount 0). Maybe it doesn't exist?")
            
        conn.commit()
        
    except Exception as e:
        print(f"Error deleting: {e}")
        conn.rollback()

    conn.close()

if __name__ == "__main__":
    delete_mutfak()
