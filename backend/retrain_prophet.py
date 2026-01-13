# train_prophet.py
import pandas as pd
import pickle
from datetime import datetime
from prophet import Prophet
from data_loader import load_yearly_income

MODEL_PATH = "models/prophet.pkl"

def train_prophet(cutoff_year: int):
    # 1️⃣ Load yearly income aggregated from transactions
    df = load_yearly_income()

    # 2️⃣ Apply cutoff year (NO DATA LEAKAGE)
    df = df[df["year"] <= cutoff_year]

    # 3️⃣ Prepare Prophet format
    df["ds"] = pd.to_datetime(df["year"], format="%Y")
    df["y"] = df["amount"]
    df = df[["ds", "y"]]

    # 4️⃣ Train Prophet (YEARLY DATA → NO SEASONALITY)
    model = Prophet(
        growth="linear",
        yearly_seasonality=False,
        weekly_seasonality=False,
        daily_seasonality=False,
        changepoint_prior_scale=0.15,
        changepoint_range=0.9,
        interval_width=0.95
    )

    model.fit(df)

    # 5️⃣ Save model
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model, f)

    print(f"✅ Prophet retrained using data up to {cutoff_year}")

# -----------------------------
# AUTO MODE (called by scheduler)
# -----------------------------
if __name__ == "__main__":
    current_year = datetime.now().year
    cutoff_year = current_year - 1
    train_prophet(cutoff_year)
