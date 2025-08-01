# Streak Counter Feature

## Overview

The Streak Counter feature helps you track your practice consistency by counting consecutive days and weeks of practice. It provides motivation through goal setting and celebration of achievements.

## Features

### Daily Streaks
- **Consecutive Day Counting**: Tracks the number of days in a row you've practiced
- **Grace Days**: Allows you to miss up to a configurable number of days without breaking your streak
- **Goal Setting**: Set a target number of days to reach for celebration
- **Longest Streak Tracking**: Records your all-time best streak

### Weekly Streaks
- **Days per Week Goal**: Set a target for how many days you want to practice each week
- **Weekly Streak Counting**: Tracks consecutive weeks where you meet your goal
- **Grace Weeks**: Allows you to miss up to a configurable number of weeks without breaking your streak

### Celebrations
- **Goal Achievement**: Shows a celebration modal when you reach your daily or weekly goals
- **Visual Feedback**: Confetti animation and motivational messages
- **Progress Indicators**: Shows how close you are to your goals

## How to Use

### Enabling Streaks
1. Click the Settings button (gear icon) in the top-right corner
2. Toggle "Streak Counter" to enable the feature
3. Configure your daily and/or weekly streak settings

### Daily Streak Settings
- **Enable Daily Streak**: Turn on daily streak tracking
- **Goal (days)**: Set your target streak length (e.g., 7 days)
- **Grace Days**: Number of days you can miss without breaking your streak (0-7)

### Weekly Streak Settings
- **Enable Weekly Streak**: Turn on weekly streak tracking
- **Days per Week Goal**: Target number of practice days per week (1-7)
- **Grace Weeks**: Number of weeks you can miss your goal without breaking your streak (0-4)

### Viewing Your Streaks
- Streak information appears in the "Practice Activity" card on the dashboard
- Shows current streak, grace days remaining, and progress toward goals
- Only displays when streaks are enabled and you have active streaks

## How It Works

### Daily Streak Calculation
- Counts consecutive calendar days with completed practice sessions
- Uses local timezone for date calculations
- Grace days can be used to maintain streaks when you miss a day
- Streak breaks when you miss a day and have no grace days remaining

### Weekly Streak Calculation
- Groups practice sessions by week (Monday to Sunday)
- Counts days practiced in each week
- Weekly streak continues if you meet your goal or use a grace week
- Streak breaks when you miss your goal and have no grace weeks remaining

### Goal Achievement
- Daily goals trigger when you reach your target streak length
- Weekly goals trigger when you practice enough days in a week
- Celebrations only show once per achievement (won't repeat for the same goal)

## Data Persistence
- Streak settings are saved in localStorage
- Streak data is calculated from your practice history
- Settings are included in data exports/imports for backup

## Tips for Success
- Start with realistic goals (e.g., 3-5 days per week)
- Use grace days sparingly to maintain motivation
- Celebrate small wins to build momentum
- Review your streaks regularly to stay motivated

## Technical Notes
- Streaks are calculated in real-time from your practice session data
- Grace days/weeks are consumed automatically when needed
- The system handles timezone changes and date boundaries correctly
- All streak data is calculated locally for privacy 