"use client";
import { useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  Area,
  Label
} from "recharts";

export default function LGUFinancialForecastChart({ historyData, forecastData, lguName = "Local Government Unit" }) {
const [forecastYearsToShow, setForecastYearsToShow] = useState(1);

  // ---------- DATA PROCESSING ----------
  const actualData = Array.isArray(historyData)
    ? historyData.map(d => ({
        fiscalYear: Number(d.year),
        actualBudget: d.totalIncome ?? 0,
        forecastBudget: null,
      }))
    : [];

  const lastActualYear = actualData.length > 0
    ? Math.max(...actualData.map(d => d.fiscalYear))
    : null;

const forecastMapped = Array.isArray(forecastData)
  ? forecastData
      .filter(f => f.year > lastActualYear)
      .slice(0, forecastYearsToShow) // 🔥 LIMIT YEARS HERE
      .map(f => ({
        fiscalYear: Number(f.year),
        actualBudget: null,
        forecastBudget: f.value ?? 0,
        projectedGrowth: f.growthRate || null,
      }))
  : [];


  const combinedData = [
    ...actualData,
    ...forecastMapped,
  ];

  const forecastStartYear = forecastMapped?.[0]?.fiscalYear;
  const currentYear = new Date().getFullYear();

  // Calculate growth metrics
  const getGrowthMetrics = () => {
    if (actualData.length < 2) return null;
    const sorted = [...actualData].sort((a, b) => a.fiscalYear - b.fiscalYear);
    const recent = sorted.slice(-3);
    const avgGrowth = recent.reduce((sum, curr, idx, arr) => {
      if (idx === 0) return 0;
      const prev = arr[idx - 1].actualBudget;
      return sum + ((curr.actualBudget - prev) / prev) * 100;
    }, 0) / (recent.length - 1);
    
    return {
      averageGrowth: avgGrowth.toFixed(1),
      lastActual: actualData[actualData.length - 1]?.actualBudget || 0
    };
  };

  const growthMetrics = getGrowthMetrics();
const forecastGrowthRate = (() => {
  if (!growthMetrics || forecastMapped.length === 0) return null;

  const lastForecast =
    forecastMapped[forecastMapped.length - 1]?.forecastBudget;

  if (!lastForecast || !growthMetrics.lastActual) return null;

  return (
    ((lastForecast - growthMetrics.lastActual) /
      growthMetrics.lastActual) *
    100
  ).toFixed(2);
})();

  // ---------- CUSTOM TOOLTIP ----------
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const isForecast = label > lastActualYear;
    const actual = payload.find(p => p.dataKey === 'actualBudget')?.value;
    const forecast = payload.find(p => p.dataKey === 'forecastBudget')?.value;

    const growthFromLastActual =
      isForecast && growthMetrics?.lastActual && forecast
        ? ((forecast - growthMetrics.lastActual) / growthMetrics.lastActual) * 100
        : null;

    return (
      <div className="bg-white p-3 border rounded shadow text-sm">
        <p className="font-semibold">FY {label}</p>

        {typeof actual === "number" && (
  <p className="text-blue-600">
    Actual: ₱{actual.toLocaleString()}
  </p>
)}


        {typeof forecast === "number" && (
  <p className="text-emerald-600">
    Forecast: ₱{forecast.toLocaleString()}
  </p>
)}


        {growthFromLastActual !== null && (
          <p className="text-xs text-amber-600 mt-1">
            Growth vs last actual: {growthFromLastActual.toFixed(2)}%
          </p>
        )}
      </div>
    );
  }
  return null;
};


  return (
    <div className=" overflow-hidden">
    
{/* FORECAST YEAR FILTER */}
<div className="flex justify-end mb-4">
  <div className="flex items-center gap-2">
    <label className="text-sm font-medium text-gray-700">
      Forecast Years:
    </label>
    <select
      value={forecastYearsToShow}
      onChange={(e) => setForecastYearsToShow(Number(e.target.value))}
      className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
    >
      {[1, 2, 3].map(year => (
        <option key={year} value={year}>
          {year} Year{year > 1 ? "s" : ""}
        </option>
      ))}
    </select>
  </div>
</div>

      {/* CHART */}
      <div className="p-6">
        <ResponsiveContainer width="100%" height={450}>
          <LineChart
            data={combinedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#f0f0f0"
              vertical={false}
            />
            
            {/* X AXIS */}
            <XAxis
              dataKey="fiscalYear"
              type="number"
              domain={['dataMin', 'dataMax']}
              tick={{ fontSize: 13, fill: '#6b7280' }}
              tickFormatter={(value) => ` ${value}`}
              padding={{ left: 20, right: 20 }}
            >
             
            </XAxis>

            {/* Y AXIS */}
            <YAxis
              tickFormatter={(value) => `₱${(value / 1_000_000).toFixed(0)}M`}
              tick={{ fontSize: 13, fill: '#070707' }}
              width={80}
            >
              <Label 
                angle={-90}
                value="Budget (PHP)" 
                position="insideLeft" 
                offset={-10}
                style={{ fill: '#08090a', fontSize: 14, textAnchor: 'middle' }}
              />
            </YAxis>

            <Tooltip content={<CustomTooltip />} />

            <Legend 
              verticalAlign="bottom" 
              height={50}
              iconType="circle"
              iconSize={10}
              wrapperStyle={{ paddingBottom: 20 }}
            />

            {/* FORECAST START REFERENCE LINE */}
            {forecastStartYear && (
              <ReferenceLine
                x={forecastStartYear}
                stroke="#059669"
                strokeWidth={1.5}
                strokeDasharray="5 5"
              >
                
              </ReferenceLine>
            )}

            {/* CURRENT YEAR REFERENCE LINE */}
            <ReferenceLine
              x={currentYear}
              stroke="#dc2626"
              strokeWidth={1}
              strokeDasharray="3 3"
            >
              <Label 
                value="Current Year" 
                position="Top"
                fill="#dc2626"
                fontSize={11}
                offset={5}
              />
            </ReferenceLine>

          

            {/* ACTUAL BUDGET LINE */}
            <Line
              type="monotone"
              dataKey="actualBudget"
              name="Historical Budget"
              stroke="#1e40af"
              strokeWidth={3}
              dot={{
                r: 5,
                fill: "#1e40af",
                strokeWidth: 2,
              }}
           
              connectNulls={true}
            />

            {/* FORECAST LINE */}
            <Line
              type="monotone"
              dataKey="forecastBudget"
              name="Projected Budget"
              stroke="#059669"
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{
                r: 5,
                fill: "#059669",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 8,
                fill: "#059669",
                strokeWidth: 3
              }}
              connectNulls={true}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* GRADIENT DEFINITIONS */}
        <svg style={{ height: 0 }}>
          <defs>
            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1e40af" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#1e40af" stopOpacity={0}/>
            </linearGradient>
          </defs>
        </svg>

        {/* FOOTER STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700 font-medium mb-1">Historical Period</p>
            <p className="text-2xl font-bold text-blue-800">
              {actualData.length} Years
            </p>
            <p className="text-xs text-blue-600 mt-1">
              FY {actualData[0]?.fiscalYear || 'N/A'} - {lastActualYear || 'N/A'}
            </p>
          </div>

          <div className="bg-emerald-50 p-4 rounded-lg">
            <p className="text-sm text-emerald-700 font-medium mb-1">Projection Period</p>
            <p className="text-2xl font-bold text-emerald-800">
              {forecastMapped.length} Years
            </p>
            <p className="text-xs text-emerald-600 mt-1">
              FY {forecastStartYear || 'N/A'} - {forecastMapped[forecastMapped.length - 1]?.fiscalYear || 'N/A'}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
  <p className="text-sm text-gray-700 font-medium mb-1">
    Forecast Growth Rate
  </p>
  <p className="text-2xl font-bold text-gray-800">
    {forecastGrowthRate !== null ? `${forecastGrowthRate}%` : 'N/A'}
  </p>
  <p className="text-xs text-gray-600 mt-1">
    vs last actual year
  </p>
</div>

        </div>

        {/* DISCLAIMER */}
        <div className="mt-20 text-xs text-gray-500 italic">
          <p>
            Note: Forecasts are based on historical trends and economic indicators. 
            Actual results may vary based on local economic conditions, policy changes, 
            and unforeseen circumstances. Prepared by Danahao Barangay Treasury.
          </p>
        </div>
      </div>
    </div>
  );
}