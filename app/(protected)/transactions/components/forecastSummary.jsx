"use client";

function Card({ title, value, color }) {
  const styles = {
    indigo: "bg-indigo-50 text-indigo-700",
    green: "bg-green-50 text-green-700",
    yellow: "bg-yellow-50 text-yellow-700",
  };

  return (
    <div
      className={`rounded-lg px-3 py-4 text-center flex flex-col justify-center items-center ${styles[color]}`}
    >
      <p className="text-[18px] font-medium text-gray-600 leading-tight">
        {title}
      </p>
      <p className="mt-2 text-base font-semibold">
        {value}
      </p>
    </div>
  );
}

export default function ForecastSummary({
  data,
  selectedYear,
  lastActualYear,
  lastActualValue,
}) {
  if (!Array.isArray(data) || data.length === 0) return null;

  const sorted = [...data].sort((a, b) => a.year - b.year);

  const selectedForecast = sorted.find(d => d.year === selectedYear);
  if (!selectedForecast || !lastActualValue) return null;

  const growthRate =
    ((selectedForecast.value - lastActualValue) / lastActualValue) * 100;


  const format = (v) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(v);

 return (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
    <Card
      title={`Forecast (${nextYear.year})`}
      value={format(nextYear.value)}
      color="indigo"
    />

    <Card
      title="Next 2–5 Year Avg"
      value={format(avgForecast)}
      color="green"
    />

    <Card
  title="Growth Rate"
  value={`${Number(growthRate).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`}
  color="yellow"
/>

  </div>
);

}
