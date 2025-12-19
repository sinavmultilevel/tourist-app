import sqlite3
import sys
import io

# Force UTF-8 for Windows output
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

DB_PATH = 'sql_app.db'

def inspect_mutfak():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    print("Searching for 'mutfak'...")
    cursor.execute("SELECT * FROM places WHERE name LIKE '%mutfak%'")
    places = cursor.fetchall()
    
    if not places:
        print("No place found with name containing 'mutfak'.")
    else:
        for p in places:
            # Table columns: id, name, short_desc, long_desc, story_text, child_text, history, description, photo_url, audio_url, latitude, longitude, type, boundary_points, parent_id, is_active
            # Depending on schema evolution, indices might vary, but ID is 0, Name is 1.
            p_id = p[0]
            p_name = p[1]
            p_parent = p[-2] # parent_id is second to last based on my recent edit adding it before is_active? 
            # Actually let's just get column names to be sure
            col_names = [description[0] for description in cursor.description]
            
            print(f"Found: {p_name} (ID: {p_id})")
            print(f"Columns: {dict(zip(col_names, p))}")
            
            # Check if anyone points to this as parent
            cursor.execute("SELECT id, name FROM places WHERE parent_id = ?", (p_id,))
            children = cursor.fetchall()
            if children:
                print(f"  Has {len(children)} children: {[c[1] for c in children]}")
            else:
                print("  Has no children.")

    conn.close()

if __name__ == "__main__":
    inspect_mutfak()
