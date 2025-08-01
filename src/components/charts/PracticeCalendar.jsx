import React from 'react';

const PracticeCalendar = ({ data, isDarkMode }) => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const getIntensityColor = (intensity) => {
    if (isDarkMode) {
      switch (intensity) {
        case 0: return 'bg-gray-800 border-gray-700';
        case 1: return 'bg-green-900 border-green-800';
        case 2: return 'bg-green-800 border-green-700';
        case 3: return 'bg-green-700 border-green-600';
        case 4: return 'bg-green-600 border-green-500';
        case 5: return 'bg-green-500 border-green-400';
        default: return 'bg-gray-800 border-gray-700';
      }
    } else {
      switch (intensity) {
        case 0: return 'bg-gray-100 border-gray-200';
        case 1: return 'bg-green-100 border-green-200';
        case 2: return 'bg-green-200 border-green-300';
        case 3: return 'bg-green-300 border-green-400';
        case 4: return 'bg-green-400 border-green-500';
        case 5: return 'bg-green-500 border-green-600';
        default: return 'bg-gray-100 border-gray-200';
      }
    }
  };

  const getTooltipText = (day) => {
    if (day.totalTime === 0) {
      return `${day.date}: No practice`;
    }
    return `${day.date}: ${day.totalTime} minutes (${day.sessions} session${day.sessions !== 1 ? 's' : ''})`;
  };

  return (
    <div className={`p-4 rounded-lg border transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
        isDarkMode ? 'text-white' : 'text-gray-800'
      }`}>Practice Calendar (Last 30 Days)</h3>
      
      <div className="flex items-start space-x-2">
        {/* Day labels */}
        <div className="flex flex-col space-y-1 pt-6">
          {daysOfWeek.map(day => (
            <div key={day} className={`text-xs font-medium h-4 flex items-center transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="flex-1">
          <div className="grid grid-cols-30 gap-1">
            {data.map((day, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-sm border transition-all duration-200 cursor-pointer hover:scale-110 ${getIntensityColor(day.intensity)}`}
                title={getTooltipText(day)}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center space-x-4 mt-4 text-xs">
        <span className={`transition-colors duration-300 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>Less</span>
        <div className="flex space-x-1">
          {[0, 1, 2, 3, 4, 5].map(intensity => (
            <div
              key={intensity}
              className={`w-3 h-3 rounded-sm border ${getIntensityColor(intensity)}`}
            />
          ))}
        </div>
        <span className={`transition-colors duration-300 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>More</span>
      </div>
    </div>
  );
};

export default PracticeCalendar; 