
import math

def haversine(lat1, lon1, lat2, lon2):
    R = 6371000  # Earth radius in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    
    a = math.sin(delta_phi / 2)**2 + \
        math.cos(phi1) * math.cos(phi2) * \
        math.sin(delta_lambda / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c

# User Coords
user_lat = 41.54916
user_lng = 60.61947

# DB Coords (benim evim)
db_lat = 41.54988334733401
db_lng = 60.61945962810375

dist = haversine(user_lat, user_lng, db_lat, db_lng)
print(f"Calculated Distance: {dist} meters")
