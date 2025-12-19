
import asyncio
import edge_tts
from app.services.ai_service import ai_service

async def test_audio():
    print("Testing Edge TTS generation...")
    try:
        mp3_io = await ai_service.generate_audio_guide("Hello, this is a test of the Khiva Guide audio system.", "en")
        if mp3_io:
            data = mp3_io.read()
            print(f"Success! Generated {len(data)} bytes of audio.")
            with open("test_output.mp3", "wb") as f:
                f.write(data)
            print("Saved to test_output.mp3")
        else:
            print("Failed: No data returned.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_audio())
