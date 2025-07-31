import React from 'react';
import { Play, Download } from 'lucide-react';


const CollectionCard = ({ session, onSelect, onExport, isDarkMode, completed = false, dependencyStatus, locked = false }) => {
  // Handle missing dueDate
  const dueDate = session.dueDate ? new Date(session.dueDate) : null;
  const daysUntilDue = dueDate ? Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24)) : null;
  const isOverdue = daysUntilDue !== null && daysUntilDue < 0;
  const isLocked = locked || dependencyStatus === 'locked';
  
  return (
    <div className={`p-4 rounded-lg border transition-all duration-300 ${
      completed
        ? (isDarkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200')
        : isLocked
          ? (isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-100 border-gray-300')
          : isOverdue
            ? (isDarkMode ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-200')
            : (isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200')
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className={`font-medium mb-1 transition-colors duration-300 ${
            completed
              ? (isDarkMode ? 'text-green-300' : 'text-green-800')
              : isLocked
                ? (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                : isOverdue
                  ? (isDarkMode ? 'text-red-300' : 'text-red-800')
                  : (isDarkMode ? 'text-white' : 'text-gray-800')
          }`}>
            {session.name || 'Untitled Session'}
          </h4>
          <p className={`text-sm transition-colors duration-300 ${
            completed
              ? (isDarkMode ? 'text-green-400' : 'text-green-600')
              : isLocked
                ? (isDarkMode ? 'text-gray-500' : 'text-gray-400')
                : isOverdue
                  ? (isDarkMode ? 'text-red-400' : 'text-red-600')
                  : (isDarkMode ? 'text-gray-400' : 'text-gray-600')
          }`}>
            {session.description || 'No description available'}
          </p>
        </div>
        <div className="flex gap-2">
          {!isLocked && (
            <button
              onClick={onSelect}
              className={`p-2 rounded transition-colors duration-200 ${
                completed
                  ? (isDarkMode ? 'bg-green-700 text-green-200 hover:bg-green-600' : 'bg-green-600 text-white hover:bg-green-700')
                  : isOverdue
                    ? (isDarkMode ? 'bg-red-700 text-red-200 hover:bg-red-600' : 'bg-red-600 text-white hover:bg-red-700')
                    : (isDarkMode ? 'bg-blue-700 text-blue-200 hover:bg-blue-600' : 'bg-blue-600 text-white hover:bg-blue-700')
              }`}
              title="Start Session"
            >
              <Play size={16} />
            </button>
          )}
          <button
            onClick={onExport}
            className={`p-2 rounded transition-colors duration-200 ${
              isDarkMode ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            title="Export Session"
          >
            <Download size={16} />
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center text-sm">
        <div className={`transition-colors duration-300 ${
          completed
            ? (isDarkMode ? 'text-green-400' : 'text-green-600')
            : isLocked
              ? (isDarkMode ? 'text-gray-500' : 'text-gray-400')
              : isOverdue
                ? (isDarkMode ? 'text-red-400' : 'text-red-600')
                : (isDarkMode ? 'text-gray-400' : 'text-gray-600')
        }`}>
          {session.totalTime || 0} min
        </div>
        <div className={`transition-colors duration-300 ${
          completed
            ? (isDarkMode ? 'text-green-400' : 'text-green-600')
            : isLocked
              ? (isDarkMode ? 'text-gray-500' : 'text-gray-400')
              : isOverdue
                ? (isDarkMode ? 'text-red-400' : 'text-red-600')
                : (isDarkMode ? 'text-gray-400' : 'text-gray-600')
        }`}>
          {isLocked ? (
            <span className="flex items-center gap-1">
              🔒 Locked
            </span>
          ) : completed ? (
            <span className="flex items-center gap-1">
              ✅ Completed
            </span>
          ) : isOverdue ? (
            <span className="flex items-center gap-1">
              ⚠️ {Math.abs(daysUntilDue)} days overdue
            </span>
          ) : daysUntilDue !== null ? (
            <span className="flex items-center gap-1">
              📅 Due in {daysUntilDue} days
            </span>
          ) : (
            <span className="flex items-center gap-1">
              📋 Available
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionCard; 