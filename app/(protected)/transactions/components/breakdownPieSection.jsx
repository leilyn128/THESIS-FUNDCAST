"use client"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

export default function BreakdownPieSection({ selectedYear, breakdown }) {
  const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#3B82F6"]

  if (!selectedYear)
    return <p className="text-gray-500 text-center">Click a year to view breakdown</p>

  return (
    <div className="bg-white shadow rounded-lg p-4 mt-6">
      <h3 className="text-lg font-semibold mb-2">
        Budget Breakdown ({selectedYear})
      </h3>

      <div className="flex flex-col lg:flex-row gap-8 justify-center mt-6">
        <PieGroup title="Income Breakdown" data={breakdown.income || {}} colors={COLORS} />
        <PieGroup title="Appropriations Breakdown" data={breakdown.appropriations || {}} colors={COLORS} />
      </div>
    </div>
  )
}

function PieGroup({ title, data, colors }) {
  const formatted = Object.entries(data).map(([name, value]) => ({ name, value }))
  const total = formatted.reduce((sum, i) => sum + i.value, 0)

  // Convert value → percentage
  const toPercent = (v) => ((v / total) * 100).toFixed(2) + "%"

  return (
    <div className="w-full lg:w-1/2">
      <p className="font-semibold text-center">{title}</p>

      <ResponsiveContainer width="100%" height={360}>
        <PieChart>
          <Pie
            data={formatted}
            dataKey="value"
            nameKey="name"
            outerRadius={110}
            label={({ name, value }) => `${name}: ${toPercent(value)}`}
          >
            {formatted.map((entry, index) => (
              <Cell key={index} fill={colors[index % colors.length]} />
            ))}
          </Pie>

          <Tooltip
            formatter={(value) => toPercent(value)}
            labelFormatter={(name) => name}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
