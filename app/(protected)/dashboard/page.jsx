"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import CashflowChart from "./components/cashflowChart.jsx";
import { useCashflowData } from "./components/useCashflowData";
import KPICards from "./components/kpiCards";
import BreakdownChart from "./components/breakdownChart";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  

  

  // =========================
  // YEAR SETUP (2025 ONWARDS)
  // =========================
  const START_YEAR = 2025;
  const currentYear = new Date().getFullYear();

  // Generate years from 2025 → currentYear + 5
  const years = Array.from(
    { length: currentYear - START_YEAR + 6 },
    (_, i) => START_YEAR + i
  );

  // Year from URL or fallback to latest available
  const yearFromUrl = Number(searchParams.get("year"));
  const defaultYear = years.includes(yearFromUrl)
    ? yearFromUrl
    : currentYear >= START_YEAR
    ? currentYear
    : START_YEAR;

  const [selectedYear, setSelectedYear] = useState(defaultYear);

  // Keep state synced with URL
  useEffect(() => {
    if (yearFromUrl && yearFromUrl !== selectedYear) {
      setSelectedYear(yearFromUrl);
    }
  }, [yearFromUrl]);

  const recalculateBalances = (txns) => {
  let runningBalance = 0;

  return txns.map((t, index) => {
    // Beginning balance (first row, deposit-only)
    if (index === 0 && t.deposit > 0 && !t.withdrawal) {
      runningBalance = t.deposit;
      return { ...t, balance: runningBalance };
    }

    runningBalance += (t.deposit || 0) - (t.withdrawal || 0);
    return { ...t, balance: runningBalance };
  });
};

  // =========================
  // DATA FETCH
  // =========================
  const {
    transactions: fetchedTransactions,
    chartData,
    loading,
  } = useCashflowData(selectedYear);

  const [transactions, setTransactions] = useState([]);

useEffect(() => {
  if (!fetchedTransactions) return;

  // 🔹 2025 = legacy data (DO NOT TOUCH balances)
  if (selectedYear === 2025) {
    setTransactions(fetchedTransactions);
    return;
  }

  // 🔹 2026+ = new accounting rules
  const recalculated = recalculateBalances(fetchedTransactions);
  setTransactions(recalculated);

}, [fetchedTransactions, selectedYear]);


  // =========================
  // KPI CALCULATIONS
  // =========================
  const totalIncome =
    chartData?.reduce((a, r) => a + (r.income || 0), 0) || 0;

  const totalExpense =
    chartData?.reduce((a, r) => a + (r.expense || 0), 0) || 0;

  const beginningBalance =
  transactions.find(
    (t, i) => i === 0 && t.deposit > 0 && !t.withdrawal
  )?.balance || 0;

const runningBalance =
  transactions.length > 0
    ? transactions[transactions.length - 1].balance
    : 0;

  const lastMonth = chartData.length
    ? chartData[chartData.length - 1]
    : null;

  const monthlySurplus = lastMonth
    ? (lastMonth.income || 0) - (lastMonth.expense || 0)
    : 0;

  const totals = {
    beginningBalance,
    totalIncome,
    totalExpense,
    runningBalance,
    monthlySurplus,
  };

  // =========================
  // LOADING STATE
  // =========================
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500 animate-pulse">
          Loading financial dashboard…
        </p>
      </div>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="w-full">

      {/* HEADER */}
      <header className="mb-6">
        <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-600 px-6 py-5 shadow-sm">
          <h1 className="text-2xl md:text-3xl font-semibold text-white">
            Cash Flow Overview
          </h1>

          {/* YEAR FILTER (2025 ONWARDS, AUTO, URL-SYNCED) */}
          <select
  value={selectedYear}
  onChange={(e) => {
    const year = Number(e.target.value);
    router.push(`?year=${year}`); // ✅ THIS IS THE KEY
  }}
  className="rounded-lg bg-white px-3 py-1 text-sm font-medium text-slate-800 shadow"
>
  {years.map((year) => (
    <option key={year} value={year}>
      {year}
    </option>
  ))}
</select>

        </div>
      </header>

      {/* KPI SECTION */}
      <section className="space-y-4">
        <KPICards totals={totals} />
      </section>

      {/* ANALYTICS GRID */}
      <section className="grid grid-cols-1 xl:grid-cols-4 gap-5 mt-5">

        {/* MAIN CHART */}
        <div className="xl:col-span-3">
          <Card className="rounded-2xl border border-slate-500 shadow-sm bg-white">
            <CardHeader className="border-b border-slate-500 bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <CardTitle className="text-xl font-semibold text-slate-800">
                  Monthly Income vs Expense ({selectedYear})
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent className="p-5">
              <div className="h-[650px]">
                <CashflowChart data={chartData} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CATEGORY BREAKDOWN */}
        <BreakdownChart transactions={transactions} />

      </section>
    </div>
  );
}
