# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

LOCKED_FORECAST_PATH = "models/locked_forecast.csv"

app = FastAPI()

# -----------------------------
# CORS
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# LOAD LOCKED FORECAST
# -----------------------------
def load_locked_forecast():
    df = pd.read_csv(LOCKED_FORECAST_PATH)
    return df.to_dict(orient="records")

# -----------------------------
# ROOT
# -----------------------------
@app.get("/")
def root():
    return {"message": "Prophet API (LOCKED forecast, read-only)"}

# -----------------------------
# FORECAST ENDPOINT (LOCKED)
# -----------------------------
@app.get("/forecast")
def forecast():
    return pd.read_csv("models/locked_forecast.csv").to_dict(orient="records")
