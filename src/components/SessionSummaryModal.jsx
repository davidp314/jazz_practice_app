import React, { useState } from 'react';
import { TASK_TYPES } from "../constants";

const SessionSummaryModal = ({ 
  isOpen, 
  summaryData, 
  onComplete, 
  onCancel, 
  standards,
  isDarkMode,
  formatTime 
}) => {
  const [stepCompletions, setStepCompletions] = useState({});
  const [finalNotes, setFinalNotes] = useState({});

  if (!isOpen || !summaryData) return null;

  const { session, taskTimeSpent, sessionElapsed } = summaryData;
  
  const jazzStandardTasks = session.tasks.filter(task => 
    task.type === TASK_TYPES.STANDARD && task.focusStep !== null
  );

  const jazzStandards = jazzStandardTasks.map(task => {
    const standard = standards.find(s => s.id === task.standardId);
    return { task, standard };
  }).filter(item => item.standard);

  const handleStepCompletion = (standardId, stepIndex, completed) => {
    setStepCompletions(prev => ({
      ...prev,
      [`${standardId}-${stepIndex}`]: completed
    }));
  };

  const handleFinalNote = (taskId, note) => {
    setFinalNotes(prev => ({
      ...prev,
      [taskId]: note
    }));
  };

  const getStepLabel = (stepIndex) => {
    const labels = [
      'Staples', 'Shells', 'Scales', 'Arpeggios', 
      '3rds', 'Comping', 'Improv', 'Video'
    ];
    const safeStepIndex = stepIndex || 0;
    return labels[safeStepIndex] || `Step ${safeStepIndex + 1}`;
  };

  const handleComplete = () => {
    onComplete(stepCompletions, finalNotes);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>Session Summary</h2>
          <button
            onClick={onCancel}
            className={`text-2xl leading-none transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            ×
          </button>
        </div>

        {/* Session Overview */}
        <div className={`p-4 rounded-lg mb-6 transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <h3 className={`text-lg font-semibold mb-3 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>Session Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>Total Time</div>
              <div className={`font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>{formatTime(sessionElapsed)}</div>
            </div>
            <div>
              <div className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>Tasks Completed</div>
              <div className={`font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>{session.tasks.length}</div>
            </div>
            <div>
              <div className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>Date</div>
              <div className={`font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>{new Date(session.date).toLocaleDateString()}</div>
            </div>
            <div>
              <div className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>Status</div>
              <div className={`font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-green-400' : 'text-green-600'
              }`}>Completed</div>
            </div>
          </div>
        </div>

        {/* Task Details */}
        <div className="mb-6">
          <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>Task Details</h3>
          <div className="space-y-4">
            {session.tasks.map((task, index) => {
              const timeSpent = taskTimeSpent[task.id] || 0;
              const timeAllocated = task.timeAllocated * 60;
              const isOverTime = timeSpent > timeAllocated;
              
              return (
                <div key={task.id} className={`p-4 rounded-lg border transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                }`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className={`font-medium transition-colors duration-300 ${
                        isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}>
                        {index + 1}. {task.name}
                        {task.type === TASK_TYPES.STANDARD && task.focusStep !== null && (
                          <span className={`ml-2 text-xs px-2 py-1 rounded transition-colors duration-300 ${
                            isDarkMode ? 'bg-blue-900/50 text-blue-300 border border-blue-700' : 'bg-blue-100 text-blue-800'
                          }`}>
                            Step {(task.focusStep || 0) + 1}: {getStepLabel(task.focusStep || 0)}
                          </span>
                        )}
                      </div>
                      <div className={`text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {task.type.replace('_', ' ')} • {formatTime(timeSpent)} / {formatTime(timeAllocated)}
                        {isOverTime && (
                          <span className="ml-1 font-medium text-orange-600">
                            (+{formatTime(timeSpent - timeAllocated)} over)
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded text-xs font-medium ${
                      isOverTime
                        ? (isDarkMode ? 'bg-orange-700 text-orange-200' : 'bg-orange-200 text-orange-800')
                        : (isDarkMode ? 'bg-green-700 text-green-200' : 'bg-green-200 text-green-800')
                    }`}>
                      {isOverTime ? 'Overtime' : 'Complete'}
                    </div>
                  </div>
                  
                  {/* Final Notes Input */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Session Notes
                    </label>
                    <textarea
                      value={finalNotes[task.id] || ''}
                      onChange={(e) => handleFinalNote(task.id, e.target.value)}
                      placeholder="Add notes about this practice session..."
                      className={`w-full p-3 border rounded-md resize-none h-20 transition-colors duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-800'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Completions for Jazz Standards */}
        {jazzStandards.length > 0 && (
          <div className="mb-6">
            <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>Step Completions</h3>
            <div className="space-y-4">
              {jazzStandards.map(({ task, standard }) => (
                <div key={task.id} className={`p-4 rounded-lg border transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                }`}>
                  <h4 className={`font-medium mb-3 transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    {standard.name} - Step {(task.focusStep || 0) + 1}: {getStepLabel(task.focusStep || 0)}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((stepIndex) => {
                      const isCompleted = stepCompletions[`${standard.id}-${stepIndex}`] || standard.steps[stepIndex];
                      const isCurrentStep = stepIndex === task.focusStep;
                      
                      return (
                        <label
                          key={stepIndex}
                          className={`flex items-center gap-2 p-2 border rounded-md cursor-pointer transition-all duration-200 text-sm ${
                            isCurrentStep
                              ? 'border-blue-500 bg-blue-50 text-blue-800'
                              : isCompleted
                                ? 'border-green-200 bg-green-50'
                                : 'border-gray-200 bg-white'
                          } ${isDarkMode && !isCurrentStep ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                        >
                          <input
                            type="checkbox"
                            checked={isCompleted}
                            onChange={(e) => handleStepCompletion(standard.id, stepIndex, e.target.checked)}
                            className="text-blue-600"
                          />
                          <span className="font-medium">
                            {stepIndex + 1}
                          </span>
                          <span className="flex-1 min-w-0">
                            {getStepLabel(stepIndex)}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6">
          <button
            onClick={onCancel}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors duration-200 ${
              isDarkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleComplete}
            className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
          >
            Complete Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionSummaryModal; 