from io import BytesIO
import edge_tts
from app.schemas import schemas
import asyncio
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
GENAI_KEY = os.getenv("GEMINI_API_KEY")
if GENAI_KEY:
    genai.configure(api_key=GENAI_KEY)

# Fallback content for when AI is offline/quota exceeded
FALLBACK_DATA = {
    "Kalta Minor Minaret": "Welcome to the Kalta Minor Minaret. This iconic turquoise tower was intended to be the tallest minaret in the Islamic world but was never finished. Its vibrant blue tiles make it a symbol of Khiva.",
    "West Gate of Itchan Kala": "Welcome to the West Gate, also known as Ata Darvaza. This is the main entrance to the ancient fortress of Ichan Kala. Step through these gates to travel back in time.",
    "Kunta Ark Citadel": "Welcome to Kunta Ark, the fortress within a fortress. This citadel served as the residence for the Khans of Khiva and houses the throne room, harem, and old prison.",
    "Juma Mosque": "Welcome to the Juma Mosque. This unique mosque is famous for its 213 carved wooden columns, some dating back to the 10th century. Notice how the light plays through the opening in the roof.",
    "Tash Hauli Palace": "Welcome to Tash Hauli Palace, known as the Stone Palace. Explore its three main courtyards and marvel at the intricate blue tile work that adorns every surface.",
    "Pahlavan Mahmud Mausoleum": "Welcome to the Pahlavan Mahmud Mausoleum. This sacred site honors the patron saint of Khiva, a legendary poet and wrestler. It is considered one of the most beautiful spots in the city.",
    "Islam Khoja Minaret": "Welcome to the Islam Khoja Minaret. It is the tallest minaret in Khiva, standing at 57 meters. You can see its glowing bands of glazed tiles from miles away.",
    "Muhammad Amin Khan Madrasah": "Welcome to the Muhammad Amin Khan Madrasah. Historically the largest madrasah in Central Asia, it is now the Orient Star Hotel. It stands right next to the Kalta Minor."
}

