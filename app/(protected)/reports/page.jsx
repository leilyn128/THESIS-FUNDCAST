"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import PieChartComponent from "./components/PieChart";
import { useSearchParams } from "next/navigation";
import { categorizeExpense } from "../dashboard/components/expensePieChart";

export default function ReportsPage() {
  const [breakdown, setBreakdown] = useState([]);
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔑 HISTORY PAGE FILTERS
  const [filterYear, setFilterYear] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

const searchParams = useSearchParams();

const dashboardYear = (() => {
  const y = Number(searchParams.get("year"));
  return Number.isFinite(y) ? y : new Date().getFullYear();
})();

const fetchBreakdown = async () => {
  setLoading(true);
  setMessage("");

  let historyData = [];
  let uploadData = [];

  try {
    /* =========================
       1️⃣ HISTORY (≤ dashboardYear - 1)
    ========================= */
    const historyEndYear = dashboardYear - 1;

    const { data: history, error: historyError } = await supabase
      .from("barangay_budget_breakdown")
      .select("*")
      .gte("year", 2015)
      .lte("year", historyEndYear);

    if (historyError) throw historyError;

 historyData = history.map(row => ({
  year: row.year,
  category: row.category,
  subcategory:
    row.category === "Expenses"
      ? categorizeExpense(row.description)
      : row.subcategory || row.category,
  description: row.description,
  amount: Number(row.amount || 0),
  source: "history",
}));


/* =========================
   3️⃣ ACTUAL EXPENSES (FROM TRANSACTIONS)
========================= */
/* =========================
   3️⃣ ACTUAL EXPENSES (FROM TRANSACTIONS)
========================= */
const { data: tx, error: txError } = await supabase
  .from("transactions")
  .select("date, description, withdrawal");

if (txError) throw txError;

const transactionExpenses = tx
  .filter(t => t.withdrawal && t.withdrawal > 0)
  .map(t => ({
    year: new Date(t.date).getFullYear(),
    category: "Expenses",
    subcategory: categorizeExpense(t.description || ""),
    description: t.description || "Expense",
    amount: Number(t.withdrawal),
    source: "transactions",
  }));


    /* =========================
       2️⃣ UPLOADS (≥ dashboardYear)
       ALWAYS APPROPRIATIONS
    ========================= */
    const { data: uploads, error: uploadsError } = await supabase
      .from("budget_uploads")
      .select("*")
.gte("year", dashboardYear - 1)

    if (uploadsError) throw uploadsError;

    uploadData = uploads.map(row => ({
      year: row.year,
      category: "Appropriations",
      subcategory: row.category,
      description: row.description,
      amount: Number(row.amount || 0),
      source: "uploads",
    }));

    /* =========================
       3️⃣ MERGE & AGGREGATE
    ========================= */
const merged = [...historyData, ...uploadData, ...transactionExpenses];

    const aggregated = Object.values(
      merged.reduce((acc, row) => {
const key = `${row.year}|${row.category}|${row.subcategory}|${row.description}`;
        if (!acc[key]) acc[key] = { ...row, _key: key };
        else acc[key].amount += row.amount;
        return acc;
      }, {})
    );

    setBreakdown(aggregated);

 
const yearList = [];

for (let y = dashboardYear - 1; y >= 2015; y--) {
  yearList.push(y);
}

setYears(yearList);
;

  } catch (err) {
    console.error(err);
    setMessage("Failed to load budget data.");
  }

  setLoading(false);
};
useEffect(() => {
  if (!dashboardYear) return;
  fetchBreakdown();
}, [dashboardYear]);

const filteredData = breakdown.filter(row => {
  // 🔑 YEAR FILTER
  const matchYear =
    filterYear === "all"
      ? true
      : row.year === Number(filterYear);

  // 🔑 CATEGORY FILTER
  const matchCategory =
    selectedCategory === "all" || row.category === selectedCategory;

  return matchYear && matchCategory;
});

  /* =========================
     PIE CHART DATA
  ========================= */
  const pieChartData = filteredData.reduce((acc, row) => {
    const found = acc.find(i => i.subcategory === row.subcategory);
    if (found) found.amount += row.amount;
    else acc.push({ subcategory: row.subcategory, amount: row.amount });
    return acc;
  }, []);

  const totalAmount = pieChartData.reduce((s, i) => s + i.amount, 0);

  const pieChartWithPercentage = pieChartData.map(i => ({
    ...i,
    percentage: totalAmount ? (i.amount / totalAmount) * 100 : 0,
  }));

  const groupedByYear = filteredData.reduce((acc, row) => {
  if (!acc[row.year]) acc[row.year] = [];
  acc[row.year].push(row);
  return acc;
}, {});

const displayTotal = filteredData.reduce(
  (sum, row) => sum + row.amount,
  0
);
const totalLabel =
  selectedCategory === "Income"
    ? "Total Income"
    : selectedCategory === "Appropriations"
    ? "Total Appropriations"
    : selectedCategory === "Expenses"
    ? "Total Expenses"
    : "Total Budget Allocation";


  /* =========================
     RENDER
  ========================= */
 return (
  <div className="w-full h-screen overflow-hidden flex flex-col space-y-4">

    {/* PAGE HEADER */}
    <div className="rounded-2xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-700 px-6 py-5">
      <h1 className="text-2xl text-white font-semibold">📊 History</h1>
    </div>

    {/* MAIN CONTENT */}
    <section className="grid grid-cols-1 xl:grid-cols-4 gap-6 flex-1 overflow-hidden">

      {/* LEFT PANEL */}
      <div className="xl:col-span-3 bg-white p-6 rounded-lg shadow flex flex-col overflow-hidden">

        {/* TABLE HEADER */}
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            🏛 Barangay Budget Breakdown
          </h2>
          
        </div>

       {/* FILTER BAR */}
<div className="flex flex-wrap items-center gap-6 mb-4">

  {/* YEAR FILTER */}
  <div className="flex items-center gap-2">
    <span className="text-sm font-semibold text-gray-700">
      Year:
    </span>
    <select
      value={filterYear}
      onChange={e => setFilterYear(e.target.value)}
      className="px-4 py-2 border rounded-full text-sm font-medium
                 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
    >
      <option value="all">All</option>
      {years.map(y => (
        <option key={y} value={y}>{y}</option>
      ))}
    </select>
  </div>

  {/* CATEGORY FILTER */}
  <div className="flex items-center gap-2">
    <span className="text-sm font-semibold text-gray-700">
      Category:
    </span>
    <select
      value={selectedCategory}
      onChange={e => setSelectedCategory(e.target.value)}
      className="px-4 py-2 border rounded-full text-sm font-medium
                 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
    >
      <option value="all">All</option>
      <option value="Income">Income</option>
      <option value="Appropriations">Appropriations</option>
      <option value="Expenses">Expenses</option>
    </select>
  </div>

</div>

        {/* TABLE (SCROLLABLE ONLY) */}
<div className="border rounded-lg max-h-[800px] overflow-hidden">
          {loading ? (
            <p className="p-4">Loading…</p>
          ) : filteredData.length === 0 ? (
            <p className="p-4 italic text-gray-500">No data available.</p>
          ) : (
            <div className="h-full overflow-y-auto">
              <table className="w-full border-collapse text-sm font-mono tracking-wide">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    <th className="border px-4 py-2 text-left">Subcategory</th>
                    <th className="border px-4 py-2 text-left">Description</th>
                    <th className="border px-4 py-2 text-right">Amount (₱)</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredData.map(row => (
                    <tr key={row._key} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">{row.subcategory}</td>
                      <td className="border px-4 py-2">{row.description}</td>
                      <td className="border px-4 py-2 text-right">
                        ₱{row.amount.toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>

                <tfoot className="bg-slate-100 border-t-2 border-slate-400">
                  <tr>
                    <td
                      colSpan={2}
                      className="px-6 py-4 text-right text-sm font-bold text-slate-800 uppercase"
                    >
                      {totalLabel}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-green-700">
                      ₱{displayTotal.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>

  <div className="xl:col-span-1 flex flex-col items-center justify-start">
  <div className="w-full max-w-[420px] h-[600px]">
    <PieChartComponent data={pieChartWithPercentage} />
  </div>
</div>

    </section>
  </div>
);
}
