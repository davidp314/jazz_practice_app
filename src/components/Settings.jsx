import React from 'react';
import DarkModeToggle from './DarkModeToggle';

const Settings = ({ 
  isOpen, 
  onClose, 
  isDarkMode, 
  toggleDarkMode,
  streakSettings,
  updateStreakSettings,
  toggleStreakEnabled,
  updateDailyStreakSettings,
  updateWeeklyStreakSettings
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>Settings</h2>
          <button
            onClick={onClose}
            className={`text-2xl leading-none transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            ×
          </button>
        </div>

        <div className="space-y-8">
          {/* Appearance Setting */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>Appearance</h3>
              <p className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>Toggle between light and dark mode</p>
            </div>
            <DarkModeToggle 
              isDarkMode={isDarkMode} 
              toggleDarkMode={toggleDarkMode} 
              size={20}
            />
          </div>

          {/* Streak Settings */}
          <div className={`border-t transition-colors duration-300 ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>Streak Counter</h3>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>Track your practice consistency with daily and weekly streaks</p>
              </div>
              <button
                onClick={toggleStreakEnabled}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  streakSettings.enabled
                    ? 'bg-green-600'
                    : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    streakSettings.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {streakSettings.enabled && (
              <div className="space-y-6">
                {/* Daily Streak Settings */}
                <div className={`p-4 rounded-lg transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`font-medium transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>Daily Streak</h4>
                    <button
                      onClick={() => updateDailyStreakSettings({ enabled: !streakSettings.dailyStreak.enabled })}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
                        streakSettings.dailyStreak.enabled
                          ? 'bg-orange-600'
                          : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ${
                          streakSettings.dailyStreak.enabled ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  {streakSettings.dailyStreak.enabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Goal (days)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="365"
                          value={streakSettings.dailyStreak.goal}
                          onChange={(e) => updateDailyStreakSettings({ goal: parseInt(e.target.value) || 0 })}
                          className={`mt-1 block w-full rounded-md border transition-colors duration-300 ${
                            isDarkMode 
                              ? 'bg-gray-600 border-gray-500 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Grace Days
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="7"
                          value={streakSettings.dailyStreak.graceDays}
                          onChange={(e) => updateDailyStreakSettings({ graceDays: parseInt(e.target.value) || 0 })}
                          className={`mt-1 block w-full rounded-md border transition-colors duration-300 ${
                            isDarkMode 
                              ? 'bg-gray-600 border-gray-500 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500`}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Weekly Streak Settings */}
                <div className={`p-4 rounded-lg transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`font-medium transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>Weekly Streak</h4>
                    <button
                      onClick={() => updateWeeklyStreakSettings({ enabled: !streakSettings.weeklyStreak.enabled })}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
                        streakSettings.weeklyStreak.enabled
                          ? 'bg-purple-600'
                          : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ${
                          streakSettings.weeklyStreak.enabled ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  {streakSettings.weeklyStreak.enabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Days per Week Goal
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="7"
                          value={streakSettings.weeklyStreak.goal}
                          onChange={(e) => updateWeeklyStreakSettings({ goal: parseInt(e.target.value) || 0 })}
                          className={`mt-1 block w-full rounded-md border transition-colors duration-300 ${
                            isDarkMode 
                              ? 'bg-gray-600 border-gray-500 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Grace Weeks
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="4"
                          value={streakSettings.weeklyStreak.graceWeeks}
                          onChange={(e) => updateWeeklyStreakSettings({ graceWeeks: parseInt(e.target.value) || 0 })}
                          className={`mt-1 block w-full rounded-md border transition-colors duration-300 ${
                            isDarkMode 
                              ? 'bg-gray-600 border-gray-500 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 