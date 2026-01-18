"use client"

import { useState, useEffect, useMemo } from "react";
import { categorizeExpense } from "../dashboard/components/expensePieChart";
import { supabase } from "../../../lib/supabaseClient";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

import { AlertCircle, BarChart3 } from "lucide-react";

// Hooks
import useBudgetData from "./lib/useBudgetData";
import useBreakdownData from "./lib/useBreakdownData";

// Components
import ExpensePieChart from "../dashboard/components/expensePieChart";
import SummaryCards from "./components/summaryCards";
import ForecastChart from "./components/forecastChart";
import ForecastSummary from "./components/forecastSummary";

export default function TransactionPage() {

  /* =========================
     BASIC STATE
  ========================= */
  const [session, setSession] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [error, setError] = useState(null);
  const [breakdown, setBreakdown] = useState([]);

  const { budgetData, loading, fetchBudgetData } = useBudgetData();
  const { fetchBreakdownData } = useBreakdownData();

  /* =========================
     YEAR SELECTION
  ========================= */
  const [selectedYear, setSelectedYear] = useState(null);

  /* =========================
     NEXT YEAR FORECAST
  ========================= */
  const nextYearForecast = useMemo(() => {
    if (!forecastData || forecastData.length === 0) return 0;
    return forecastData[0].value;
  }, [forecastData]);

  /* =========================
     LOAD FORECAST
  ========================= */
  useEffect(() => {
    if (budgetData.length > 0) loadForecast();
  }, [budgetData]);

  async function loadForecast() {
    try {
      setError(null);

      const res = await fetch("/api/forecast", { cache: "no-store" });
      if (!res.ok) throw new Error("Forecast failed");

      const data = await res.json();
      const lastYear = Math.max(...budgetData.map(d => d.year));

      setForecastData(
        data
          .filter(d => d.year > lastYear)
          .map(d => ({
            year: d.year,
            value: Number(d.prediction),
          }))
      );
    } catch {
      setError("Failed to load forecast data.");
    }
  }

  /* =========================
     FETCH HISTORICAL EXPENSES
  ========================= */
  useEffect(() => {
    const fetchHistoricalExpenses = async () => {
      const { data: bd } = await supabase
        .from("barangay_budget_breakdown")
        .select("description, amount")
        .eq("category", "Expenses")
        .gte("year", 2023)
        .lte("year", 2024);

      const { data: tx } = await supabase
        .from("transactions")
        .select("description, withdrawal")
        .gte("date", "2025-01-01")
        .lte("date", "2025-12-31");

      const breakdownExpenses = (bd || []).map(r => ({
        description: r.description,
        amount: Number(r.amount),
      }));

      const transactionExpenses = (tx || [])
        .filter(t => t.withdrawal > 0)
        .map(t => ({
          description: t.description,
          amount: Number(t.withdrawal),
        }));

      setBreakdown([
        ...breakdownExpenses,
        ...transactionExpenses,
      ]);
    };

    fetchHistoricalExpenses();
  }, []);

  /* =========================
     EXPENSE SOURCE
  ========================= */
  const expenseSourceData = useMemo(() => {
    if (forecastData.some(f => f.year >= 2026)) {
      return breakdown;
    }
    return [];
  }, [forecastData, breakdown]);

  /* =========================
     EXPENSE STATS
  ========================= */
  const expenseStats = useMemo(() => {
    const stats = {};

    expenseSourceData.forEach(item => {
      const category = categorizeExpense(item.description);
      const subcategory = item.description;

      if (!stats[category]) {
        stats[category] = { total: 0, items: {} };
      }

      stats[category].total += item.amount;
      stats[category].items[subcategory] =
        (stats[category].items[subcategory] || 0) + item.amount;
    });

    return stats;
  }, [expenseSourceData]);

  /* =========================
     UTILIZATION RATIOS
  ========================= */
  const utilizationRatios = useMemo(() => {
    const ratios = {};
    const totalExpenses = Object.values(expenseStats)
      .reduce((s, c) => s + c.total, 0);

    if (totalExpenses === 0) return {};

    Object.entries(expenseStats).forEach(([category, data]) => {
      ratios[category] = data.total / totalExpenses;
    });

    return ratios;
  }, [expenseStats]);

  /* =========================
     MULTI-YEAR ALLOCATIONS
  ========================= */
  const multiYearSuggestedAllocations = useMemo(() => {
    if (!forecastData.length) return [];

    return forecastData
      .map(forecast => {
        const total = Number(forecast.value);
        if (!Number.isFinite(total) || total <= 0) return null;

        return {
          year: forecast.year,
          allocations: Object.entries(utilizationRatios).map(
            ([category, ratio]) => ({
              name: category,
              percentage: +(ratio * 100).toFixed(2),
              amount: total * ratio,
              description: "Based on historical expense utilization",
            })
          ),
        };
      })
      .filter(Boolean);
  }, [forecastData, utilizationRatios]);

  /* =========================
     SELECTED YEAR
  ========================= */
const selectedYearAllocation = useMemo(() => {
  if (!selectedYear) return null;
  return multiYearSuggestedAllocations.find(
    y => y.year === selectedYear
  );
}, [multiYearSuggestedAllocations, selectedYear]);

const allocationData = selectedYearAllocation?.allocations || [];

const allocationTotal = allocationData.reduce(
  (sum, item) => sum + item.amount,
  0
);

useEffect(() => {
  if (forecastData.length && !selectedYear) {
    setSelectedYear(forecastData[0].year);
  }
}, [forecastData, selectedYear]);

  /* =========================
     AUTH
  ========================= */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchBudgetData();
        fetchBreakdownData();
      }
    });
  }, []);

  /* =========================
     DEBUG
  ========================= */
  console.log("Forecast value:", nextYearForecast);
  console.log("Utilization ratios:", utilizationRatios);
  console.log("Breakdown length:", breakdown.length);
  console.log("Expense source data:", expenseSourceData);
  console.log("Expense stats:", expenseStats);


