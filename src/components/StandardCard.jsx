import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { STANDARD_STEPS } from "../constants";

const StandardCard = ({ standard, isDarkMode }) => {
  const completedSteps = standard.steps.filter(Boolean).length;
  const progressPercent = (completedSteps / STANDARD_STEPS.length) * 100;

  return (
    <div className={`border rounded-lg p-4 transition-colors duration-300 ${
      !standard.active ? 'opacity-60' : ''
    } ${
      standard.completed 
        ? (isDarkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200')
        : (isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200')
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className={`font-semibold mb-1 transition-colors duration-300 ${
            standard.completed 
              ? (isDarkMode ? 'text-green-300' : 'text-green-800')
              : (isDarkMode ? 'text-white' : 'text-gray-800')
          }`}>
            {standard.name}
          </h3>
          <div className={`text-sm transition-colors duration-300 ${
            standard.completed 
              ? (isDarkMode ? 'text-green-400' : 'text-green-600')
              : (isDarkMode ? 'text-gray-400' : 'text-gray-600')
          }`}>
            {completedSteps}/{STANDARD_STEPS.length} steps completed
          </div>
        </div>
        <div className={`flex items-center gap-1 text-sm transition-colors duration-300 ${
          standard.active 
            ? (isDarkMode ? 'text-green-400' : 'text-green-600')
            : (isDarkMode ? 'text-gray-500' : 'text-gray-400')
        }`}>
          {standard.active ? <Eye size={16} /> : <EyeOff size={16} />}
          {standard.active ? 'Active' : 'Inactive'}
        </div>
      </div>

      {/* Progress Bar */}
      <div className={`w-full h-2 rounded-full transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
      }`}>
        <div 
          className={`h-full rounded-full transition-all duration-300 ${
            standard.completed 
              ? (isDarkMode ? 'bg-green-500' : 'bg-green-600')
              : (isDarkMode ? 'bg-blue-500' : 'bg-blue-600')
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-4 gap-2 mt-3">
        {STANDARD_STEPS.map((step, index) => (
          <div
            key={index}
            className={`text-center p-2 rounded text-xs transition-colors duration-300 ${
              standard.steps[index]
                ? (isDarkMode ? 'bg-green-700 text-green-200' : 'bg-green-200 text-green-800')
                : (isDarkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-100 text-gray-600')
            }`}
          >
            {index + 1}
          </div>
        ))}
      </div>

      {standard.lastWorkedOn && (
        <div className={`text-xs mt-3 transition-colors duration-300 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Last worked: {new Date(standard.lastWorkedOn).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

export default StandardCard; 