export default function SummaryCards({ data }) {
  const total = data.reduce((s, d) => s + d.totalIncome, 0)
  const avg = total / data.length
  const max = Math.max(...data.map(d => d.totalIncome))
  const min = Math.min(...data.map(d => d.totalIncome))

  const currency = val =>
    new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(val)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card label="Total Budget" value={currency(total)} color="indigo" />
      <Card label="Average Budget" value={currency(avg)} color="green" />
      <Card label="Highest Budget" value={currency(max)} color="yellow" />
      <Card label="Lowest Budget" value={currency(min)} color="red" />
    </div>
  )
}

function Card({ label, value, color }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-700",
    green: "bg-green-50 text-green-700",
    yellow: "bg-yellow-50 text-yellow-700",
    red: "bg-red-50 text-red-700",
  }

  return (
    <div className={`p-4 rounded-lg text-center ${colors[color]}`}>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  )
}
