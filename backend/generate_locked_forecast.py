# generate_locked_forecast.py
import joblib
import pandas as pd

MODEL_PATH = "models/prophet.pkl"
LOCKED_FORECAST_PATH = "models/locked_forecast.csv"

def generate_locked_forecast(periods=3):
    model = joblib.load(MODEL_PATH)

    future = model.make_future_dataframe(periods=periods, freq="YE")
    forecast = model.predict(future)

    # 🔒 ONLY USE yhat (since bounds do not exist)
    locked = forecast.tail(periods)[["ds", "yhat"]]
    locked["year"] = locked["ds"].dt.year

    locked.to_csv(LOCKED_FORECAST_PATH, index=False)
    print("🔒 Forecast generated and LOCKED (yhat only)")

if __name__ == "__main__":
    generate_locked_forecast()
