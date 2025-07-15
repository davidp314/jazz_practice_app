import React from "react";

const FilterButtons = ({ currentFilter, onFilterChange, items, isDarkMode }) => {
  const activeCount = items.filter(item => item.active).length;
  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;

  const filters = [
    { key: 'active', label: `Active (${activeCount})`, count: activeCount },
    { key: 'all', label: `All (${totalCount})`, count: totalCount },
    { key: 'completed', label: `Completed (${completedCount})`, count: completedCount }
  ];

  return (
    <div className="flex gap-2">
      {filters.map(filter => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`px-3 py-1 text-sm rounded-lg transition-colors ${
            currentFilter === filter.key
              ? 'bg-blue-600 text-white'
              : (isDarkMode 
                  ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons; 