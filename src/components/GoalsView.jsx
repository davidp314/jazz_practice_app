import React, { useState } from 'react';
import { Plus, Target, BarChart3, Filter, Flag } from 'lucide-react';
import GoalCard from './GoalCard';
import AddGoalForm from './AddGoalForm';
import EditGoalForm from './EditGoalForm';
import TaskGoalLinker from './TaskGoalLinker';
import { GOAL_STATUS } from '../constants';

const GoalsView = ({ 
  goals, 
  onBack, 
  onSelectGoal, 
  onEditGoal, 
  onDeleteGoal, 
  onAddGoal,
  onLinkTask,
  onUnlinkTask,
  standards,
  otherWork,
  isDarkMode, 
  toggleDarkMode 
}) => {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [showTaskLinker, setShowTaskLinker] = useState(false);
  const [selectedGoalForTasks, setSelectedGoalForTasks] = useState(null);
  const [filter, setFilter] = useState('all');

  const getFilteredGoals = () => {
    switch (filter) {
      case 'active':
        return goals.filter(goal => 
          goal.status === GOAL_STATUS.IN_PROGRESS || goal.status === GOAL_STATUS.NOT_STARTED
        );
      case 'completed':
        return goals.filter(goal => goal.status === GOAL_STATUS.COMPLETED);
      case 'overdue':
        return goals.filter(goal => {
          if (goal.status === GOAL_STATUS.COMPLETED) return false;
          if (!goal.targetDate) return false;
          return new Date(goal.targetDate) < new Date();
        });
      default:
        return goals;
    }
  };

  const getGoalsStats = () => {
    const total = goals.length;
    const completed = goals.filter(g => g.status === GOAL_STATUS.COMPLETED).length;
    const inProgress = goals.filter(g => g.status === GOAL_STATUS.IN_PROGRESS).length;
    const overdue = goals.filter(g => {
      if (g.status === GOAL_STATUS.COMPLETED) return false;
      if (!g.targetDate) return false;
      return new Date(g.targetDate) < new Date();
    }).length;

    return {
      total,
      completed,
      inProgress,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  };

  const stats = getGoalsStats();
  const filteredGoals = getFilteredGoals();

  const handleManageTasks = (goal) => {
    setSelectedGoalForTasks(goal);
    setShowTaskLinker(true);
  };

  const handleLinkTaskToGoal = (goalId, taskData) => {
    onLinkTask(goalId, taskData);
  };

  const handleUnlinkTaskFromGoal = (goalId, taskId) => {
    onUnlinkTask(goalId, taskId);
  };

  return (
    <div className={`max-w-6xl mx-auto p-6 min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-white'
    }`}>
      <div className={`rounded-lg shadow-lg p-6 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-2xl font-bold transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>Goals</h1>
          <div className="flex gap-3 items-center">
            <button
              onClick={() => setShowAddGoal(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <Plus size={16} />
              New Goal
            </button>
            <button
              onClick={onBack}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-500 text-white hover:bg-gray-600'
              }`}
            >
              Back to Overview
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className={`p-4 rounded-lg transition-colors duration-300 ${
            isDarkMode ? 'bg-blue-900/50 border border-blue-700' : 'bg-blue-50'
          }`}>
            <h3 className={`font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-blue-300' : 'text-blue-800'
            }`}>Total Goals</h3>
            <p className={`text-2xl font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-blue-400' : 'text-blue-600'
            }`}>{stats.total}</p>
          </div>
          <div className={`p-4 rounded-lg transition-colors duration-300 ${
            isDarkMode ? 'bg-green-900/50 border border-green-700' : 'bg-green-50'
          }`}>
            <h3 className={`font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-green-300' : 'text-green-800'
            }`}>Completed</h3>
            <p className={`text-2xl font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-green-400' : 'text-green-600'
            }`}>{stats.completed}</p>
            <p className={`text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-green-400' : 'text-green-600'
            }`}>{stats.completionRate}% completion rate</p>
          </div>
          <div className={`p-4 rounded-lg transition-colors duration-300 ${
            isDarkMode ? 'bg-blue-900/50 border border-blue-700' : 'bg-blue-50'
          }`}>
            <h3 className={`font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-blue-300' : 'text-blue-800'
            }`}>In Progress</h3>
            <p className={`text-2xl font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-blue-400' : 'text-blue-600'
            }`}>{stats.inProgress}</p>
          </div>
          <div className={`p-4 rounded-lg transition-colors duration-300 ${
            isDarkMode ? 'bg-red-900/50 border border-red-700' : 'bg-red-50'
          }`}>
            <h3 className={`font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-red-300' : 'text-red-800'
            }`}>Overdue</h3>
            <p className={`text-2xl font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-red-400' : 'text-red-600'
            }`}>{stats.overdue}</p>
          </div>
          <div className={`p-4 rounded-lg transition-colors duration-300 ${
            isDarkMode ? 'bg-purple-900/50 border border-purple-700' : 'bg-purple-50'
          }`}>
            <h3 className={`font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-purple-300' : 'text-purple-800'
            }`}>Showing</h3>
            <p className={`text-2xl font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-purple-400' : 'text-purple-600'
            }`}>{filteredGoals.length}</p>
            <p className={`text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-purple-400' : 'text-purple-600'
            }`}>filtered goals</p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filter === 'all'
                  ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white')
                  : (isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
              }`}
            >
              All ({goals.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filter === 'active'
                  ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white')
                  : (isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
              }`}
            >
              Active ({goals.filter(g => g.status === GOAL_STATUS.IN_PROGRESS || g.status === GOAL_STATUS.NOT_STARTED).length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filter === 'completed'
                  ? (isDarkMode ? 'bg-green-600 text-white' : 'bg-green-600 text-white')
                  : (isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
              }`}
            >
              Completed ({goals.filter(g => g.status === GOAL_STATUS.COMPLETED).length})
            </button>
            <button
              onClick={() => setFilter('overdue')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filter === 'overdue'
                  ? (isDarkMode ? 'bg-red-600 text-white' : 'bg-red-600 text-white')
                  : (isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
              }`}
            >
              Overdue ({goals.filter(g => {
                if (g.status === GOAL_STATUS.COMPLETED) return false;
                if (!g.targetDate) return false;
                return new Date(g.targetDate) < new Date();
              }).length})
            </button>
          </div>
        </div>

        {/* Goals List */}
        <div className="space-y-4">
          {filteredGoals.length === 0 ? (
            <div className={`text-center py-12 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Target size={48} className="mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No goals found</h3>
              <p className="mb-4">
                {filter === 'all' 
                  ? "You haven't created any goals yet. Start by creating your first goal!"
                  : `No ${filter} goals found.`
                }
              </p>
              {filter === 'all' && (
                <button
                  onClick={() => setShowAddGoal(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    isDarkMode 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  <Plus size={16} />
                  Create Your First Goal
                </button>
              )}
            </div>
          ) : (
            filteredGoals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onSelect={onSelectGoal}
                onEdit={(goal) => setEditingGoal(goal)}
                onDelete={onDeleteGoal}
                onManageTasks={handleManageTasks}
                isDarkMode={isDarkMode}
              />
            ))
          )}
        </div>
      </div>

      {/* Add Goal Modal */}
      {showAddGoal && (
        <AddGoalForm
          onAdd={(goalData) => {
            onAddGoal(goalData);
            setShowAddGoal(false);
          }}
          onCancel={() => setShowAddGoal(false)}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Edit Goal Modal */}
      {editingGoal && (
        <EditGoalForm
          goal={editingGoal}
          onUpdate={(goalId, updates) => {
            onEditGoal(goalId, updates);
            setEditingGoal(null);
          }}
          onCancel={() => setEditingGoal(null)}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Task Goal Linker Modal */}
      {showTaskLinker && selectedGoalForTasks && (
        <TaskGoalLinker
          task={selectedGoalForTasks}
          goals={goals}
          linkedGoals={selectedGoalForTasks.associatedTasks || []}
          onLinkTask={handleLinkTaskToGoal}
          onUnlinkTask={handleUnlinkTaskFromGoal}
          onCancel={() => {
            setShowTaskLinker(false);
            setSelectedGoalForTasks(null);
          }}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

export default GoalsView; 