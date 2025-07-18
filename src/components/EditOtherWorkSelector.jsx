import React from "react";

const EditOtherWorkSelector = ({ otherWork, onSelectWork, onCancel, isDarkMode }) => {
  return (
    <div className={`p-4 rounded-lg mb-4 border transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-orange-900/30 border-orange-700' 
        : 'bg-orange-50 border-orange-200'
    }`}>
      <h3 className={`font-semibold mb-3 transition-colors duration-300 ${
        isDarkMode ? 'text-orange-300' : 'text-orange-800'
      }`}>Select Other Work to Edit</h3>
      <div className="grid gap-2 mb-4 max-h-48 overflow-y-auto">
        {otherWork.map(work => (
          <button
            key={work.id}
            onClick={() => onSelectWork(work)}
            className={`text-left p-3 rounded border transition-colors ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 hover:bg-orange-900/50 text-white' 
                : 'bg-white border-gray-300 hover:bg-orange-50 text-gray-800'
            }`}
          >
            <div className="font-medium">{work.name}</div>
            <div className={`text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {work.completed ? 'Completed' : 'Active'} • {work.active ? 'Active' : 'Inactive'}
              {work.description && ` • ${work.description.substring(0, 50)}${work.description.length > 50 ? '...' : ''}`}
            </div>
          </button>
        ))}
      </div>
      <button
        onClick={onCancel}
        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
      >
        Cancel
      </button>
    </div>
  );
};

export default EditOtherWorkSelector; 