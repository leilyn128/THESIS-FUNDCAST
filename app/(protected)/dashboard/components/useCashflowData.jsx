"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabaseClient";

export function useCashflowData(year) {
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (year) fetchCashflow();
  }, [year]);

  const fetchCashflow = async () => {
    setLoading(true);

    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    // 1️⃣ Fetch transactions FOR SELECTED YEAR ONLY
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: true });

    if (error) {
      console.error("❌ Supabase fetch error:", error.message);
      setLoading(false);
      return;
    }

    // 2️⃣ Clean numeric values
    const mapped = (data || [])
      .filter((row) => row.date)
      .map((row) => ({
        ...row,
        deposit: Number(String(row.deposit || "0").replace(/[₱, ]/g, "")),
        withdrawal: Number(String(row.withdrawal || "0").replace(/[₱, ]/g, "")),
        balance: Number(String(row.balance || "0").replace(/[₱, ]/g, "")),

        // OPTIONAL: normalize categories (safe)
        incomeCategory: row.income_category || row.category || null,
        expenseCategory: row.expense_category || row.category || null,
      }));

    setTransactions(mapped);

    // 3️⃣ Aggregate per month
    const grouped = {};

    mapped.forEach((t) => {
      const d = new Date(t.date);
      const monthKey = d.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      if (!grouped[monthKey]) {
        grouped[monthKey] = {
          month: monthKey,
          income: 0,
          expense: 0,
          balance: 0,
        };
      }

      grouped[monthKey].income += t.deposit || 0;
      grouped[monthKey].expense += t.withdrawal || 0;

      // last balance of the month
      grouped[monthKey].balance = t.balance || grouped[monthKey].balance;
    });

    const monthlyArray = Object.values(grouped)
      .sort((a, b) => new Date(a.month) - new Date(b.month))
      .map((g) => ({
        ...g,
        net: g.income - g.expense,
      }));

    setChartData(monthlyArray);
    setLoading(false);
  };

  return {
    transactions,
    chartData,
    loading,
    refetch: fetchCashflow,
  };
}
