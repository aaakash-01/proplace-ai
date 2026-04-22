from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

response = client.post(
    "/api/auth/signup",
    json={"name": "Test", "email": "test@test.com", "password": "password123"},
)

print(f"Status: {response.status_code}")
print(f"Body: {response.text}")
