import React from 'react';

const ProgressBarChart = ({ data, isDarkMode }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return isDarkMode ? 'bg-green-600' : 'bg-green-500';
      case 'active':
        return isDarkMode ? 'bg-blue-600' : 'bg-blue-500';
      case 'inactive':
        return isDarkMode ? 'bg-gray-600' : 'bg-gray-400';
      default:
        return isDarkMode ? 'bg-gray-600' : 'bg-gray-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      default:
        return 'Unknown';
    }
  };

  const formatLastWorkedOn = (dateString) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className={`p-4 rounded-lg border transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
        isDarkMode ? 'text-white' : 'text-gray-800'
      }`}>Standards Progress</h3>
      
      <div className="space-y-4">
        {data.map((standard, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`font-medium transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  {standard.name}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full transition-colors duration-300 ${
                  standard.status === 'completed' 
                    ? (isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800')
                    : standard.status === 'active'
                    ? (isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800')
                    : (isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600')
                }`}>
                  {getStatusText(standard.status)}
                </span>
              </div>
              <span className={`text-sm font-medium transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {standard.completedSteps}/{standard.totalSteps}
              </span>
            </div>
            
            <div className="relative">
              <div className={`w-full h-3 rounded-full transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getStatusColor(standard.status)}`}
                  style={{ width: `${standard.progressPercentage}%` }}
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-xs font-medium transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  {standard.progressPercentage}%
                </span>
              </div>
            </div>
            
            <div className={`text-xs transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Last worked on: {formatLastWorkedOn(standard.lastWorkedOn)}
            </div>
          </div>
        ))}
      </div>
      
      {data.length === 0 && (
        <div className={`text-center py-8 transition-colors duration-300 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          No standards data available
        </div>
      )}
    </div>
  );
};

export default ProgressBarChart; 