class MockAIService:
    @staticmethod
    async def generate_audio_guide(text: str, lang: str = 'en') -> BytesIO:
        """
        Generates audio from text using Microsoft Edge TTS (free neural voices).
        Returns a BytesIO object containing the MP3 data.
        """
        try:
            # Select voice based on language
            voice = "en-US-ChristopherNeural"  # Deep, documentary-style male voice
            if lang == 'tr':
                voice = "tr-TR-AhmetNeural"
            elif lang == 'ru':
                voice = "ru-RU-DmitryNeural"
            elif lang == 'de':
                voice = "de-DE-ConradNeural"
            elif lang == 'fr':
                voice = "fr-FR-HenriNeural"
            
            communicate = edge_tts.Communicate(text, voice)
            mp3_fp = BytesIO()
            
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    mp3_fp.write(chunk["data"])
            
            mp3_fp.seek(0)
            return mp3_fp
        except Exception as e:
            print(f"Error generating audio: {e}")
            return None

    @staticmethod
    def get_chat_response(query: str, context: str, lang: str = 'en') -> str:
        """
        Generates a chat response using Gemini.
        """
        if not GENAI_KEY:
            return "Error: Gemini API Key not configured."
            
        try:
            # Switch to 'lite' model
            model = genai.GenerativeModel('gemini-2.0-flash-lite-preview-02-05')
            
            system_instruction = (
                f"You are a knowledgeable and friendly historical tour guide in Ichan Kala, Khiva using the name 'Hiva Guide'. "
                f"The user is currently at or asking about: '{context}'. "
                f"Answer their question briefly and naturally in the language '{lang}'. "
                f"Keep answers under 3 sentences unless asked for more detail. "
                f"If the question is unrelated to Khiva or history, gracefully steer it back."
            )
            
            response = model.generate_content(f"{system_instruction}\nUser: {query}")
            return response.text
        except Exception as e:
            print(f"Gemini Chat Error: {e}")
            # Robust fallback logic
            if "429" in str(e):
                return "My connection is very busy right now. But I can tell you that you are in the heart of history!"
            return "I'm having a little trouble connecting to my knowledge base right now."

    @staticmethod
    def get_welcome_message(place_name: str, lang: str = 'en') -> str:
        """
        Generates a short, engaging welcome speech for a place using Gemini.
        """
        if not GENAI_KEY:
            return f"Welcome to {place_name}."
            
        try:
            # Switch to 'lite' model for better efficiency/quota
            model = genai.GenerativeModel('gemini-2.0-flash-lite-preview-02-05')
            
            prompt = (
                f"Act as an enthusiastic and knowledgeable tour guide in Khiva named 'Hiva Guide'. "
                f"The user has just arrived at the structure: '{place_name}'. "
                f"Give a warm, short (max 2 sentences), and engaging opening speech introducing this specific building. "
                f"Mention that it is one of the most popular places if appropriate. "
                f"Do NOT give a full history lesson yet, just a hook. "
                f"IMPORTANT: Provide the response as PLAIN TEXT only. Do not use Markdown, HTML tags, or quotes."
                f"Language: {lang}."
            )
            
            response = model.generate_content(prompt)
            # Extra cleanup just in case
            clean_text = response.text.replace('```', '').replace('*', '').replace('>', '').replace('</blockquote>', '').strip()
            return clean_text
        except Exception as e:
            print(f"Gemini Welcome Error: {e}")
            # Smart Fallback using predefined content
            if place_name in FALLBACK_DATA:
                return FALLBACK_DATA[place_name]
                
            return f"Welcome to {place_name}. This is one of the most fascinating historical sites in Ichan Kala."

    @staticmethod
    def identify_place(image_bytes: bytes) -> schemas.IdentificationResponse:
        # Simulate processing time
        return schemas.IdentificationResponse(
            name="Kalta Minor Minaret",
            description="The unfinished turquoise minaret, symbol of Khiva.",
            history="Commissioned in 1851 by Mohammed Amin Khan, intended to be the tallest in the Islamic world.",
            significance="A masterpiece of Khivan architecture, covered in glazed tiles.",
            audio_url="/static/audio/kalta_minor_demo.mp3"
        )

    @staticmethod
    def generate_plan(request: schemas.PlanRequest) -> schemas.PlanResponse:
        plan = {
            "title": f"My {request.days}-Day Khiva Trip",
            "days": []
        }
        for i in range(request.days):
            plan["days"].append({
                "day": i + 1,
                "morning": "Visit Ichan Kala basic gates",
                "lunch": "Lunch at Terrassa Cafe",
                "afternoon": "Kunta Ark and Museums",
                "dinner": "Dinner at local Tea House"
            })
        return schemas.PlanResponse(itinerary=plan)

    @staticmethod
    def analyze_product(image_bytes: bytes) -> schemas.ProductAnalysisResponse:
        return schemas.ProductAnalysisResponse(
            authenticity="Authentic Handmade",
            price_range="$20 - $35",
            details="This appears to be a genuine suzani embroidery with traditional silk threads."
        )

    @staticmethod
    async def translate_text(text: str, source_lang: str, target_lang: str) -> schemas.TranslationResponse:
        """
        Translates text using the free MyMemory API.
        """
        import urllib.parse
        import urllib.request
        import json
        
        try:
            # Prepare URL safely
            encoded_text = urllib.parse.quote(text)
            lang_pair = f"{source_lang}|{target_lang}"
            url = f"https://api.mymemory.translated.net/get?q={encoded_text}&langpair={lang_pair}"
            
            # Simple synchronous request (blocking is fine for prototype)
            # wrapping in try/except to catch ANY network/parsing error
            try:
                # 5 second timeout to prevent hanging
                with urllib.request.urlopen(url, timeout=5.0) as response:
                    data = json.loads(response.read().decode())
                    
                if 'responseData' in data and data['responseData']['translatedText']:
                     return schemas.TranslationResponse(
                        original=text,
                        translated=data['responseData']['translatedText']
                    )
            except Exception as e:
                print(f"MyMemory API Failed: {e}")
                # Proceed to fallback below
        
        except Exception as e:
            print(f"Critical Translation Error: {e}")
            
        # Ultimate Fallback if API fails
        return schemas.TranslationResponse(
            original=text,
            translated=f"[{target_lang}] {text}" 
        )


ai_service = MockAIService()
