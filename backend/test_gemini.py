
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

GENAI_KEY = os.getenv("GEMINI_API_KEY")

if not GENAI_KEY:
    print("Error: No API Key found in env")
    exit(1)

print(f"Key found: {GENAI_KEY[:5]}...")

genai.configure(api_key=GENAI_KEY)

try:
    print("Attempting to list models...")
    with open("models.txt", "w") as f:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"- {m.name}")
                f.write(f"{m.name}\n")

    print("Models written to models.txt")
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content("Hello, can you hear me?")
    print(f"Success! Response: {response.text}")

except Exception as e:
    print(f"\nCRITICAL ERROR: {e}")
    import traceback
    traceback.print_exc()
