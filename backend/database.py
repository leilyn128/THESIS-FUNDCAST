import pandas as pd
from supabase import create_client
import os

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Supabase environment variables are not set")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def get_budget_data():
    """
    Returns DataFrame:
    year | total_income
    """
    response = (
        supabase
        .from_("yearly_budget")          # ✅ v2 syntax
        .select("year,total_income")
        .order("year")
        .execute()
    )

    if not response.data:
        raise ValueError("No budget data found in database")

    df = pd.DataFrame(response.data)

    # Ensure correct types
    df["year"] = df["year"].astype(int)
    df["total_income"] = df["total_income"].astype(float)

    return df
