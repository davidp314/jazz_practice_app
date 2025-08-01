# Chart Components

This directory contains reusable chart components for visualizing practice data in the Jazz Guitar Practice Tracker.

## Components

### PracticeCalendar.jsx
A GitHub-style contribution calendar showing practice intensity over the last 30 days.

**Features:**
- Color-coded intensity levels (0-5)
- Hover tooltips with detailed information
- Responsive design with dark mode support
- Shows practice sessions and total time per day

**Props:**
- `data`: Array of daily practice data objects
- `isDarkMode`: Boolean for theme switching

### TaskDistributionChart.jsx
A pie chart showing the distribution of practice time across different task types.

**Features:**
- Interactive pie chart with hover effects
- Color-coded segments
- Percentage breakdown in legend
- Responsive design

**Props:**
- `data`: Array of task distribution objects with type, time, and percentage
- `isDarkMode`: Boolean for theme switching

### ProgressBarChart.jsx
A horizontal bar chart showing progress through jazz standards.

**Features:**
- Progress bars with percentage completion
- Status badges (Active, Completed, Inactive)
- Last worked on timestamps
- Color-coded by status

**Props:**
- `data`: Array of standard progress objects
- `isDarkMode`: Boolean for theme switching

### WeeklyTrendChart.jsx
A line chart showing weekly practice trends over time.

**Features:**
- Interactive line chart with data points
- Grid lines and axis labels
- Summary statistics below chart
- Responsive design

**Props:**
- `data`: Array of weekly trend data objects
- `isDarkMode`: Boolean for theme switching

## Data Utilities

The `src/utils/chartData.js` file contains utility functions for generating chart data:

- `generatePracticeCalendarData()`: Creates calendar data from practice history
- `generateTaskDistributionData()`: Analyzes practice time distribution
- `generateStandardsProgressData()`: Calculates progress through standards
- `generateWeeklyTrendData()`: Creates weekly trend data
- `generateConsistencyData()`: Calculates practice consistency metrics
- `generateStreakData()`: Computes streak statistics

## Usage

All chart components are designed to work together in the ReportsView component. They automatically adapt to dark/light mode and are fully responsive.

## Styling

Charts use Tailwind CSS classes and support both light and dark themes. Colors are carefully chosen for accessibility and visual appeal in both modes. 