/* ---------------- UI ---------------- */
return (
  <div className="min-h-screen w-full bg-slate-50 overflow-x-hidden">
  <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6">


      
      {/* HEADER SECTION */}
      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
<div className="px-8 py-6 bg-gradient-to-r from-emerald-700 to-emerald-600">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <span className="text-white text-lg">📈</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                      Forecasting Analysis
                    </h1>
                    
                  </div>
                </div>
                
              </div>
              <div className="flex gap-3">
                
              </div>
            </div>
          </div>
          
        
        </div>
      </div>

      {/* ERROR STATE */}
      {error && (
        <div className="mb-6">
          <div className="bg-white border border-red-200 rounded-lg shadow-sm">
            <div className="px-6 py-4 flex items-start gap-3">
              <div className="mt-0.5">
                <AlertCircle className="text-red-500 h-5 w-5 flex-shrink-0" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-red-800">Forecast Error</h4>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
              <button className="text-sm text-red-600 hover:text-red-800 font-medium">
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOADING STATE */}
      {loading && (
        <div className="mb-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="p-16 text-center">
              <div className="inline-flex flex-col items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-3 border-slate-200 border-t-emerald-600 mb-4"></div>
                <p className="text-slate-700 font-medium mb-2">Loading forecast analytics...</p>
                <p className="text-sm text-slate-500">Processing historical data and generating insights</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      {forecastData.length > 0 && (
        <>
          {/* CHARTS SECTION */}
          <div className="mb-8">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* MAIN FORECAST CHART */}
              <div className="xl:col-span-2">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full">
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        Budget Forecast Analysis
                      </h2>
                     
                    </div>
                    <div className="flex gap-2">
                     
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="h-96">
                      <ForecastChart
                        historyData={budgetData}
                        forecastData={forecastData}
                      />
                    </div>
                    <div className="mt-6">
  <ForecastSummary
  data={forecastData}
  selectedYear={selectedYear}
  lastActualYear={Math.max(...budgetData.map(b => b.year))}
  lastActualValue={
    budgetData.find(b => b.year === Math.max(...budgetData.map(b => b.year)))
      ?.amount
  }
/>

</div>

                  </div>
                </div>
              </div>
{/* RECOMMENDATIONS SECTION */}
          <div className="mb-8">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
       

                  {/* ALLOCATION VISUALIZATION */}
                  <div className="lg:col-span-1">
                    <div className="bg-gradient-to-b from-slate-50 to-white rounded-lg border border-slate-200 p-6 h-full">
                      <h3 className="text-base font-semibold text-slate-900 mb-15">
                        Proposed Allocation
                      </h3>
                      
                      {/* PIE CHART */}
                      <div className="mb-8">
                        <ResponsiveContainer width="100%" height={220}>
                          <PieChart>
                            <Pie
  data={allocationData}
  dataKey="amount"
  nameKey="name"

                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              innerRadius={35}
                              label={false}
                              stroke="#ffffff"
                              strokeWidth={3}
                            >
                              {allocationData.map((_, index) => (
                                <Cell
                                  key={index}
                                  fill={[
                                    "#0ea5e9", // PS - sky blue
                                    "#ef4444", // MOOE - red
                                    "#f59e0b", // BDF - amber
                                    "#6366f1", // BDRRM - indigo
                                    "#8b5cf6", // SK - violet
                                    "#64748b", // Other - slate
                                  ][index]}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value) => [`₱${Number(value).toLocaleString()}`, 'Allocation']}
                              contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                padding: '12px',
                                fontSize: '12px'
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
<select
  value={selectedYear ?? ""}
  onChange={(e) => setSelectedYear(Number(e.target.value))}
  className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
>
  {forecastData.map((f, index) => (
    <option key={f.year} value={f.year}>
        {f.year}
    </option>
  ))}
</select>

                      {/* ALLOCATION DETAILS */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
  <span className="text-slate-700 font-medium">
    Predicted Budget ({selectedYear})
  </span>
  <span className="text-slate-900 font-bold">
    ₱{allocationData
      .reduce((sum, item) => sum + item.amount, 0)
      .toLocaleString("en-PH", { minimumFractionDigits: 2 })}
  </span>
</div>

                        
                        <div className="space-y-3">
                          {allocationData.map((item, index) => (
                            <div key={item.name} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100">
                              <div className="flex items-center gap-3">
                                <div
                                  className="h-3 w-3 rounded-full flex-shrink-0"
                                  style={{
                                    backgroundColor: [
                                      "#0ea5e9", "#ef4444", "#f59e0b", 
                                      "#6366f1", "#8b5cf6", "#64748b"
                                    ][index],
                                  }}
                                />
                                <span className="text-sm font-medium text-slate-700">{item.name}</span>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-semibold text-slate-900">
₱{Number(item.amount).toLocaleString("en-PH", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})}
                                </div>
                                <div className="text-xs text-slate-500">
{(
  (item.amount /
    allocationData.reduce((sum, i) => sum + i.amount, 0)) *
  100
).toFixed(1)}%
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
             
              
            </div>
          </div>

          
         
     

         
        </>
      )}

      {/* EMPTY STATE */}
      {!loading && budgetData.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 max-w-2xl mx-auto">
            <div className="mx-auto h-20 w-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-6">
              <BarChart3 className="h-10 w-10 text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              No Budget Data Available
            </h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Upload historical budget data to generate AI-powered forecasts and strategic recommendations
            </p>
            <div className="flex gap-4 justify-center">
              <button className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200">
                View Sample Report
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700">
                <span className="flex items-center gap-2">
                  <span>📤</span>
                  <span>Upload Budget Data</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  </div>
);

}