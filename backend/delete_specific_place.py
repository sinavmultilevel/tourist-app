import sqlite3
import sys
import io

# Force UTF-8 for Windows output
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

DB_PATH = 'sql_app.db'

def delete_benim_evim():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    print("Attempting to delete 'benim evim' (ID: 9)...")
    
    try:
        # Cascade delete logic (even if no children, good practice to match API)
        cursor.execute("DELETE FROM places WHERE parent_id = 9")
        cursor.execute("DELETE FROM places WHERE id = 9")
        
        if cursor.rowcount > 0:
            print("Successfully deleted 'benim evim'.")
        else:
            print("Failed to delete 'benim evim' (rowcount 0).")
            
        conn.commit()
    except Exception as e:
        print(f"Error deleting: {e}")
        conn.rollback()

    conn.close()

if __name__ == "__main__":
    delete_benim_evim()
