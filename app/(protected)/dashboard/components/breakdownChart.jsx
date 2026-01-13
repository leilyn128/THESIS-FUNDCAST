"use client";

import { useState } from "react";
import IncomePieChart from "./incomePieChart";
import ExpensePieChart from "./expensePieChart";

export default function BreakdownChart({ transactions }) {
  const [mode, setMode] = useState("income");

  // --- LABELS FOR LEGENDS ---
  const incomeLabels = [
    "Internal Revenue allotment (IRA)",
    "Interest income",
    "Other Income",
    "Rental fees",
    "Clearance & Certification fees",
    "Other business fees/income",
    "Community Tax",
    "Real Property Tax",
    "Subsidy from other LGUs"
  ];

  const expenseLabels = [
    "PS (Personal Services)",
    "MOOE",
    "20% BDF / Capital Outlay",
    "5% BDRRM Fund",
    "Other / Non-Office"
  ];

  // --- COLORS (must match your pie charts) ---
 const incomeCOLORS = [
  "#22c55e", "#0ea5e9", "#6366f1", "#14b8a6",
  "#84cc16", "#eab308", "#f97316", "#ef4444"
];

const expenseCOLORS = [
  "#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e",
  "#0ea5e9", "#6366f1", "#a855f7", "#ec4899", "#14b8a6"
];




  return (
    <div className="rounded-xl border border-emerald-200 bg-white shadow-md p-4">

      {/* HEADER */}
      <div className="flex items-center justify-between border-b pb-2 mb-3">
        <h2 className="text-emerald-700 font-semibold text-sm">
          Category Breakdown
        </h2>

        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="border rounded-md px-2 py-1 text-sm"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {/* --- PIE CHART --- */}
      <div className="w-full flex justify-center">
        {mode === "income" ? (
          <IncomePieChart transactions={transactions} />
        ) : (
          <ExpensePieChart transactions={transactions} />
        )}
      </div>

  

    </div>
  );
}
