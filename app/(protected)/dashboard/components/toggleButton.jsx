"use client";

export default function ToggleButton({
  showTable,
  setShowTable,
  showAddForm,
  setShowAddForm,
}) {
  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={() => setShowTable(!showTable)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        {showTable ? "Hide Transactions" : "Show Transactions"}
      </button>

    </div>
  );
}
