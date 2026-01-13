import {
  ArrowUpIcon,
  ArrowDownIcon,
  BanknotesIcon,
  ChartBarIcon,
  CurrencyDollarIcon
} from "@heroicons/react/24/outline";

export default function KPICards({ totals }) {
  const {
    beginningBalance = 0,
    totalIncome = 0,
    totalExpense = 0,
    runningBalance = 0,
    monthlySurplus = 0,
  } = totals;

  const cards = [
    {
      title: "Beginning Balance",
      value: `₱${Number(beginningBalance).toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      title: "Income",
      value: `₱${Number(totalIncome).toLocaleString()}`,
      icon: ArrowUpIcon,
      color: "text-green-600",
      bg: "bg-green-100"
    },
    {
      title: "Expense",
      value: `₱${Number(totalExpense).toLocaleString()}`,
      icon: ArrowDownIcon,
      color: "text-red-600",
      bg: "bg-red-100"
    },
    {
      title: "Running Balance",
      value: `₱${Number(runningBalance).toLocaleString()}`,
      icon: BanknotesIcon,
      color: "text-purple-600",
      bg: "bg-purple-100"
    },
    {
      title: "Monthly Surplus",
      value: `₱${Number(monthlySurplus).toLocaleString()}`,
      icon: ChartBarIcon,
      color: monthlySurplus >= 0 ? "text-green-600" : "text-red-600",
      bg: monthlySurplus >= 0 ? "bg-green-100" : "bg-red-100"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {cards.map((card, index) => (
        <div key={index} className="flex items-center p-4 bg-white rounded-xl shadow-sm border">
          <div className={`p-3 rounded-full ${card.bg} ${card.color} mr-4`}>
            <card.icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">{card.title}</p>
            <p className="text-xl font-semibold">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
