// Chart data utilities for generating visualizations

export const generatePracticeCalendarData = (practiceHistory, days = 30) => {
  const calendarData = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const sessionsOnDate = practiceHistory.filter(session => {
      const sessionDate = new Date(session.date).toISOString().split('T')[0];
      return sessionDate === dateStr;
    });
    
    const totalTime = sessionsOnDate.reduce((sum, session) => sum + session.totalTime, 0);
    
    calendarData.push({
      date: dateStr,
      dayOfWeek: date.getDay(),
      sessions: sessionsOnDate.length,
      totalTime,
      intensity: getIntensityLevel(totalTime)
    });
  }
  
  return calendarData;
};

export const getIntensityLevel = (minutes) => {
  if (minutes === 0) return 0;
  if (minutes < 30) return 1;
  if (minutes < 60) return 2;
  if (minutes < 90) return 3;
  if (minutes < 120) return 4;
  return 5;
};

export const generateWeeklyTrendData = (practiceHistory, weeks = 8) => {
  const trendData = [];
  const today = new Date();
  
  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - (today.getDay() + 7 * i));
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    
    const weekSessions = practiceHistory.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= weekStart && sessionDate <= weekEnd;
    });
    
    const totalTime = weekSessions.reduce((sum, session) => sum + session.totalTime, 0);
    const averageTime = weekSessions.length > 0 ? Math.round(totalTime / weekSessions.length) : 0;
    
    trendData.push({
      week: `Week ${weeks - i}`,
      startDate: weekStart.toISOString().split('T')[0],
      sessions: weekSessions.length,
      totalTime,
      averageTime,
      consistency: weekSessions.length / 7 * 100
    });
  }
  
  return trendData;
};

export const generateTaskDistributionData = (practiceHistory, standards, otherWork) => {
  const taskTypes = {
    'Jazz Standards': 0,
    'Technical Work': 0,
    'Repertoire Review': 0,
    'Other Work': 0
  };
  
  practiceHistory.forEach(session => {
    session.tasks.forEach(task => {
      // Get time spent from taskTimeSpent object or use timeAllocated as fallback
      const timeSpent = session.taskTimeSpent && session.taskTimeSpent[task.id] 
        ? session.taskTimeSpent[task.id] / 60 // Convert seconds to minutes
        : task.timeAllocated || 0;
      
      if (task.type === 'standard') {
        // Try to find the standard by name since standardId might not be available
        const standard = standards.find(s => s.name === task.name);
        if (standard && standard.completed) {
          taskTypes['Repertoire Review'] += timeSpent;
        } else {
          taskTypes['Jazz Standards'] += timeSpent;
        }
      } else if (task.type === 'other_work' || task.type === 'other') {
        taskTypes['Other Work'] += timeSpent;
      } else if (task.type === 'one_off') {
        taskTypes['Technical Work'] += timeSpent;
      }
    });
  });
  
  // Calculate total time for percentage
  const totalTime = Object.values(taskTypes).reduce((sum, time) => sum + time, 0);
  
  return Object.entries(taskTypes).map(([type, time]) => ({
    type,
    time,
    percentage: totalTime > 0 ? Math.round((time / totalTime) * 100) : 0
  })).filter(item => item.time > 0);
};

export const generateStandardsProgressData = (standards) => {
  return standards.map(standard => {
    const completedSteps = standard.steps.filter(step => step).length;
    const totalSteps = standard.steps.length;
    const progressPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
    
    return {
      name: standard.name,
      completedSteps,
      totalSteps,
      progressPercentage,
      status: standard.completed ? 'completed' : standard.active ? 'active' : 'inactive',
      lastWorkedOn: standard.lastWorkedOn
    };
  }).sort((a, b) => b.progressPercentage - a.progressPercentage);
};

export const generateSessionLengthDistribution = (practiceHistory) => {
  const distribution = {
    '0-15 min': 0,
    '15-30 min': 0,
    '30-45 min': 0,
    '45-60 min': 0,
    '60-90 min': 0,
    '90+ min': 0
  };
  
  practiceHistory.forEach(session => {
    const time = session.totalTime;
    if (time <= 15) distribution['0-15 min']++;
    else if (time <= 30) distribution['15-30 min']++;
    else if (time <= 45) distribution['30-45 min']++;
    else if (time <= 60) distribution['45-60 min']++;
    else if (time <= 90) distribution['60-90 min']++;
    else distribution['90+ min']++;
  });
  
  return Object.entries(distribution).map(([range, count]) => ({
    range,
    count,
    percentage: practiceHistory.length > 0 ? Math.round((count / practiceHistory.length) * 100) : 0
  }));
};

export const generateConsistencyData = (practiceHistory, days = 30) => {
  const today = new Date();
  let practiceDays = 0;
  let totalDays = 0;
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const hasSession = practiceHistory.some(session => {
      const sessionDate = new Date(session.date).toISOString().split('T')[0];
      return sessionDate === dateStr;
    });
    
    if (hasSession) practiceDays++;
    totalDays++;
  }
  
  return {
    practiceDays,
    totalDays,
    consistencyRate: Math.round((practiceDays / totalDays) * 100),
    missedDays: totalDays - practiceDays
  };
};

export const generateStreakData = (practiceHistory) => {
  const today = new Date();
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  // Calculate current streak
  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const hasSession = practiceHistory.some(session => {
      const sessionDate = new Date(session.date).toISOString().split('T')[0];
      return sessionDate === dateStr;
    });
    
    if (hasSession) {
      if (i === 0 || tempStreak > 0) {
        tempStreak++;
        if (i === 0) currentStreak = tempStreak;
      }
    } else {
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
      tempStreak = 0;
    }
  }
  
  return {
    currentStreak,
    longestStreak,
    totalSessions: practiceHistory.length
  };
}; 