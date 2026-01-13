"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

export default function AllocationBarChart({ chartData }) {
  return (
  <div className="">
    {/* SECTION HEADER */}
    <div className="flex items-center justify-between">
      <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
      </h2>
    </div>

    {/* CHART CONTAINER */}
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={chartData}
          barGap={12}
          margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
        >
          {/* GRID */}
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb"
          />

          {/* AXES */}
          <XAxis
            dataKey="category"
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          {/* TOOLTIP */}
          <Tooltip
            formatter={(v) => `₱${Number(v).toLocaleString()}`}
            contentStyle={{
              borderRadius: "8px",
              borderColor: "#e5e7eb",
              fontSize: "12px",
            }}
          />

          {/* LEGEND */}
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ fontSize: "12px", paddingBottom: 10 }}
          />

          {/* BARS */}
          <Bar
            dataKey="allocated"
            name="Allocated"
            fill="#10b981"
            radius={[6, 6, 0, 0]}
          />
          <Bar
            dataKey="spent"
            name="Spent"
            fill="#ef4444"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);
}
