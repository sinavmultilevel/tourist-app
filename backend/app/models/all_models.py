from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text, Float, JSON
from sqlalchemy.orm import relationship
from app.db.session import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_premium = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False)
    
    plans = relationship("Plan", back_populates="owner")

class Place(Base):
    __tablename__ = "places"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    short_desc = Column(Text)
    long_desc = Column(Text, nullable=True)
    story_text = Column(Text, nullable=True) # Full historical story
    child_text = Column(Text, nullable=True) # Simplified story for kids
    
    history = Column(Text) # Keeping for backward compatibility or migration
    description = Column(Text) # Keeping for backward compatibility
    
    photo_url = Column(String)
    audio_url = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    type = Column(String) # 'historical', 'museum', 'restaurant'
    boundary_points = Column(JSON, nullable=True) # List of {lat, lng} objects defining the polygon
    parent_id = Column(Integer, ForeignKey("places.id"), nullable=True) # For nested places (Micro-Locations)
    is_active = Column(Boolean, default=True)

class Plan(Base):
    __tablename__ = "plans"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content = Column(JSON) # Stores the full itinerary structure
    user_id = Column(Integer, ForeignKey("users.id"))
    
    owner = relationship("User", back_populates="plans")

class Experience(Base):
    __tablename__ = "experiences"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text)
    price = Column(Float)
    provider_contact = Column(String)

class Hotel(Base):
    __tablename__ = "hotels"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    contact_info = Column(String)
    commission_rate = Column(Float, default=0.0)
    photo_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=False)

class Restaurant(Base):
    __tablename__ = "restaurants"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String) # local, cafe, fast_food
    price_level = Column(String) # $, $$, $$$
    photo_url = Column(String, nullable=True)
    is_recommended = Column(Boolean, default=False)
    is_active = Column(Boolean, default=False)

class Shop(Base):
    __tablename__ = "shops"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    is_handmade = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)
    commission_rate = Column(Float, default=0.0)
    admin_notes = Column(Text, nullable=True)
    photo_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=False)

class GlobalConfig(Base):
    __tablename__ = "global_config"

    key = Column(String, primary_key=True, index=True)
    value = Column(String) # JSON encoded value
    description = Column(String, nullable=True)

# Update Place with new admin fields
# Note: we are not altering the existing class definition in place effectively with replace,
# but since I am rewriting the file content, I will re-declare Place structure or I should have used multi_replace.
# Wait, I am using replace_file_content on lines 45-47? No, I need to see the whole file to do this right. 
# I should re-read the file content fully first to make sure I don't break strict replacing rules. 
# Re-reading file first is safer.
