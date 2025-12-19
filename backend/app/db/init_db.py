import csv
import os
from sqlalchemy.orm import Session
from app.models import all_models
from app.core.security import get_password_hash

def seed_users(db: Session):
    user = db.query(all_models.User).filter(all_models.User.email == "admin@ichankala.com").first()
    if not user:
        user = all_models.User(
            email="admin@ichankala.com",
            hashed_password=get_password_hash("admin123"),
            full_name="Admin User",
            is_active=True,
            is_admin=True,
            is_premium=True
        )
        db.add(user)
        db.commit()
        print("Admin user created")
    else:
        print("Admin user already exists")

def seed_places_from_csv(db: Session):
    possible_paths = [
        "içan kala bilgileri.csv",
        "backend/içan kala bilgileri.csv",
        "../içan kala bilgileri.csv",
        "app/../içan kala bilgileri.csv" # If running from inside app
    ]
    
    found_path = None
    for path in possible_paths:
        if os.path.exists(path):
            found_path = path
            break
            
    if found_path:
        csv_path = found_path
    else:
            print(f"Warning: CSV file not found. Skipping place seeding.")
            return

    print(f"Seeding places from CSV...")
    
    with open(csv_path, mode='r', encoding='utf-8-sig') as csv_file:
        # The CSV has semicolon delimiter based on viewing the file
        # usage of utf-8-sig handles BOM if present
        reader = csv.DictReader(csv_file, delimiter=';')
        
        # Normalize column names in case of whitespace/casing issues
        # CSV headers seen: Yapılar;Kordinatlar;bilgileri

        
        for row in reader:
            try:
                print(f"Processing row: {row}")  # Debug print
            except UnicodeEncodeError:
                print("Processing row with unicode characters...")
            # Handle potential extensive whitespace or variations
            name = row.get('Yapılar', '').strip()
            coordinates = row.get('Kordinatlar', '').strip()
            description = row.get('bilgileri', '').strip()
            
            if not name or not coordinates:
                print(f"Skipping row due to missing name or coordinates: {name}, {coordinates}")
                continue
                
            try:
                lat_str, lon_str = coordinates.split(',')
                latitude = float(lat_str.strip())
                longitude = float(lon_str.strip())
            except ValueError:
                print(f"Skipping {name}: Invalid coordinates format '{coordinates}'")
                continue
            
            # Check if place exists by name to avoid duplicates
            # (or could check by coordinates, but name is safer for updates)
            place = db.query(all_models.Place).filter(all_models.Place.name == name).first()
            
            if not place:
                place = all_models.Place(
                    name=name,
                    description=description,
                    latitude=latitude,
                    longitude=longitude,
                    type="historical", # Default type
                    is_active=True,
                    photo_url="", # Placeholder
                    audio_url="", # Placeholder
                    short_desc=description[:100] + "..." if len(description) > 100 else description
                )
                db.add(place)
                print(f"Added new place: {name}")
            else:
                # Update existing place
                place.description = description
                place.latitude = latitude
                place.longitude = longitude
                # We can update other fields if needed
                print(f"Updated place: {name}")
        
        db.commit()

def init_db(db: Session):
    # Ensure tables exist
    # Note: explicitly importing engine here to avoid circular imports if possible, 
    # but create_all usually needs the Base which is loaded in models
    from app.db.session import engine
    all_models.Base.metadata.create_all(bind=engine)

    seed_users(db)
    seed_places_from_csv(db)
