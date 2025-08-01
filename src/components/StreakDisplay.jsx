import React from 'react';

const StreakDisplay = ({ streakData, streakSettings, isDarkMode }) => {
  if (!streakSettings.enabled) {
    return null;
  }

  const { dailyStreak, weeklyStreak } = streakData;
  const hasDailyStreak = streakSettings.dailyStreak?.enabled;
  const hasWeeklyStreak = streakSettings.weeklyStreak?.enabled;

  if (!hasDailyStreak && !hasWeeklyStreak) {
    return null;
  }

  const renderDailyStreak = () => {
    if (!streakSettings.dailyStreak?.enabled) {
      return null;
    }

    const goal = streakSettings.dailyStreak.goal;
    const remainingToGoal = goal > 0 ? goal - dailyStreak.currentStreak : 0;
    const goalReached = goal > 0 && dailyStreak.currentStreak >= goal;

    return (
      <div className="flex items-center gap-2">
        <span className="text-lg">🔥</span>
        {dailyStreak.currentStreak > 0 ? (
          <>
            <span className={`font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-orange-400' : 'text-orange-600'
            }`}>
              {dailyStreak.currentStreak} day{dailyStreak.currentStreak !== 1 ? 's' : ''} streak
            </span>
            {dailyStreak.graceDaysRemaining > 0 && (
              <span className={`text-xs transition-colors duration-300 ${
                isDarkMode ? 'text-green-400' : 'text-green-600'
              }`}>
                💚 {dailyStreak.graceDaysRemaining} grace left
              </span>
            )}
            {goal > 0 && !goalReached && remainingToGoal > 0 && (
              <span className={`text-xs transition-colors duration-300 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>
                🎯 {remainingToGoal} more to goal
              </span>
            )}
            {goalReached && (
              <span className={`text-xs transition-colors duration-300 ${
                isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
              }`}>
                🎉 Goal reached!
              </span>
            )}
          </>
        ) : (
          <span className={`text-sm transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Start your daily streak! {goal > 0 && `(Goal: ${goal} days)`}
          </span>
        )}
      </div>
    );
  };

  const renderWeeklyStreak = () => {
    if (!streakSettings.weeklyStreak?.enabled) {
      return null;
    }

    const goal = streakSettings.weeklyStreak.goal;
    const thisWeekProgress = weeklyStreak.thisWeekDays;
    const remainingToGoal = goal > 0 ? goal - thisWeekProgress : 0;
    const goalReached = goal > 0 && thisWeekProgress >= goal;

    return (
      <div className="flex items-center gap-2">
        <span className="text-lg">📅</span>
        {weeklyStreak.currentWeeklyStreak > 0 ? (
          <>
            <span className={`font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-purple-400' : 'text-purple-600'
            }`}>
              {weeklyStreak.currentWeeklyStreak} week{weeklyStreak.currentWeeklyStreak !== 1 ? 's' : ''} streak
            </span>
            <span className={`text-xs transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              ({thisWeekProgress}/{goal} days this week)
            </span>
            {goal > 0 && !goalReached && remainingToGoal > 0 && (
              <span className={`text-xs transition-colors duration-300 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>
                🎯 {remainingToGoal} more this week
              </span>
            )}
            {goalReached && (
              <span className={`text-xs transition-colors duration-300 ${
                isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
              }`}>
                🎉 Week goal reached!
              </span>
            )}
          </>
        ) : (
          <span className={`text-sm transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {thisWeekProgress > 0 ? `${thisWeekProgress}/${goal} days this week` : `Start your weekly streak! (Goal: ${goal} days/week)`}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {renderDailyStreak()}
      {renderWeeklyStreak()}
    </div>
  );
};

export default StreakDisplay; 