import os
import pytest
from fastapi.testclient import TestClient
from backend.main import app

# Mock the environment variables if needed
@pytest.fixture(autouse=True)
def set_env_vars(monkeypatch):
    monkeypatch.setenv("SUPABASE_URL", "https://ovvqzbsarnzfbdxnkikr.supabase.co")
    monkeypatch.setenv("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")

client = TestClient(app)

# Test if the root endpoint is working
def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello, world!"}

# Test the aggregate yearly endpoint
def test_aggregate_yearly():
    response = client.post("/aggregate/yearly")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert data["status"] == "ok"

# Test the retrain ARIMA endpoint
def test_retrain_arima():
    response = client.post("/retrain/arima")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert data["status"] == "success"

# Test the forecast ARIMA endpoint
def test_forecast_arima():
    response = client.get("/forecast/arima")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert data["status"] == "success"
    assert "forecast_years" in data
    assert "forecast_values" in data
