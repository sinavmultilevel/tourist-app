
import requests
import time

try:
    start = time.time()
    url = "http://localhost:8000/api/v1/places"
    print(f"Requesting: {url}")
    
    response = requests.get(url, timeout=5)
    
    duration = time.time() - start
    print(f"Status: {response.status_code}")
    print(f"Time: {duration:.4f}s")
    print(f"Places Count: {len(response.json())}")
    
except Exception as e:
    print(f"FAILED: {e}")
