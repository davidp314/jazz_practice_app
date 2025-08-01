import React from 'react';

const WeeklyTrendChart = ({ data, isDarkMode }) => {
  const maxValue = Math.max(...data.map(item => item.totalTime), 1);
  const chartHeight = 200;
  const chartWidth = 400;
  const padding = 40;
  const usableWidth = chartWidth - (padding * 2);
  const usableHeight = chartHeight - (padding * 2);

  const getPoint = (value, index) => {
    const x = padding + (index / (data.length - 1)) * usableWidth;
    const y = chartHeight - padding - (value / maxValue) * usableHeight;
    return { x, y };
  };

  const createPath = () => {
    if (data.length < 2) return '';
    
    const points = data.map((item, index) => getPoint(item.totalTime, index));
    const path = points.map((point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`;
      return `L ${point.x} ${point.y}`;
    }).join(' ');
    
    return path;
  };

  const formatWeek = (weekLabel) => {
    return weekLabel.replace('Week ', 'W');
  };

  return (
    <div className={`p-4 rounded-lg border transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
        isDarkMode ? 'text-white' : 'text-gray-800'
      }`}>Weekly Practice Trends</h3>
      
      <div className="flex items-center justify-center">
        <svg width={chartWidth} height={chartHeight} className="overflow-visible">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const y = chartHeight - padding - (ratio * usableHeight);
            return (
              <line
                key={index}
                x1={padding}
                y1={y}
                x2={chartWidth - padding}
                y2={y}
                stroke={isDarkMode ? '#374151' : '#e5e7eb'}
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            );
          })}
          
          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const y = chartHeight - padding - (ratio * usableHeight);
            const value = Math.round(ratio * maxValue);
            return (
              <text
                key={index}
                x={padding - 10}
                y={y + 4}
                textAnchor="end"
                className={`text-xs transition-colors duration-300 ${
                  isDarkMode ? 'fill-gray-400' : 'fill-gray-500'
                }`}
              >
                {value}
              </text>
            );
          })}
          
          {/* X-axis labels */}
          {data.map((item, index) => {
            const point = getPoint(item.totalTime, index);
            return (
              <text
                key={index}
                x={point.x}
                y={chartHeight - padding + 20}
                textAnchor="middle"
                className={`text-xs transition-colors duration-300 ${
                  isDarkMode ? 'fill-gray-400' : 'fill-gray-500'
                }`}
              >
                {formatWeek(item.week)}
              </text>
            );
          })}
          
          {/* Line chart */}
          <path
            d={createPath()}
            stroke={isDarkMode ? '#3B82F6' : '#2563EB'}
            strokeWidth="3"
            fill="none"
            className="transition-all duration-300"
          />
          
          {/* Data points */}
          {data.map((item, index) => {
            const point = getPoint(item.totalTime, index);
            return (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="4"
                fill={isDarkMode ? '#3B82F6' : '#2563EB'}
                stroke={isDarkMode ? '#1E40AF' : '#1D4ED8'}
                strokeWidth="2"
                className="transition-all duration-200 hover:r-6"
              />
            );
          })}
        </svg>
      </div>
      
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="text-center">
          <div className={`text-lg font-bold transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {Math.round(data.reduce((sum, item) => sum + item.totalTime, 0) / data.length)}
          </div>
          <div className={`text-xs transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Avg Min/Week
          </div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-bold transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {Math.round(data.reduce((sum, item) => sum + item.sessions, 0) / data.length)}
          </div>
          <div className={`text-xs transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Avg Sessions/Week
          </div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-bold transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {Math.round(data.reduce((sum, item) => sum + item.consistency, 0) / data.length)}%
          </div>
          <div className={`text-xs transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Avg Consistency
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyTrendChart; 