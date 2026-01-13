"use client";

export default function ForecastSummary({ data }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <p className="text-sm text-gray-500 text-center">
        Forecast not available yet.
      </p>
    );
  }

  const sorted = [...data]
    .filter(d => typeof d.value === "number" && !isNaN(d.value))
    .sort((a, b) => a.year - b.year);

  if (sorted.length === 0) {
    return (
      <p className="text-sm text-gray-500 text-center">
        Forecast not available yet.
      </p>
    );
  }

  const nextYear = sorted[0];
  const firstFive = sorted.slice(0, Math.min(5, sorted.length));

  const avgForecast =
    firstFive.reduce((sum, e) => sum + e.value, 0) / firstFive.length;

  const growthRate =
    firstFive.length > 1
      ? ((firstFive[firstFive.length - 1].value - firstFive[0].value) /
          firstFive[0].value) *
        100
      : 0;

  const format = (v) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(v);

    
return (
<div className="grid grid-cols-1 gap-4 mt-2">
    <Card
      title={`Next Year Forecast (${nextYear.year})`}
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
      value={`${growthRate.toFixed(2)}%`}
      color="yellow"
    />
  </div>
);
}

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
