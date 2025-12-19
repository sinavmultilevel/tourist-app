import sys
import os
import asyncio

# Add backend directory to path
sys.path.append(os.path.abspath("backend"))

from backend.app.services.ai_service import ai_service

async def verify_languages():
    languages = ['en', 'tr', 'ru', 'de', 'fr']
    print("Verifying TTS for languages:", languages)
    
    for lang in languages:
        text = "Hello"
        if lang == 'tr': text = "Merhaba"
        if lang == 'ru': text = "Привет"
        if lang == 'de': text = "Hallo"
        if lang == 'fr': text = "Bonjour"
        
        print(f"Testing {lang}...")
        try:
            audio = await ai_service.generate_audio_guide(text, lang)
            if audio and audio.getbuffer().nbytes > 0:
                print(f"[OK] {lang} success: {audio.getbuffer().nbytes} bytes generated")
            else:
                print(f"[FAIL] {lang} failed: Empty audio")
        except Exception as e:
            print(f"[ERROR] {lang} error: {e}")

if __name__ == "__main__":
    asyncio.run(verify_languages())
