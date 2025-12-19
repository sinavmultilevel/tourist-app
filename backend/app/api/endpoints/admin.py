from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models import all_models
from pydantic import BaseModel

router = APIRouter()

# --- Schemas ---

class PlaceBase(BaseModel):
    name: str
    short_desc: str | None = None
    long_desc: str | None = None
    latitude: float
    longitude: float
    is_active: bool = True
    type: str
    photo_url: str | None = None
    boundary_points: List[dict] | None = None
    parent_id: Optional[int] = None

class PlaceCreate(PlaceBase):
    pass

class PlaceUpdate(BaseModel):
    name: str | None = None
    short_desc: str | None = None
    long_desc: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    is_active: bool | None = None
    type: str | None = None
    photo_url: str | None = None
    boundary_points: List[dict] | None = None
    parent_id: int | None = None

class PlaceResponse(PlaceBase):
    id: int
    class Config:
        from_attributes = True

class HotelBase(BaseModel):
    name: str
    contact_info: str | None = None
    commission_rate: float = 0.0
    photo_url: str | None = None
    is_active: bool = True

class HotelCreate(HotelBase):
    pass

class HotelUpdate(HotelBase):
    pass

class HotelResponse(HotelBase):
    id: int
    class Config:
        from_attributes = True

class RestaurantBase(BaseModel):
    name: str
    category: str | None = None
    price_level: str | None = None
    is_recommended: bool = False
    photo_url: str | None = None
    is_active: bool = True

class RestaurantCreate(RestaurantBase):
    pass

class RestaurantUpdate(RestaurantBase):
    pass

class RestaurantResponse(RestaurantBase):
    id: int
    class Config:
        from_attributes = True

class ShopBase(BaseModel):
    name: str
    is_handmade: bool = False
    is_verified: bool = False
    commission_rate: float = 0.0
    admin_notes: str | None = None
    photo_url: str | None = None
    is_active: bool = True

class ShopCreate(ShopBase):
    pass

class ShopUpdate(ShopBase):
    pass

class ShopResponse(ShopBase):
    id: int
    class Config:
        from_attributes = True

class ConfigUpdate(BaseModel):
    key: str
    value: str

class ConfigResponse(BaseModel):
    key: str
    value: str
    description: str | None = None
    class Config:
        from_attributes = True

class StatsResponse(BaseModel):
    items: dict

# --- Endpoints ---

