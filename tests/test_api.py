from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)


def test_root_endpoint():
    response = client.get("/")

    assert response.status_code == 200
    assert "running" in response.json()["message"]


def test_health_endpoint():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_system_endpoint():
    response = client.get("/api/v1/system")

    assert response.status_code == 200
    data = response.json()
    assert "app_name" in data
    assert "version" in data
    assert data["status"] == "healthy"
