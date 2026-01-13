import pandas as pd
import joblib
from prophet import Prophet
from database import get_budget_data   # ✅ Python DB function
import joblib

MODEL_PATH = "models/prophet.pkl"

def load_model():
    return joblib.load(MODEL_PATH)


def load_budget_data_from_db():
    """
    Must return a DataFrame with:
    year | total_income
    """
    df = get_budget_data()  # <-- includes 2025 if saved
    return df


def train_prophet():
    df = load_budget_data_from_db()

    df = df.rename(columns={
        "year": "ds",
        "total_income": "y"
    })

    df["ds"] = pd.to_datetime(df["ds"], format="%Y")

    model = Prophet()
    model.fit(df)

    joblib.dump(model, MODEL_PATH)


def get_forecast(periods=5):
    model = joblib.load(MODEL_PATH)

    df = load_budget_data_from_db()
    last_year = df["year"].max()

    future = pd.DataFrame({
        "ds": pd.date_range(
            start=f"{last_year + 1}-01-01",
            periods=periods,
            freq="Y"
        )
    })

    forecast = model.predict(future)

    # DEBUG PRINT
    print(forecast[["ds", "yhat"]])

    forecast["year"] = forecast["ds"].dt.year

    return forecast[["year", "yhat", "yhat_lower", "yhat_upper"]]

