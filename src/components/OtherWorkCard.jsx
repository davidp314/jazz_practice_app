import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

const OtherWorkCard = ({ item, isDarkMode }) => {
  return (
    <div className={`border rounded-lg p-4 transition-colors duration-300 ${
      !item.active ? 'opacity-60' : ''
    } ${
      item.completed 
        ? (isDarkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200')
        : (isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200')
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className={`font-semibold mb-1 transition-colors duration-300 ${
            item.completed 
              ? (isDarkMode ? 'text-green-300' : 'text-green-800')
              : (isDarkMode ? 'text-white' : 'text-gray-800')
          }`}>
            {item.name}
          </h3>
          {item.description && (
            <div className={`text-sm transition-colors duration-300 ${
              item.completed 
                ? (isDarkMode ? 'text-green-400' : 'text-green-600')
                : (isDarkMode ? 'text-gray-400' : 'text-gray-600')
            }`}>
              {item.description}
            </div>
          )}
        </div>
        <div className={`flex items-center gap-1 text-sm transition-colors duration-300 ${
          item.active 
            ? (isDarkMode ? 'text-green-400' : 'text-green-600')
            : (isDarkMode ? 'text-gray-500' : 'text-gray-400')
        }`}>
          {item.active ? <Eye size={16} /> : <EyeOff size={16} />}
          {item.active ? 'Active' : 'Inactive'}
        </div>
      </div>

      {item.completed && (
        <div className={`text-sm transition-colors duration-300 ${
          isDarkMode ? 'text-green-400' : 'text-green-600'
        }`}>
          ✅ Completed
        </div>
      )}
    </div>
  );
};

export default OtherWorkCard; 