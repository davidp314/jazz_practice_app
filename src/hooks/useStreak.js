import { useState, useEffect, useMemo, useRef } from 'react';
import { calculateStreaks, getDefaultStreakSettings } from '../utils/streak';

export const useStreak = (practiceHistory) => {
  // Initialize streak settings from localStorage or defaults
  const [streakSettings, setStreakSettings] = useState(() => {
    const savedSettings = localStorage.getItem('streakSettings');
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch (error) {
        console.error('Error parsing streak settings:', error);
        return getDefaultStreakSettings();
      }
    }
    return getDefaultStreakSettings();
  });

  // Celebration state
  const [showCelebration, setShowCelebration] = useState(false);
  const [achievement, setAchievement] = useState(null);
  const previousStreakData = useRef(null);

  // Calculate streaks whenever practice history or settings change
  const streakData = useMemo(() => {
    const newStreakData = calculateStreaks(practiceHistory, streakSettings);
    
    // Check for achievements
    if (previousStreakData.current && streakSettings.enabled) {
      const prev = previousStreakData.current;
      
      // Daily goal achievement
      if (streakSettings.dailyStreak?.enabled && 
          streakSettings.dailyStreak?.goal > 0 &&
          !prev.dailyStreak.goalReached && 
          newStreakData.dailyStreak.goalReached) {
        setAchievement({
          type: 'daily_goal',
          goal: streakSettings.dailyStreak.goal
        });
        setShowCelebration(true);
      }
      
      // Weekly goal achievement
      if (streakSettings.weeklyStreak?.enabled && 
          streakSettings.weeklyStreak?.goal > 0 &&
          !prev.weeklyStreak.goalReached && 
          newStreakData.weeklyStreak.goalReached) {
        setAchievement({
          type: 'weekly_goal',
          days: newStreakData.weeklyStreak.thisWeekDays
        });
        setShowCelebration(true);
      }
    }
    
    previousStreakData.current = newStreakData;
    return newStreakData;
  }, [practiceHistory, streakSettings]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('streakSettings', JSON.stringify(streakSettings));
  }, [streakSettings]);

  // Update streak settings
  const updateStreakSettings = (newSettings) => {
    setStreakSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  // Toggle streak feature on/off
  const toggleStreakEnabled = () => {
    setStreakSettings(prev => ({
      ...prev,
      enabled: !prev.enabled
    }));
  };

  // Update daily streak settings
  const updateDailyStreakSettings = (settings) => {
    setStreakSettings(prev => ({
      ...prev,
      dailyStreak: {
        ...prev.dailyStreak,
        ...settings
      }
    }));
  };

  // Update weekly streak settings
  const updateWeeklyStreakSettings = (settings) => {
    setStreakSettings(prev => ({
      ...prev,
      weeklyStreak: {
        ...prev.weeklyStreak,
        ...settings
      }
    }));
  };

  // Reset streak settings to defaults
  const resetStreakSettings = () => {
    setStreakSettings(getDefaultStreakSettings());
  };

  // Close celebration modal
  const closeCelebration = () => {
    setShowCelebration(false);
    setAchievement(null);
  };

  return {
    streakSettings,
    streakData,
    showCelebration,
    achievement,
    updateStreakSettings,
    toggleStreakEnabled,
    updateDailyStreakSettings,
    updateWeeklyStreakSettings,
    resetStreakSettings,
    closeCelebration
  };
}; 