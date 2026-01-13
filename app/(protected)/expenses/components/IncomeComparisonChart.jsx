"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function IncomeComparisonChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <p className="text-sm italic text-slate-500">
        No income recorded for this year.
      </p>
    );
  }

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip
            formatter={(v) =>
              `₱${Number(v).toLocaleString()}`
            }
          />
          <Legend />

          <Bar
            dataKey="approved"
            name="Approved Income"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="actual"
            name="Actual Income"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
