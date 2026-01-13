from fastapi import APIRouter, BackgroundTasks
from services.prophet_service import get_forecast
router = APIRouter()

@router.get("/forecast/prophet")
def forecast_prophet(periods: int = 5):
    return get_forecast(periods)

@router.post("/retrain/prophet")
def retrain_prophet(background_tasks: BackgroundTasks):
    background_tasks.add_task(train_prophet)
    return {"status": "Retraining started"}
