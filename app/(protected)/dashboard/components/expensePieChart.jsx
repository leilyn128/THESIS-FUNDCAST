"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const expenseCOLORS = [
  "#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e",
  "#0ea5e9", "#6366f1", "#a855f7", "#ec4899", "#14b8a6"
];

// --- COA-COMPLIANT EXPENSE CATEGORIZER ---
export function categorizeExpense(description = "") {
  const t = description.toLowerCase();

  if (
    t.includes("hon.") ||
    t.includes("honor") ||
    t.includes("appointed") ||
    t.includes("elected") ||
    t.includes("tanod") ||
    t.includes("bhw") ||
    t.includes("chief")
  ) return "PS (Personal Services)";

  if (t.includes("sk")) return "10% SK Fund";

  if (
    t.includes("fire") ||
    t.includes("safety drill") ||
    t.includes("disaster") ||
    t.includes("rescue") ||
    t.includes("drrm")
  ) return "5% BDRRM Fund";

  if (
    t.includes("women") ||
    t.includes("senior") ||
    t.includes("pwd") ||
    t.includes("nutrition") ||
    t.includes("feeding") ||
    t.includes("deworm") ||
    t.includes("gap")
  ) return "GAD Programs";

  if (
    t.includes("construction") ||
    t.includes("improvement") ||
    t.includes("materials") ||
    t.includes("solar") ||
    t.includes("equipment") ||
    t.includes("road") ||
    t.includes("building") ||
    t.includes("water system") ||
    t.includes("rehab")
  ) return "20% BDF / Capital Outlay";

  if (
    t.includes("travel") ||
    t.includes("seminar") ||
    t.includes("training") ||
    t.includes("supplies") ||
    t.includes("office") ||
    t.includes("water") ||
    t.includes("electric") ||
    t.includes("bond") ||
    t.includes("security") ||
    t.includes("bookkeeper") ||
    t.includes("lumber") ||
    t.includes("fuel") ||
    t.includes("diesel") ||
    t.includes("registration") ||
    t.includes("check book") ||
    t.includes("maintenance") ||
    t.includes("interest") ||
    t.includes("tax") ||
    t.includes("pcf")
  ) return "MOOE";

  return "Other / Non-Office";
}

export default function ExpensePieChart({ transactions }) {
  const expenseTx = transactions.filter(t => t.withdrawal > 0);

  // =========================
  // GROUP EXPENSES
  // =========================
  const grouped = {};
  expenseTx.forEach(t => {
    const category = categorizeExpense(t.description || "");
    grouped[category] = (grouped[category] || 0) + Number(t.withdrawal);
  });

  // =========================
  // BUILD STABLE CHART DATA
  // =========================
  const chartData = Object.entries(grouped).map(
    ([name, value]) => ({ name, value })
  );

  // =========================
  // STABLE COLOR MAP (KEY FIX)
  // =========================
  const colorMap = {};
  chartData.forEach((item, index) => {
    colorMap[item.name] =
      expenseCOLORS[index % expenseCOLORS.length];
  });

  return (
<div className="w-full flex flex-col items-center gap-8">
      {/* PIE */}
      <div className="w-[260px]">
        <ResponsiveContainer width="100%" aspect={1}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius="80%"
              dataKey="value"
              label={false}
              labelLine={false}
            >
              {chartData.map((item) => (
                <Cell
                  key={item.name}
                  fill={colorMap[item.name]}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

     {/* CUSTOM LEGEND */}
<div className="mt-4 w-full max-w-xs space-y-2 flex flex-col items-start text-left">
  {chartData.map((item) => (
    <div
      key={item.name}
      className="flex items-center gap-2 text-m"
    >
      <span
        className="w-3 h-3 rounded-sm"
        style={{ backgroundColor: colorMap[item.name] }}
      />
      <span className="text-gray-700">
        {item.name}
      </span>
    </div>
  ))}
</div>

    </div>
  );
}
