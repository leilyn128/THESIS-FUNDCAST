import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const PieChartComponent = ({ data }) => {
  const COLORS = [
    "#1e40af",
    "#059669",
    "#dc2626",
    "#d97706",
    "#7c3aed",
    "#be185d",
    "#0284c7",
    "#16a34a",
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div className="bg-white border border-slate-200 rounded-lg shadow p-3">
          <p className="text-sm font-semibold text-slate-800">
            {item.payload.category}
          </p>
          <p className="text-sm text-slate-600">
            ₱{Number(item.value).toLocaleString("en-PH")}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm h-full flex flex-col">

      {/* HEADER */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
          </svg>
        </div>
        <h2 className="text-base font-bold text-slate-800">
          Budget Distribution
        </h2>
      </div>

      {/* BODY */}
      <div className="flex-1 flex flex-col px-4 py-3">

        {/* PIE */}
        <div className="h-[300px]">
          {data?.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="amount"
                  nameKey="subcategory"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={2}
                >
                  {data.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-slate-400">
              No data available
            </div>
          )}
        </div>

        {/* ✅ MANUAL LEGEND (THIS FIXES IT) */}
        <div className="mt-8 max-h-[160px] overflow-y-auto space-y-2 pr-3">
          {data?.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap- text-sm text-slate-700"
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="truncate">
                {item.subcategory}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default PieChartComponent;
