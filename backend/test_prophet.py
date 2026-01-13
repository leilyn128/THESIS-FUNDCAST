from prophet import Prophet
import pandas as pd

df = pd.DataFrame({
    "ds": pd.date_range("2019", periods=5, freq="YE"),
    "y": [100, 120, 140, 160, 180]
})

m = Prophet()
m.fit(df)

future = m.make_future_dataframe(periods=2, freq="YE")
forecast = m.predict(future)

print(forecast[["ds", "yhat"]].tail())
