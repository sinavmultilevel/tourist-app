
import requests
import time

try:
    start = time.time()
    # Mocking coordinates close to 'benim evim' (80m away)
    url = "http://localhost:8000/api/v1/places/by-location?lat=41.54916&lng=60.61947"
    print(f"Requesting: {url}")
    
    response = requests.get(url, timeout=5)
    
    duration = time.time() - start
    print(f"Status: {response.status_code}")
    print(f"Time: {duration:.4f}s")
    print(f"Response: {response.text}")
    
except Exception as e:
    print(f"FAILED: {e}")
