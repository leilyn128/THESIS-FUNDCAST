from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
from retrain_prophet import retrain_prophet

scheduler = BackgroundScheduler()

def auto_retrain():
    current_year = datetime.now().year
    cutoff_year = current_year - 1

    retrain_prophet(cutoff_year=cutoff_year)
    print(f"✅ Auto retrain completed for data up to {cutoff_year}")

# Run once every year (January 1st, 2:00 AM)
scheduler.add_job(
    auto_retrain,
    trigger="cron",
    month=1,
    day=1,
    hour=2,
    minute=0
)

scheduler.start()
