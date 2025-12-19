import sqlite3

def add_column():
    conn = sqlite3.connect('sql_app.db')
    cursor = conn.cursor()
    
    try:
        cursor.execute("ALTER TABLE places ADD COLUMN boundary_points JSON")
        print("Successfully added boundary_points column.")
    except sqlite3.OperationalError as e:
        print(f"Error (column might already exist): {e}")
        
    conn.commit()
    conn.close()

if __name__ == "__main__":
    add_column()