@router.get("/dashboard", response_model=StatsResponse)
def get_dashboard_stats(
    db: Session = Depends(deps.get_db),
    current_user: all_models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    return {
        "items": {
            "places": db.query(all_models.Place).count(),
            "hotels": db.query(all_models.Hotel).count(),
            "restaurants": db.query(all_models.Restaurant).count(),
            "shops": db.query(all_models.Shop).count(),
            "users": db.query(all_models.User).count(),
        }
    }

# --- Places ---
@router.get("/places", response_model=List[PlaceResponse])
def read_places(
    skip: int = 0, 
    limit: int = 100, 
    include_children: bool = False,
    db: Session = Depends(deps.get_db), 
    current_user: all_models.User = Depends(deps.get_current_active_superuser)
):
    query = db.query(all_models.Place)
    
    if not include_children:
        query = query.filter(all_models.Place.parent_id == None)
        
    return query.offset(skip).limit(limit).all()

@router.post("/places", response_model=PlaceResponse)
def create_place(place_in: PlaceCreate, db: Session = Depends(deps.get_db), current_user: all_models.User = Depends(deps.get_current_active_superuser)):
    place = all_models.Place(**place_in.dict())
    db.add(place)
    db.commit()
    db.refresh(place)
    return place

@router.put("/places/{place_id}", response_model=PlaceResponse)
def update_place(place_id: int, place_in: PlaceUpdate, db: Session = Depends(deps.get_db), current_user: all_models.User = Depends(deps.get_current_active_superuser)):
    place = db.query(all_models.Place).filter(all_models.Place.id == place_id).first()
    if not place: raise HTTPException(status_code=404, detail="Place not found")
    for k, v in place_in.dict(exclude_unset=True).items(): setattr(place, k, v)
    db.add(place)
    db.commit()
    db.refresh(place)
    return place

@router.delete("/places/{place_id}")
def delete_place(place_id: int, db: Session = Depends(deps.get_db), current_user: all_models.User = Depends(deps.get_current_active_superuser)):
    # Cascade delete: Delete children first
    db.query(all_models.Place).filter(all_models.Place.parent_id == place_id).delete()
    
    # Then delete the place itself
    db.query(all_models.Place).filter(all_models.Place.id == place_id).delete()
    db.commit()
    return {"status": "success"}

# --- Hotels ---
@router.get("/hotels", response_model=List[HotelResponse])
def read_hotels(db: Session = Depends(deps.get_db), current_user: all_models.User = Depends(deps.get_current_active_superuser)):
    return db.query(all_models.Hotel).all()

@router.post("/hotels", response_model=HotelResponse)
def create_hotel(hotel_in: HotelCreate, db: Session = Depends(deps.get_db), current_user: all_models.User = Depends(deps.get_current_active_superuser)):
    hotel = all_models.Hotel(**hotel_in.dict())
    db.add(hotel)
    db.commit()
    db.refresh(hotel)
    return hotel

@router.put("/hotels/{id}", response_model=HotelResponse)
def update_hotel(id: int, hotel_in: HotelUpdate, db: Session = Depends(deps.get_db), current_user: all_models.User = Depends(deps.get_current_active_superuser)):
    item = db.query(all_models.Hotel).filter(all_models.Hotel.id == id).first()
    if not item: raise HTTPException(status_code=404, detail="Hotel not found")
    for k, v in hotel_in.dict(exclude_unset=True).items(): setattr(item, k, v)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.delete("/hotels/{id}")
def delete_hotel(id: int, db: Session = Depends(deps.get_db), current_user: all_models.User = Depends(deps.get_current_active_superuser)):
    db.query(all_models.Hotel).filter(all_models.Hotel.id == id).delete()
    db.commit()
    return {"ok": True}

# --- Restaurants ---
@router.get("/restaurants", response_model=List[RestaurantResponse])
def read_restaurants(db: Session = Depends(deps.get_db), current_user: all_models.User = Depends(deps.get_current_active_superuser)):
    return db.query(all_models.Restaurant).all()

@router.post("/restaurants", response_model=RestaurantResponse)
def create_restaurant(item_in: RestaurantCreate, db: Session = Depends(deps.get_db), current_user: all_models.User = Depends(deps.get_current_active_superuser)):
    item = all_models.Restaurant(**item_in.dict())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.put("/restaurants/{id}", response_model=RestaurantResponse)
def update_restaurant(id: int, item_in: RestaurantUpdate, db: Session = Depends(deps.get_db), current_user: all_models.User = Depends(deps.get_current_active_superuser)):
    item = db.query(all_models.Restaurant).filter(all_models.Restaurant.id == id).first()
    if not item: raise HTTPException(status_code=404, detail="Restaurant not found")
    for k, v in item_in.dict(exclude_unset=True).items(): setattr(item, k, v)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.delete("/restaurants/{id}")
def delete_restaurant(id: int, db: Session = Depends(deps.get_db), current_user: all_models.User = Depends(deps.get_current_active_superuser)):
    db.query(all_models.Restaurant).filter(all_models.Restaurant.id == id).delete()
    db.commit()
    return {"ok": True}

# --- Shops ---
@router.get("/shops", response_model=List[ShopResponse])
def read_shops(db: Session = Depends(deps.get_db), current_user: all_models.User = Depends(deps.get_current_active_superuser)):
    return db.query(all_models.Shop).all()

@router.post("/shops", response_model=ShopResponse)
def create_shop(item_in: ShopCreate, db: Session = Depends(deps.get_db), current_user: all_models.User = Depends(deps.get_current_active_superuser)):
    item = all_models.Shop(**item_in.dict())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.put("/shops/{id}", response_model=ShopResponse)
def update_shop(id: int, item_in: ShopUpdate, db: Session = Depends(deps.get_db), current_user: all_models.User = Depends(deps.get_current_active_superuser)):
    item = db.query(all_models.Shop).filter(all_models.Shop.id == id).first()
    if not item: raise HTTPException(status_code=404, detail="Shop not found")
    for k, v in item_in.dict(exclude_unset=True).items(): setattr(item, k, v)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.delete("/shops/{id}")
def delete_shop(id: int, db: Session = Depends(deps.get_db), current_user: all_models.User = Depends(deps.get_current_active_superuser)):
    db.query(all_models.Shop).filter(all_models.Shop.id == id).delete()
    db.commit()
    return {"ok": True}

# --- Settings ---
@router.get("/config", response_model=List[ConfigResponse])
def read_config(db: Session = Depends(deps.get_db), current_user: all_models.User = Depends(deps.get_current_active_superuser)):
    return db.query(all_models.GlobalConfig).all()

@router.put("/config", response_model=ConfigResponse)
def update_config(config_in: ConfigUpdate, db: Session = Depends(deps.get_db), current_user: all_models.User = Depends(deps.get_current_active_superuser)):
    config = db.query(all_models.GlobalConfig).filter(all_models.GlobalConfig.key == config_in.key).first()
    if not config:
        config = all_models.GlobalConfig(key=config_in.key, value=config_in.value)
        db.add(config)
    else:
        config.value = config_in.value
    db.commit()
    db.refresh(config)
    return config
