import urllib.request
import urllib.error
import json

req = urllib.request.Request('http://localhost:8000/api/auth/signup', 
    data=json.dumps({"name":"Test","email":"test@test.com","password":"password123"}).encode(),
    headers={'Content-Type': 'application/json'},
    method='POST')

try:
    with urllib.request.urlopen(req) as response:
        print(response.read().decode())
except urllib.error.HTTPError as e:
    print(f"HTTP {e.code}: {e.read().decode()}")
except Exception as e:
    print(str(e))
