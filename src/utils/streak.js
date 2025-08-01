// Streak calculation utilities

/**
 * Calculate daily streak from practice history
 * @param {Array} practiceHistory - Array of completed practice sessions
 * @param {Object} streakSettings - Streak configuration settings
 * @returns {Object} Streak information
 */
export const calculateDailyStreak = (practiceHistory, streakSettings = {}) => {
  if (!practiceHistory || practiceHistory.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      graceDaysUsed: 0,
      graceDaysRemaining: streakSettings.dailyStreak?.graceDays || 0,
      goalProgress: 0,
      goalReached: false
    };
  }

  // Get completed sessions sorted by date (newest first)
  const completedSessions = practiceHistory
    .filter(session => session.completed && session.endTime)
    .map(session => ({
      ...session,
      date: new Date(session.endTime).toDateString()
    }))
    .sort((a, b) => new Date(b.endTime) - new Date(a.endTime));

  if (completedSessions.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      graceDaysUsed: 0,
      graceDaysRemaining: streakSettings.dailyStreak?.graceDays || 0,
      goalProgress: 0,
      goalReached: false
    };
  }

  // Get unique practice dates (calendar days)
  const practiceDates = [...new Set(completedSessions.map(session => session.date))];
  practiceDates.sort((a, b) => new Date(b) - new Date(a));

  // Calculate current streak
  let currentStreak = 0;
  let graceDaysUsed = 0;
  let graceDaysRemaining = streakSettings.dailyStreak?.graceDays || 0;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

  // Check if practiced today
  const practicedToday = practiceDates.includes(today);
  const practicedYesterday = practiceDates.includes(yesterday);

  if (practicedToday) {
    // Start counting from today
    currentStreak = 1;
    let checkDate = new Date(today);
    
    for (let i = 1; i < 365; i++) { // Cap at 1 year to prevent infinite loops
      checkDate.setDate(checkDate.getDate() - 1);
      const checkDateString = checkDate.toDateString();
      
      if (practiceDates.includes(checkDateString)) {
        currentStreak++;
      } else {
        // Check if we can use a grace day
        if (graceDaysRemaining > 0) {
          graceDaysUsed++;
          graceDaysRemaining--;
          currentStreak++;
        } else {
          break;
        }
      }
    }
  } else if (practicedYesterday && graceDaysRemaining > 0) {
    // Use a grace day for yesterday
    graceDaysUsed = 1;
    graceDaysRemaining--;
    currentStreak = 1;
    
    // Continue counting backwards
    let checkDate = new Date(yesterday);
    for (let i = 1; i < 365; i++) {
      checkDate.setDate(checkDate.getDate() - 1);
      const checkDateString = checkDate.toDateString();
      
      if (practiceDates.includes(checkDateString)) {
        currentStreak++;
      } else {
        if (graceDaysRemaining > 0) {
          graceDaysUsed++;
          graceDaysRemaining--;
          currentStreak++;
        } else {
          break;
        }
      }
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 0;
  let tempGraceDaysUsed = 0;
  let tempGraceDaysRemaining = streakSettings.dailyStreak?.graceDays || 0;

  for (let i = 0; i < practiceDates.length; i++) {
    const currentDate = new Date(practiceDates[i]);
    
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prevDate = new Date(practiceDates[i - 1]);
      const daysDiff = Math.floor((prevDate - currentDate) / (24 * 60 * 60 * 1000));
      
      if (daysDiff === 1) {
        // Consecutive day
        tempStreak++;
      } else if (daysDiff === 2 && tempGraceDaysRemaining > 0) {
        // Use grace day
        tempGraceDaysUsed++;
        tempGraceDaysRemaining--;
        tempStreak++;
      } else {
        // Break in streak
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
        tempGraceDaysUsed = 0;
        tempGraceDaysRemaining = streakSettings.dailyStreak?.graceDays || 0;
      }
    }
  }
  
  longestStreak = Math.max(longestStreak, tempStreak);

  // Calculate goal progress
  const goal = streakSettings.dailyStreak?.goal || 0;
  const goalProgress = goal > 0 ? Math.min(currentStreak, goal) : 0;
  const goalReached = goal > 0 && currentStreak >= goal;

  return {
    currentStreak,
    longestStreak,
    graceDaysUsed,
    graceDaysRemaining,
    goalProgress,
    goalReached,
    practicedToday,
    practicedYesterday
  };
};

/**
 * Calculate weekly streak from practice history
 * @param {Array} practiceHistory - Array of completed practice sessions
 * @param {Object} streakSettings - Streak configuration settings
 * @returns {Object} Weekly streak information
 */
