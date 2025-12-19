
import requests
import os

API_URL = "http://localhost:8000/api/v1"

def test_flow():
    # 1. Upload Image
    print("1. Testing Upload...")
    
    # Create a dummy image file
    with open("test_image.txt", "w") as f:
        f.write("dummy image content")
        
    files = {"file": ("test.txt", open("test_image.txt", "rb"), "text/plain")}
    
    try:
        upload_res = requests.post(f"{API_URL}/upload", files=files)
        if upload_res.status_code != 200:
            print(f"FAILED: Upload failed with {upload_res.status_code} {upload_res.text}")
            return
            
        image_url = upload_res.json()["url"]
        print(f"SUCCESS: Uploaded to {image_url}")
        
    except Exception as e:
        print(f"FAILED: Connection error {e}")
        return

    # 2. Create Shop with Image
    print("\n2. Testing Create Shop with Image...")
    shop_data = {
        "name": "Test Photo Shop",
        "is_handmade": True,
        "is_verified": True,
        "commission_rate": 10.0,
        "admin_notes": "Test note",
        "is_active": True,
        "photo_url": image_url
    }
    
    # Create admin token (mock or login) - verifying if admin endpoints are protected
    # Based on previous logs, admin endpoints might need auth.
    # Let's try login first.
    
    # Simple check if I can hit admin without auth, usually 401.
    # But I'll assume I need to handle auth if previous steps implemented it.
    # Let's try to bypass or login.
    
    # Login as admin
    login_data = {"username": "admin@ichankala.com", "password": "admin123"}
    auth_res = requests.post(f"{API_URL}/login/access-token", data=login_data)
    
    headers = {}
    if auth_res.status_code == 200:
        token = auth_res.json()["access_token"]
        headers["Authorization"] = f"Bearer {token}"
        print("SUCCESS: Logged in as admin")
    else:
        print(f"WARNING: Login failed {auth_res.status_code}, trying unauthenticated (might fail)")

    try:
        create_res = requests.post(f"{API_URL}/admin/shops", json=shop_data, headers=headers)
        if create_res.status_code not in [200, 201]:
             print(f"FAILED: Create shop failed {create_res.status_code} {create_res.text}")
             return
             
        shop_id = create_res.json()["id"]
        print(f"SUCCESS: Created shop ID {shop_id}")
        
    except Exception as e:
        print(f"FAILED: {e}")
        return

    # 3. Verify Persistence
    print("\n3. Verifying Persistence...")
    get_res = requests.get(f"{API_URL}/shops") # Public endpoint
    if get_res.status_code != 200:
        print("FAILED: Could not fetch public shops")
        return
        
    shops = get_res.json()
    saved_shop = next((s for s in shops if s["id"] == shop_id), None)
    
    if saved_shop:
        print(f"Found shop: {saved_shop['name']}")
        print(f"Saved photo_url: {saved_shop.get('photo_url')}")
        
        if saved_shop.get('photo_url') == image_url:
            print("TEST PASSED: Photo URL persisted correctly!")
        else:
            print("TEST FAILED: Photo URL mismatch or missing.")
    else:
        print("FAILED: Created shop not found in list.")
        
    # Cleanup
    if os.path.exists("test_image.txt"):
        os.remove("test_image.txt")

if __name__ == "__main__":
    test_flow()
