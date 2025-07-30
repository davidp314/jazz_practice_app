import React, { useState, useEffect } from 'react';
import { X, Plus, Target, Calendar, Flag, Check } from 'lucide-react';
import { 
  GOAL_CATEGORIES, 
  GOAL_PRIORITY, 
  GOAL_DURATION, 
  DEFAULT_GOAL_TEMPLATES,
  GOAL_TEMPLATES 
} from '../constants';

const EditGoalForm = ({ goal, onUpdate, onCancel, isDarkMode }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: GOAL_CATEGORIES.OTHER,
    priority: GOAL_PRIORITY.MEDIUM,
    duration: GOAL_DURATION.MEDIUM_TERM,
    targetDate: '',
    successCriteria: [],
    notes: ''
  });

  const [newCriterion, setNewCriterion] = useState('');

  // Initialize form data when goal prop changes
  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title || '',
        description: goal.description || '',
        category: goal.category || GOAL_CATEGORIES.OTHER,
        priority: goal.priority || GOAL_PRIORITY.MEDIUM,
        duration: goal.duration || GOAL_DURATION.MEDIUM_TERM,
        targetDate: goal.targetDate || '',
        successCriteria: goal.successCriteria || [],
        notes: goal.notes || ''
      });
    }
  }, [goal]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addCriterion = () => {
    if (newCriterion.trim()) {
      setFormData(prev => ({
        ...prev,
        successCriteria: [...prev.successCriteria, newCriterion.trim()]
      }));
      setNewCriterion('');
    }
  };

  const removeCriterion = (index) => {
    setFormData(prev => ({
      ...prev,
      successCriteria: prev.successCriteria.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onUpdate(goal.id, formData);
    }
  };

  if (!goal) return null;

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
              Edit Goal
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Goal Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full p-3 rounded-lg border transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="e.g., Master Autumn Leaves"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full p-3 rounded-lg border transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {Object.entries(GOAL_CATEGORIES).map(([key, value]) => (
                    <option key={key} value={value}>
                      {value.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className={`w-full p-3 rounded-lg border transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Describe what you want to achieve..."
              />
            </div>

            {/* Priority and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className={`w-full p-3 rounded-lg border transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {Object.entries(GOAL_PRIORITY).map(([key, value]) => (
                    <option key={key} value={value}>
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Duration
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className={`w-full p-3 rounded-lg border transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {Object.entries(GOAL_DURATION).map(([key, value]) => (
                    <option key={key} value={value}>
                      {value.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Target Date
                </label>
                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => handleInputChange('targetDate', e.target.value)}
                  className={`w-full p-3 rounded-lg border transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>

            {/* Success Criteria */}
            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Success Criteria
              </label>
              <div className="space-y-2 mb-3">
                {formData.successCriteria.map((criterion, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check size={16} className="text-green-600" />
                    <span className={`flex-1 text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {criterion}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeCriterion(index)}
                      className={`p-1 rounded transition-colors duration-200 ${
                        isDarkMode 
                          ? 'text-red-400 hover:text-red-300 hover:bg-gray-700' 
                          : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                      }`}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCriterion}
                  onChange={(e) => setNewCriterion(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCriterion())}
                  className={`flex-1 p-2 rounded-lg border transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Add a success criterion..."
                />
                <button
                  type="button"
                  onClick={addCriterion}
                  className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isDarkMode 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={2}
                className={`w-full p-3 rounded-lg border transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Additional notes or context..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onCancel}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-600 text-white hover:bg-gray-700' 
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isDarkMode 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                Update Goal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditGoalForm; 