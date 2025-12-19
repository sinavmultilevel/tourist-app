from pydantic import BaseModel
from typing import Optional, List, Any

# User
class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_premium: bool
    class Config:
        from_attributes = True

# Place
class PlaceBase(BaseModel):
    name: str
    short_desc: Optional[str] = None
    long_desc: Optional[str] = None
    location_lat: float = 0.0
    location_lng: float = 0.0
    type: str
    type: str
    photo_url: Optional[str] = None
    boundary_points: Optional[List[dict]] = None # List of {lat: float, lng: float}
    parent_id: Optional[int] = None

class Place(PlaceBase):
    id: int
    audio_url: Optional[str] = None
    description: Optional[str] = None # For backward compat
    class Config:
        from_attributes = True

# Hotel
class HotelBase(BaseModel):
    name: str
    contact_info: Optional[str] = None
    commission_rate: float = 0.0
    photo_url: Optional[str] = None

class Hotel(HotelBase):
    id: int
    is_active: bool
    class Config:
        from_attributes = True

# Restaurant
class RestaurantBase(BaseModel):
    name: str
    category: Optional[str] = None
    price_level: Optional[str] = None
    is_recommended: bool = False
    photo_url: Optional[str] = None

class Restaurant(RestaurantBase):
    id: int
    is_active: bool
    class Config:
        from_attributes = True

# Shop
class ShopBase(BaseModel):
    name: str
    is_handmade: bool = False
    is_verified: bool = False
    commission_rate: float = 0.0
    admin_notes: Optional[str] = None
    photo_url: Optional[str] = None

class Shop(ShopBase):
    id: int
    is_active: bool
    class Config:
        from_attributes = True

# Config
class ConfigResponse(BaseModel):
    key: str
    value: str
    class Config:
        from_attributes = True

# AI Responses
class IdentificationResponse(BaseModel):
    name: str
    description: str
    history: str
    significance: str
    audio_url: str

class PlanRequest(BaseModel):
    days: int
    interests: List[str]
    walking_ability: str
    budget: str

class PlanResponse(BaseModel):
    itinerary: Any # Free form JSON

class ProductAnalysisResponse(BaseModel):
    authenticity: str
    price_range: str
    details: str

class TranslationRequest(BaseModel):
    text: str
    target_lang: str

class TranslationRequest(BaseModel):
    text: str
    source_lang: str
    target_lang: str

class TranslationResponse(BaseModel):
    original: str
    translated: str

class ChatRequest(BaseModel):
    query: str
    context: str = "General Ichan Kala"
    lang: str = "en"

class ChatResponse(BaseModel):
    response: str
    audio_available: bool = True

class AudioResponse(BaseModel):
    audio_base64: str
    content_type: str = "audio/mpeg"
    text_content: Optional[str] = None
