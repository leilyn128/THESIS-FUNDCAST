from database import get_db_connection
import pandas as pd

def load_yearly_income():
    query = """
        SELECT
            EXTRACT(YEAR FROM date) AS year,
            SUM(amount) AS amount
        FROM transactions
        WHERE type = 'income'
        GROUP BY year
        ORDER BY year
    """

    conn = get_db_connection()
    df = pd.read_sql(query, conn)
    conn.close()

    return df
