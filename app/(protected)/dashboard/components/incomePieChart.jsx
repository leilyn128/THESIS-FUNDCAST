"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const incomeCOLORS = [
  "#22c55e", "#0ea5e9", "#6366f1", "#14b8a6",
  "#84cc16", "#eab308", "#f97316", "#ef4444"
];

// --- AUTO CATEGORIZER FOR INCOME ---
export function categorizeIncome(description = "") {
  const t = description.toLowerCase();
 


  if (t.includes("clearance") || t.includes("certification")) {
    return "Clearance & Certification fees";
  }

  if (
    t.includes("business") ||
    t.includes("fees/income") ||
    t.includes("other income")
  ) {
    return "Other business fees/income";
  }

  if (t.includes("rental")) return "Rental fees";
  if (t.includes("interest")) return "Interest income";

  if (t.includes("real property tax") || t.includes("rpt")) {
    return "Real Property Tax";
  }

  if (t.includes("community tax")) {
    return "Community Tax";
  }

  if (t.includes("subsidy")) {
    return "Subsidy from other LGUs";
  }

  if (
    t.includes("nta") ||
    t.includes("nta released") ||
    t.includes("National Taxation Allocation")
  ) {
    return "National Taxation Allocation (NTA)";
  }

  return "Other Income";
}

export default function IncomePieChart({ transactions }) {
  // Only deposits
  const incomeTx = transactions.filter(t => t.deposit > 0);

  // =========================
  // GROUP INCOME
  // =========================
  const grouped = {};
  incomeTx.forEach(t => {
    const category = categorizeIncome(t.description || "");
    grouped[category] = (grouped[category] || 0) + Number(t.deposit);
  });

  // =========================
  // BUILD CHART DATA
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
      incomeCOLORS[index % incomeCOLORS.length];
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

      {/* ✅ CUSTOM LEGEND (NO DUPLICATES, MATCHING COLORS) */}
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
