"use client";

import { memo, useMemo, useState } from "react";


import AllocationBarChart from "../components/AllocationBarChart";

const BudgetCard = memo(function BudgetCard({
  category,
  allocated,
  isOpen,
  onToggle,
  items,
  spentBySubcategory,
  onEdit,
  onDelete,
}) {

  const formattedAmount = useMemo(
    () => `₱${allocated.toLocaleString()}`,
    [allocated]
  );
const [menuOpen, setMenuOpen] = useState(false);


const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  // Group items by description/subcategory for clickable sections
  // 1️⃣ GROUP ITEMS FIRST
const groupedItems = useMemo(() => {
  const groups = {};
  items?.forEach((item) => {
    const key = item.description || "Uncategorized";
    if (!groups[key]) {
      groups[key] = {
        name: key,
        items: [],
        total: 0,
      };
    }
    groups[key].items.push(item);
    groups[key].total += Number(item.amount) || 0;
  });
  return Object.values(groups);
}, [items]);

// 2️⃣ NOW SAFE TO USE groupedItems
const selectedAllocated =
  groupedItems.find(g => g.name === selectedSubcategory)?.total || 0;

const selectedSpent =
  spentBySubcategory?.[selectedSubcategory] || 0;

// 3️⃣ PREPARE CHART DATA
const subcategoryChartData = selectedSubcategory
  ? [
      {
        category: selectedSubcategory,
        allocated: selectedAllocated,
        spent: selectedSpent,
      },
    ]
  : [];
 console.log("Selected:", selectedSubcategory);
console.log("Spent Map:", spentBySubcategory);

  // Calculate allocation percentage for progress bar
  const progressPercentage = useMemo(() => {
    if (!items || items.length === 0) return 0;
    return Math.min((items.length / 15) * 100, 100);
  }, [items]);






return (
  <div
    className={`relative rounded-xl border border-slate-200 bg-white transition-all duration-300
      ${isOpen 
        ? "shadow-lg ring-1 ring-slate-100" 
        : "shadow-sm hover:shadow-md hover:border-slate-300"
      }
    `}
  >
    
    {/* TOP RIGHT ACTIONS - Refined */}
    <div className="absolute right-6 top-6 flex items-center gap-3">
      <span className="inline-flex items-center rounded-full bg-slate-50 border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700">
        {items?.length || 0} Items
      </span>

      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((prev) => !prev);
          }}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 3a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>

        {menuOpen && (
          <div
            className="absolute right-0 mt-2 w-48 rounded-lg border border-slate-200 bg-white shadow-xl z-50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setMenuOpen(false);
                onEdit?.();
              }}
              className="w-full px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 border-b border-slate-100 transition-colors"
            >
              Edit Category
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                onDelete?.();
              }}
              className="w-full px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              Delete Category
            </button>
          </div>
        )}
      </div>
    </div>

{/* HEADER - Professional & Compact */}
<div className="p-5">
  <div className="flex items-start justify-between">
    <div className="flex-1">
      {/* CATEGORY HEADER - Professional */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
          <span className="text-white text-lg font-bold">
            {category.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            {category}
          </h3>
          
        </div>
      </div>

      {/* AMOUNT - Professional */}
      <div className="mt-4">
        
        <p className="text-2xl font-bold text-slate-900">
          {formattedAmount}
        </p>
      </div>
    </div>
  </div>

  {/* ACTION BUTTON - Professional */}
  <div className="mt-5 pt-4 border-t border-gray-100">
    <button
      onClick={onToggle}
      className={`w-full flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200
        ${isOpen
          ? "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
          : "bg-blue-50 text-emerald-700 hover:bg-emerald-100"
        }
      `}
    >
      {isOpen ? (
        <>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
          Hide Details
        </>
      ) : (
        <>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          View Breakdown
        </>
      )}
    </button>
  </div>
</div>

{/* DETAILS PANEL - Professional & Compact */}
{isOpen && (
  <div className="border-t border-gray-100 animate-fadeIn">
    <div className="p-5">

      {selectedSubcategory && (
        <div className="mb-5">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            {/* Subcategory Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                <h4 className="text-sm font-semibold text-gray-900 truncate">
                  {selectedSubcategory}
                </h4>
              </div>
              <button
                onClick={() => setSelectedSubcategory(null)}
                className="text-gray-400 hover:text-gray-600 text-xs p-1"
                aria-label="Close subcategory"
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* SUMMARY - Professional */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-white rounded border border-gray-200 p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                  <p className="text-xs font-medium text-gray-600">Allocated</p>
                </div>
                <p className="text-base font-bold text-gray-900">
                  ₱{selectedAllocated.toLocaleString()}
                </p>
              </div>

              <div className="bg-white rounded border border-gray-200 p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500"></div>
                  <p className="text-xs font-medium text-gray-600">Spent</p>
                </div>
                <p className="text-base font-bold text-gray-900">
                  ₱{selectedSpent.toLocaleString()}
                </p>
                <div className={`text-xs font-medium mt-1 ${selectedSpent > selectedAllocated ? 'text-red-600' : 'text-green-600'}`}>
                  {selectedSpent > selectedAllocated 
                    ? `+${((selectedSpent - selectedAllocated) / selectedAllocated * 100).toFixed(1)}%`
                    : `${((selectedAllocated - selectedSpent) / selectedAllocated * 100).toFixed(1)}% remaining`
                  }
                </div>
              </div>
            </div>

            {/* CHART */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-medium text-gray-700">Utilization</p>
                <span className="text-xs text-gray-500">
                  {((selectedSpent / selectedAllocated) * 100).toFixed(0)}% spent
                </span>
              </div>
              <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${Math.min((selectedSpent / selectedAllocated) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* WARNING - Professional */}
            {selectedSpent > selectedAllocated && (
              <div className="rounded border border-red-200 bg-red-50 p-2.5">
                <div className="flex items-start gap-2">
                  <svg className="h-3 w-3 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-xs font-semibold text-red-800 mb-0.5">Budget Exceeded</p>
                    <p className="text-xs text-red-700">
                      Overspent by ₱{(selectedSpent - selectedAllocated).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBCATEGORIES SECTION - Professional */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-900">Subcategories</h4>
          <span className="text-xs text-gray-500">{groupedItems.length} total</span>
        </div>
        
        <div className="space-y-2">
          {groupedItems.length > 0 ? (
            groupedItems.map((group, groupIndex) => (
              <div
                key={groupIndex}
                className={`border border-gray-200 rounded-md transition-colors cursor-pointer
                  ${selectedSubcategory === group.name
                    ? 'border-blue-300 bg-blue-50'
                    : 'hover:border-gray-300 bg-white'
                  }
                `}
                onClick={() =>
                  setSelectedSubcategory(
                    selectedSubcategory === group.name ? null : group.name
                  )
                }
              >
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className={`h-6 w-6 rounded flex items-center justify-center text-xs font-medium
                        ${selectedSubcategory === group.name
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600'
                        }
                      `}>
                        {groupIndex + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h5 className="text-sm font-medium text-gray-900 truncate">
                          {group.name}
                        </h5>
                      
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                        ₱{group.total.toLocaleString()}
                      </span>
                      <svg 
                        className={`h-3 w-3 text-gray-400 transition-transform ${selectedSubcategory === group.name ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 rounded border border-dashed border-gray-300 bg-gray-50">
              <svg className="h-5 w-5 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm text-gray-600">No subcategories defined</p>
              <p className="text-xs text-gray-500 mt-0.5">Add budget items to see breakdown</p>
            </div>
          )}
        </div>
      </div>

      
    </div>
  </div>
)}
  </div>
);
});



export default BudgetCard;