export const calculateWeeklyStreak = (practiceHistory, streakSettings = {}) => {
  if (!practiceHistory || practiceHistory.length === 0) {
    return {
      currentWeeklyStreak: 0,
      longestWeeklyStreak: 0,
      thisWeekDays: 0,
      goalProgress: 0,
      goalReached: false
    };
  }

  // Get completed sessions
  const completedSessions = practiceHistory
    .filter(session => session.completed && session.endTime)
    .map(session => ({
      ...session,
      date: new Date(session.endTime)
    }));

  if (completedSessions.length === 0) {
    return {
      currentWeeklyStreak: 0,
      longestWeeklyStreak: 0,
      thisWeekDays: 0,
      goalProgress: 0,
      goalReached: false
    };
  }

  // Group sessions by week
  const weeklySessions = {};
  completedSessions.forEach(session => {
    const weekStart = getWeekStart(session.date);
    const weekKey = weekStart.toISOString().split('T')[0];
    
    if (!weeklySessions[weekKey]) {
      weeklySessions[weekKey] = new Set();
    }
    weeklySessions[weekKey].add(session.date.toDateString());
  });

  // Calculate current weekly streak
  let currentWeeklyStreak = 0;
  let graceWeeksUsed = 0;
  let graceWeeksRemaining = streakSettings.weeklyStreak?.graceWeeks || 0;
  const goal = streakSettings.weeklyStreak?.goal || 0;
  
  const weekKeys = Object.keys(weeklySessions).sort().reverse();
  const today = new Date();
  const thisWeekStart = getWeekStart(today);
  const thisWeekKey = thisWeekStart.toISOString().split('T')[0];
  
  // Count days practiced this week
  const thisWeekDays = weeklySessions[thisWeekKey] ? weeklySessions[thisWeekKey].size : 0;
  
  // Check if this week meets the goal
  let meetsGoal = thisWeekDays >= goal;
  if (!meetsGoal && graceWeeksRemaining > 0) {
    graceWeeksUsed = 1;
    graceWeeksRemaining--;
    meetsGoal = true;
  }

  if (meetsGoal) {
    currentWeeklyStreak = 1;
    
    // Count backwards through weeks
    for (let i = 1; i < weekKeys.length; i++) {
      const weekKey = weekKeys[i];
      const weekDays = weeklySessions[weekKey] ? weeklySessions[weekKey].size : 0;
      
      if (weekDays >= goal) {
        currentWeeklyStreak++;
      } else if (graceWeeksRemaining > 0) {
        graceWeeksUsed++;
        graceWeeksRemaining--;
        currentWeeklyStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate longest weekly streak
  let longestWeeklyStreak = 0;
  let tempStreak = 0;
  let tempGraceWeeksRemaining = streakSettings.weeklyStreak?.graceWeeks || 0;

  for (const weekKey of weekKeys) {
    const weekDays = weeklySessions[weekKey] ? weeklySessions[weekKey].size : 0;
    
    if (weekDays >= goal) {
      tempStreak++;
    } else if (tempGraceWeeksRemaining > 0) {
      tempGraceWeeksRemaining--;
      tempStreak++;
    } else {
      longestWeeklyStreak = Math.max(longestWeeklyStreak, tempStreak);
      tempStreak = 0;
      tempGraceWeeksRemaining = streakSettings.weeklyStreak?.graceWeeks || 0;
    }
  }
  
  longestWeeklyStreak = Math.max(longestWeeklyStreak, tempStreak);

  const goalProgress = goal > 0 ? Math.min(thisWeekDays, goal) : 0;
  const goalReached = goal > 0 && thisWeekDays >= goal;

  return {
    currentWeeklyStreak,
    longestWeeklyStreak,
    thisWeekDays,
    goalProgress,
    goalReached,
    graceWeeksUsed,
    graceWeeksRemaining
  };
};

/**
 * Get the start of the week (Monday) for a given date
 * @param {Date} date - The date to get week start for
 * @returns {Date} Start of the week (Monday)
 */
const getWeekStart = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
};

/**
 * Get default streak settings
 * @returns {Object} Default streak configuration
 */
export const getDefaultStreakSettings = () => ({
  enabled: false,
  dailyStreak: {
    enabled: false,
    goal: 7,
    graceDays: 2,
    graceDaysUsed: 0
  },
  weeklyStreak: {
    enabled: false,
    goal: 5,
    graceWeeks: 1,
    graceWeeksUsed: 0
  }
});

/**
 * Calculate comprehensive streak information
 * @param {Array} practiceHistory - Array of completed practice sessions
 * @param {Object} streakSettings - Streak configuration settings
 * @returns {Object} Complete streak information
 */
export const calculateStreaks = (practiceHistory, streakSettings) => {
  const dailyStreak = calculateDailyStreak(practiceHistory, streakSettings);
  const weeklyStreak = calculateWeeklyStreak(practiceHistory, streakSettings);
  
  return {
    dailyStreak,
    weeklyStreak,
    hasActiveStreaks: streakSettings.enabled && (
      (streakSettings.dailyStreak?.enabled && dailyStreak.currentStreak > 0) ||
      (streakSettings.weeklyStreak?.enabled && weeklyStreak.currentWeeklyStreak > 0)
    )
  };
}; 