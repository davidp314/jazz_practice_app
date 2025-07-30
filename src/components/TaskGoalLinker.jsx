import React, { useState } from 'react';
import { Link, Unlink, Plus, X, Target, Check } from 'lucide-react';
import { GOAL_STATUS, GOAL_CATEGORIES } from '../constants';

const TaskGoalLinker = ({ 
  task, 
  goals, 
  linkedGoals, 
  onLinkTask, 
  onUnlinkTask, 
  onCancel, 
  isDarkMode 
}) => {
  const [selectedGoalId, setSelectedGoalId] = useState('');

  const getGoalStatusColor = (status) => {
    switch (status) {
      case GOAL_STATUS.COMPLETED:
        return 'text-green-600';
      case GOAL_STATUS.IN_PROGRESS:
        return 'text-blue-600';
      case GOAL_STATUS.OVERDUE:
        return 'text-red-600';
      case GOAL_STATUS.PAUSED:
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case GOAL_CATEGORIES.REPERTOIRE:
        return '🎵';
      case GOAL_CATEGORIES.TECHNIQUE:
        return '🎯';
      case GOAL_CATEGORIES.THEORY:
        return '📚';
      case GOAL_CATEGORIES.PERFORMANCE:
        return '🎭';
      case GOAL_CATEGORIES.AUDITION:
        return '🎪';
      case GOAL_CATEGORIES.GIG_PREPARATION:
        return '🎸';
      case GOAL_CATEGORIES.PERSONAL_GROWTH:
        return '🌱';
      default:
        return '📋';
    }
  };

  const handleLinkTask = () => {
    if (selectedGoalId) {
      onLinkTask(selectedGoalId, task);
      setSelectedGoalId('');
    }
  };

  const availableGoals = goals.filter(goal => 
    !linkedGoals.some(linkedGoal => linkedGoal.id === goal.id)
  );

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-colors duration-300`}>
      <div className={`max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto rounded-lg shadow-xl transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Link Task to Goals
            </h2>
            <button
              onClick={onCancel}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <X size={20} />
            </button>
          </div>

          {/* Task Information */}
          <div className={`p-4 rounded-lg mb-6 transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <h3 className={`font-semibold mb-2 transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Task: {task.name}
            </h3>
            <p className={`text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Type: {task.type === 'standard' ? 'Jazz Standard' : 'Other Work'}
            </p>
            {task.timeAllocated && (
              <p className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Time Allocated: {task.timeAllocated} minutes
              </p>
            )}
          </div>

          {/* Currently Linked Goals */}
          {linkedGoals.length > 0 && (
            <div className="mb-6">
              <h3 className={`font-semibold mb-3 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Currently Linked Goals ({linkedGoals.length})
              </h3>
              <div className="space-y-2">
                {linkedGoals.map(goal => (
                  <div key={goal.id} className={`flex items-center justify-between p-3 rounded-lg transition-colors duration-300 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{getCategoryIcon(goal.category)}</span>
                      <div>
                        <h4 className={`font-medium transition-colors duration-300 ${
                          isDarkMode ? 'text-white' : 'text-gray-800'
                        }`}>
                          {goal.title}
                        </h4>
                        <p className={`text-sm transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {goal.category.replace('_', ' ')} • {goal.status.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onUnlinkTask(goal.id, task.id)}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        isDarkMode 
                          ? 'text-red-400 hover:text-red-300 hover:bg-gray-600' 
                          : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                      }`}
                      title="Unlink from goal"
                    >
                      <Unlink size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Link to New Goal */}
          <div className="mb-6">
            <h3 className={`font-semibold mb-3 transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Link to Available Goals
            </h3>
            
            {availableGoals.length === 0 ? (
              <div className={`text-center py-6 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <Target size={32} className="mx-auto mb-2 opacity-50" />
                <p>No available goals to link to.</p>
                <p className="text-sm">All goals are already linked to this task.</p>
              </div>
            ) : (
              <>
                <div className="flex gap-2 mb-4">
                  <select
                    value={selectedGoalId}
                    onChange={(e) => setSelectedGoalId(e.target.value)}
                    className={`flex-1 p-3 rounded-lg border transition-colors duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">Select a goal to link...</option>
                    {availableGoals.map(goal => (
                      <option key={goal.id} value={goal.id}>
                        {goal.title} ({goal.category.replace('_', ' ')}) - {goal.status.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleLinkTask}
                    disabled={!selectedGoalId}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors duration-200 ${
                      selectedGoalId
                        ? (isDarkMode 
                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                            : 'bg-blue-600 text-white hover:bg-blue-700')
                        : (isDarkMode 
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed')
                    }`}
                  >
                    <Link size={16} />
                    Link
                  </button>
                </div>

                {/* Available Goals List */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {availableGoals.map(goal => (
                    <div key={goal.id} className={`flex items-center justify-between p-3 rounded-lg border transition-colors duration-300 ${
                      isDarkMode ? 'border-gray-600' : 'border-gray-200'
                    }`}>
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{getCategoryIcon(goal.category)}</span>
                        <div>
                          <h4 className={`font-medium transition-colors duration-300 ${
                            isDarkMode ? 'text-white' : 'text-gray-800'
                          }`}>
                            {goal.title}
                          </h4>
                          <p className={`text-sm transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {goal.category.replace('_', ' ')} • {goal.status.replace('_', ' ')}
                          </p>
                          {goal.description && (
                            <p className={`text-sm italic transition-colors duration-300 ${
                              isDarkMode ? 'text-gray-500' : 'text-gray-500'
                            }`}>
                              {goal.description.substring(0, 100)}...
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => onLinkTask(goal.id, task)}
                        className={`p-2 rounded-lg transition-colors duration-200 ${
                          isDarkMode 
                            ? 'text-blue-400 hover:text-blue-300 hover:bg-gray-600' 
                            : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                        }`}
                        title="Link to this goal"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onCancel}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-gray-600 text-white hover:bg-gray-700' 
                  : 'bg-gray-500 text-white hover:bg-gray-600'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskGoalLinker; 