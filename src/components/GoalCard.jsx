import React from 'react';
import { Check, Clock, Target, Calendar, Flag, Link, Music, BookOpen } from 'lucide-react';
import { GOAL_STATUS, GOAL_PRIORITY, GOAL_CATEGORIES } from '../constants';

const GoalCard = ({ goal, onSelect, onEdit, onDelete, onManageTasks, isDarkMode }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case GOAL_STATUS.COMPLETED:
        return isDarkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200';
      case GOAL_STATUS.IN_PROGRESS:
        return isDarkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200';
      case GOAL_STATUS.OVERDUE:
        return isDarkMode ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-200';
      case GOAL_STATUS.PAUSED:
        return isDarkMode ? 'bg-yellow-900/30 border-yellow-700' : 'bg-yellow-50 border-yellow-200';
      default:
        return isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case GOAL_PRIORITY.URGENT:
        return 'bg-red-600 text-white';
      case GOAL_PRIORITY.HIGH:
        return 'bg-orange-600 text-white';
      case GOAL_PRIORITY.MEDIUM:
        return 'bg-blue-600 text-white';
      case GOAL_PRIORITY.LOW:
        return 'bg-gray-600 text-white';
      default:
        return 'bg-gray-600 text-white';
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

  const calculateProgress = () => {
    if (!goal.successCriteria || goal.successCriteria.length === 0) return 0;
    return (goal.completedCriteria.length / goal.successCriteria.length) * 100;
  };

  const progress = calculateProgress();
  const isOverdue = goal.targetDate && new Date(goal.targetDate) < new Date() && goal.status !== GOAL_STATUS.COMPLETED;
  const daysUntilDue = goal.targetDate ? Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <div className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-md ${
      getStatusColor(goal.status)
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{getCategoryIcon(goal.category)}</span>
            <h4 className={`font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              {goal.title}
            </h4>
            <span className={`px-2 py-1 text-xs rounded ${getPriorityColor(goal.priority)}`}>
              {goal.priority}
            </span>
          </div>
          
          <div className={`text-sm mb-2 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <div className="flex items-center gap-1 mb-1">
              <Target size={14} />
              <span>{goal.category.replace('_', ' ')}</span>
            </div>
            {goal.targetDate && (
              <div className="flex items-center gap-1 mb-1">
                <Calendar size={14} />
                <span>Due: {new Date(goal.targetDate).toLocaleDateString()}</span>
                {isOverdue && (
                  <span className="text-red-600 font-medium">
                    ({Math.abs(daysUntilDue)} days overdue)
                  </span>
                )}
                {!isOverdue && daysUntilDue !== null && (
                  <span className="text-blue-600 font-medium">
                    ({daysUntilDue} days remaining)
                  </span>
                )}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{goal.timeSpent} minutes • {goal.sessionsCompleted} sessions</span>
            </div>
          </div>

          {goal.description && (
            <p className={`text-sm italic mb-3 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              "{goal.description}"
            </p>
          )}

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className={`text-sm font-medium transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Progress: {Math.round(progress)}%
              </span>
              <span className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {goal.completedCriteria.length}/{goal.successCriteria.length} criteria
              </span>
            </div>
            <div className={`w-full rounded-full h-2 transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
            }`}>
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  goal.status === GOAL_STATUS.COMPLETED 
                    ? 'bg-green-600' 
                    : goal.status === GOAL_STATUS.OVERDUE 
                      ? 'bg-red-600' 
                      : 'bg-blue-600'
                }`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Success Criteria Preview */}
          {goal.successCriteria && goal.successCriteria.length > 0 && (
            <div className="mb-3">
              <h5 className={`text-sm font-medium mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Success Criteria:
              </h5>
              <div className="space-y-1">
                {goal.successCriteria.slice(0, 3).map((criterion, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check 
                      size={14} 
                      className={`${
                        goal.completedCriteria.includes(index) 
                          ? 'text-green-600' 
                          : isDarkMode ? 'text-gray-500' : 'text-gray-400'
                      }`}
                    />
                    <span className={`text-sm transition-colors duration-300 ${
                      goal.completedCriteria.includes(index)
                        ? isDarkMode ? 'text-green-400' : 'text-green-700'
                        : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {criterion}
                    </span>
                  </div>
                ))}
                {goal.successCriteria.length > 3 && (
                  <div className={`text-sm italic transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    +{goal.successCriteria.length - 3} more criteria
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Linked Tasks Preview */}
          {goal.associatedTasks && goal.associatedTasks.length > 0 && (
            <div className="mb-3">
              <h5 className={`text-sm font-medium mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Linked Tasks ({goal.associatedTasks.length}):
              </h5>
              <div className="space-y-1">
                {goal.associatedTasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="flex items-center gap-2">
                    {task.taskType === 'standard' ? (
                      <Music size={14} className="text-blue-600" />
                    ) : (
                      <BookOpen size={14} className="text-purple-600" />
                    )}
                    <span className={`text-sm transition-colors duration-300 ${
                      task.completed
                        ? isDarkMode ? 'text-green-400' : 'text-green-700'
                        : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {task.taskName}
                    </span>
                    {task.completed && (
                      <Check size={12} className="text-green-600" />
                    )}
                  </div>
                ))}
                {goal.associatedTasks.length > 3 && (
                  <div className={`text-sm italic transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    +{goal.associatedTasks.length - 3} more tasks
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <span className={`px-2 py-1 text-xs rounded ${
            goal.status === GOAL_STATUS.COMPLETED
              ? 'bg-green-600 text-white'
              : goal.status === GOAL_STATUS.OVERDUE
                ? 'bg-red-600 text-white'
                : goal.status === GOAL_STATUS.IN_PROGRESS
                  ? 'bg-blue-600 text-white'
                  : goal.status === GOAL_STATUS.PAUSED
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-600 text-white'
          }`}>
            {goal.status.replace('_', ' ')}
          </span>
        </div>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => onSelect(goal)}
          className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors duration-200 ${
            isDarkMode 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <Flag size={14} />
          View Details
        </button>
        <button
          onClick={() => onManageTasks(goal)}
          className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors duration-200 ${
            isDarkMode 
              ? 'bg-purple-600 text-white hover:bg-purple-700' 
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          <Link size={14} />
          Manage Tasks
        </button>
        <button
          onClick={() => onEdit(goal)}
          className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors duration-200 ${
            isDarkMode 
              ? 'bg-gray-600 text-white hover:bg-gray-700' 
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(goal.id)}
          className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors duration-200 ${
            isDarkMode 
              ? 'bg-red-600 text-white hover:bg-red-700' 
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default GoalCard; 