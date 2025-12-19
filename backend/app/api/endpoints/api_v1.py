from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.ai_service import ai_service
from app.schemas import schemas
from typing import List, Optional
from app.api.endpoints import login, admin

router = APIRouter()

@router.post("/identify-place", response_model=schemas.IdentificationResponse)
async def identify_place(file: UploadFile = File(...)):
    # In real app, read file.read()
    return ai_service.identify_place(b"")

@router.post("/create-plan", response_model=schemas.PlanResponse)
async def create_plan(request: schemas.PlanRequest):
    return ai_service.generate_plan(request)

@router.post("/analyze-product", response_model=schemas.ProductAnalysisResponse)
async def analyze_product(file: UploadFile = File(...)):
    return ai_service.analyze_product(b"")



@router.get("/places/by-location", response_model=schemas.Place)
async def get_place_by_location(lat: float, lng: float, db: Session = Depends(get_db)):
    from app.models import all_models
    import math

    # Haversine formula to find closest place
    def haversine(lat1, lon1, lat2, lon2):
        R = 6371 * 1000  # radius of Earth in meters
        phi1 = math.radians(lat1)
        phi2 = math.radians(lat2)
        delta_phi = math.radians(lat2 - lat1)
        delta_lambda = math.radians(lon2 - lon1)
        a = math.sin(delta_phi / 2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

    places = db.query(all_models.Place).filter(all_models.Place.is_active == True).all()
    
    closest_place = None
    min_dist = float('inf')
    
    # Threshold in meters (e.g. 100 meters)
    THRESHOLD_METERS = 300

    for place in places:
        try:
            # Skip if place has no valid coordinates
            if place.latitude is None or place.longitude is None:
                continue
                
            dist = haversine(lat, lng, place.latitude, place.longitude)
            
            if dist < min_dist:
                min_dist = dist
                closest_place = place
        except Exception as e:
            print(f"Error calculating distance for {place.name}: {e}")
            continue

    if closest_place and min_dist <= THRESHOLD_METERS:
        # Map fields
        closest_place.location_lat = closest_place.latitude
        closest_place.location_lng = closest_place.longitude
        if not closest_place.description: closest_place.description = closest_place.short_desc
        return closest_place
    
    debug_msg = f"No place found near this location."
    if closest_place:
        debug_msg += f" Closest: '{closest_place.name}' at {int(min_dist)}m."
    
    raise HTTPException(status_code=404, detail=debug_msg)

@router.get("/places/{place_id}", response_model=schemas.Place)
async def get_place(place_id: int, db: Session = Depends(get_db)):
    from app.models import all_models
    place = db.query(all_models.Place).filter(all_models.Place.id == place_id, all_models.Place.is_active == True).first()
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")
    
    place.location_lat = place.latitude
    place.location_lng = place.longitude

    if not place.description: place.description = place.short_desc
    return place

@router.get("/places/{place_id}/audio")
async def get_place_audio(
    place_id: int, 
    lang: str = Query("en", description="Language code (en, tr, etc.)"),
    mode: str = Query("short", description="Narration mode (short, long)"),
    db: Session = Depends(get_db)
) -> schemas.AudioResponse:
    from app.models import all_models
    place = db.query(all_models.Place).filter(all_models.Place.id == place_id, all_models.Place.is_active == True).first()
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")
    
    # Determine text to read
    text = place.description if mode == "long" else place.short_desc
    if not text:
        text = place.name # Fallback
        
    # In a real scenario, we would translate 'text' to 'lang' here.
    # For this demo, we assume the text is compatible or we just read it.
    # To make it cool, let's pretend to translate or use the existing text.
    # If the text is ASCII (likely English) and lang is 'tr', gTTS will read English with TR accent.
    # Ideally checking stored translations. For now, sending raw text to gTTS.
    
    mp3_fp = await ai_service.generate_audio_guide(text, lang)
    
    if not mp3_fp:
        raise HTTPException(status_code=500, detail="Audio generation failed")
        
    # Reset pointer before streaming
    mp3_fp.seek(0)
    import base64
    audio_b64 = base64.b64encode(mp3_fp.read()).decode('utf-8')
    
    return schemas.AudioResponse(
        audio_base64=audio_b64,
        content_type="audio/mpeg"
    )

@router.get("/places/{place_id}/intro", response_model=schemas.AudioResponse)
async def get_place_intro(
    place_id: int, 
    lang: str = "en", 
    db: Session = Depends(get_db)
):
    """
    Get a dynamic AI-generated welcome message for a place.
    """
    place = crud.place.get(db=db, id=place_id)
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")
        
    # 1. Get text from Gemini (or Fallback)
    intro_text = ai_service.get_welcome_message(place.name, lang)
    
    # 2. Convert to Audio
    audio_buffer = await ai_service.generate_audio_guide(intro_text, lang)
    
    if not audio_buffer:
        raise HTTPException(status_code=500, detail="Audio generation failed")
    
    # 3. Base64 encode
    import base64
    audio_b64 = base64.b64encode(audio_buffer.read()).decode('utf-8')
    
    return schemas.AudioResponse(
        audio_base64=audio_b64,
        text_content=intro_text
    )

@router.post("/translate", response_model=schemas.TranslationResponse)
async def translate_text(
    request: schemas.TranslationRequest
):
    """
    Translate text from source to target language.
    """
    return await ai_service.translate_text(request.text, request.source_lang, request.target_lang)

@router.post("/audio/speak", response_model=schemas.AudioResponse)
async def speak_text(
    request: schemas.TranslationRequest # Re-using this as it has 'text' and 'target_lang'
):
    """
    Generate audio for arbitrary text (e.g. Chat responses).
    """
    lang = request.target_lang
    # lang = request.target_lang
    # if lang not in ['en', 'tr']: lang = 'en'
    # Simplified: trust the request language or fallback in service if needed.
    # Service uses EN default if unmapped, but we mapped them.
    lang = request.target_lang
    
    mp3_fp = await ai_service.generate_audio_guide(request.text, lang)
    if not mp3_fp:
        raise HTTPException(status_code=500, detail="Audio generation failed")
        
    # Reset pointer before streaming
    mp3_fp.seek(0)
    import base64
    audio_b64 = base64.b64encode(mp3_fp.read()).decode('utf-8')
    
    return schemas.AudioResponse(
        audio_base64=audio_b64,
        content_type="audio/mpeg"
    )

@router.get("/places", response_model=List[schemas.Place])
async def get_places(db: Session = Depends(get_db)):
    from app.models import all_models
    places = db.query(all_models.Place).filter(all_models.Place.is_active == True, all_models.Place.parent_id == None).all()
    # Map fields for backward compatibility if needed
    for p in places:
        # Pydantic will map attributes, ensure naming matches or use aliases if models differ significantly
        # DB: latitude/longitude vs Schema: location_lat/location_lng
        p.location_lat = p.latitude
        p.location_lng = p.longitude
        if not p.description: p.description = p.short_desc
    return places

@router.get("/hotels", response_model=List[schemas.Hotel])
async def get_hotels(db: Session = Depends(get_db)):
    from app.models import all_models
    return db.query(all_models.Hotel).filter(all_models.Hotel.is_active == True).all()

@router.get("/restaurants", response_model=List[schemas.Restaurant])
async def get_restaurants(db: Session = Depends(get_db)):
    from app.models import all_models
    return db.query(all_models.Restaurant).filter(all_models.Restaurant.is_active == True).all()

@router.get("/shops", response_model=List[schemas.Shop])
async def get_shops(db: Session = Depends(get_db)):
    from app.models import all_models
    return db.query(all_models.Shop).filter(all_models.Shop.is_active == True).all()

@router.get("/config", response_model=List[schemas.ConfigResponse])
async def get_config(db: Session = Depends(get_db)):
    from app.models import all_models
    return db.query(all_models.GlobalConfig).all()

@router.post("/chat", response_model=schemas.ChatResponse)
async def chat_with_guide(request: schemas.ChatRequest):
    """
    Chat with the historical guide (Gemini).
    """
    response_text = ai_service.get_chat_response(request.query, request.context, request.lang)
    return schemas.ChatResponse(response=response_text)

router.include_router(login.router, tags=["login"])
router.include_router(admin.router, prefix="/admin", tags=["admin"])
