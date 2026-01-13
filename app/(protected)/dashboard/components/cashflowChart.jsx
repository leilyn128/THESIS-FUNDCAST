"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CardContent } from "@/components/ui/card";

// Helper to format currency
const formatCurrency = (value) =>
  `₱${new Intl.NumberFormat("en-PH").format(value)}`;

// Custom tooltip to show all values
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload.reduce((acc, item) => {
      acc[item.name] = item.value;
      return acc;
    }, {});
    return (
      <div className="bg-white border p-2 shadow rounded text-sm">
        <p className="font-semibold mb-1">{label}</p>
        <p>Income: {formatCurrency(data["Income"] || 0)}</p>
        <p>Expense: {formatCurrency(data["Expense"] || 0)}</p>
        <p>Net: {formatCurrency(data["Monthly Surplus / Deficit"] || 0)}</p>
        <p>Running Balance: {formatCurrency(data["Running Balance"] || 0)}</p>
      </div>
    );
  }
  return null;
};

export default function CashflowChart({ data = [] }) {
  // Use data directly; `net` and `balance` are already in `chartData`
  const processedData = data.map((item) => ({
    ...item,
    income: item.income || 0,
    expense: item.expense || 0,
    net: item.net || 0,
    balance: item.balance || 0,
  }));

  // Summary totals
  const totalIncome = processedData.reduce((sum, i) => sum + i.income, 0);
  const totalExpense = processedData.reduce((sum, i) => sum + i.expense, 0);
  const runningBalance = processedData.length > 0
  ? processedData[processedData.length - 1].balance
  : 0;
  return (
    <CardContent className="p-4">
      {/* Summary */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Monthly Income vs Expense</h2>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={600}>
        <LineChart data={processedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(v) => `${v / 1000}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#16a34a" name="Income" />
          <Line type="monotone" dataKey="expense" stroke="#dc2626" name="Expense" />
          <Line type="monotone" dataKey="net" stroke="#2563eb" name="Monthly Surplus / Deficit" />
          <Line type="monotone" dataKey="balance" stroke="#9333ea" name="Running Balance" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  );
}
