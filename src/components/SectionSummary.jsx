import React from "react";

const SectionSummary = ({ items, isDarkMode }) => {
  const activeCount = items.filter(item => item.active).length;
  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;

  return (
    <div className="flex gap-4 text-sm">
      <span className={`px-2 py-1 rounded transition-colors duration-300 ${
        isDarkMode ? 'bg-blue-900/50 text-blue-300 border border-blue-700' : 'bg-blue-100 text-blue-800'
      }`}>
        {activeCount} active
      </span>
      <span className={`px-2 py-1 rounded transition-colors duration-300 ${
        isDarkMode ? 'bg-green-900/50 text-green-300 border border-green-700' : 'bg-green-100 text-green-800'
      }`}>
        {completedCount} completed
      </span>
      <span className={`px-2 py-1 rounded transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-700 text-gray-300 border border-gray-600' : 'bg-gray-100 text-gray-800'
      }`}>
        {totalCount} total
      </span>
    </div>
  );
};

export default SectionSummary; 