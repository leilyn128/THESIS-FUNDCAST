# train_prophet.py
import pandas as pd
import pickle
from prophet import Prophet
from data_loader import load_yearly_data

MODEL_PATH = "models/prophet.pkl"

def train_prophet():
    df = load_yearly_data()

    df["ds"] = pd.to_datetime(df["year"], format="%Y")
    df["y"] = df["amount"]
    df = df[["ds", "y"]]

    model = Prophet(
        yearly_seasonality=True,
        weekly_seasonality=False,
        daily_seasonality=False,
        changepoint_prior_scale=0.1
    )

    model.fit(df)

    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model, f)

    print("✅ Prophet model trained and saved")

if __name__ == "__main__":
    train_prophet()
