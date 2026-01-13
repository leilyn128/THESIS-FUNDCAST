export default function SurplusDeficitWidget({ net }) {
  const isSurplus = net >= 0;

  return (
    <div className={`border rounded-xl shadow-sm p-4 mb-4 
      ${isSurplus ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}`}>
      
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full 
          ${isSurplus ? "bg-green-600" : "bg-red-600"}`} />

        <h2 className="font-semibold text-lg">
          Year Status
        </h2>
      </div>

      <p className={`mt-2 text-xl font-bold 
        ${isSurplus ? "text-green-700" : "text-red-700"}`}>
        {isSurplus ? "Surplus" : "Deficit"} (₱{net.toLocaleString()})
      </p>
    </div>
  );
}
