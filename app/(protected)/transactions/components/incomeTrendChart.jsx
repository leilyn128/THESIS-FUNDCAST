"use client"
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer
} from "recharts"

export default function IncomeTrendChart({ data, onYearClick }) {
  const currency = val =>
    new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(val)

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-2">Yearly Income Trend</h3>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={data}
          onClick={e => e?.activeLabel && onYearClick(e.activeLabel)}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis tickFormatter={val => `${(val / 1_000_000).toFixed(1)}M`} />
          <Tooltip formatter={v => currency(v)} labelFormatter={y => `Year: ${y}`} />
          <Line dataKey="totalIncome" stroke="#4F46E5" strokeWidth={3} dot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
