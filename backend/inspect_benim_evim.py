import sqlite3
import sys
import io

# Force UTF-8 for Windows output
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

DB_PATH = 'sql_app.db'

def inspect_benim_evim():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    print("Searching for 'benim evim'...")
    cursor.execute("SELECT * FROM places WHERE name LIKE '%benim evim%'")
    places = cursor.fetchall()
    
    if not places:
        print("No place found with name containing 'benim evim'.")
    else:
        for p in places:
            # Table columns based on recent checks: id, name, ...
            p_id = p[0]
            p_name = p[1]
            
            print(f"Found: {p_name} (ID: {p_id})")
            
            # Check for children
            cursor.execute("SELECT id, name FROM places WHERE parent_id = ?", (p_id,))
            children = cursor.fetchall()
            if children:
                print(f"  Has {len(children)} children:")
                for c in children:
                    print(f"    - {c[1]} (ID: {c[0]})")
            else:
                print("  Has no children.")

    conn.close()

if __name__ == "__main__":
    inspect_benim_evim()
