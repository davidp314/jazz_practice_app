import React from 'react';
import DarkModeToggle from "./DarkModeToggle";
import PracticeCalendar from "./charts/PracticeCalendar";
import TaskDistributionChart from "./charts/TaskDistributionChart";
import ProgressBarChart from "./charts/ProgressBarChart";
import WeeklyTrendChart from "./charts/WeeklyTrendChart";
import { 
  generatePracticeCalendarData, 
  generateTaskDistributionData, 
  generateStandardsProgressData, 
  generateWeeklyTrendData,
  generateConsistencyData,
  generateStreakData
} from "../utils/chartData";

const ReportsView = ({ practiceHistory, onBack, getWeeklyStats, isDarkMode, toggleDarkMode, standards, otherWork }) => {
  const weeklyStats = getWeeklyStats();
  
  const last30Days = practiceHistory.filter(session => {
    const sessionDate = new Date(session.date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return sessionDate >= thirtyDaysAgo;
  });

  const monthlyTotal = last30Days.reduce((sum, session) => sum + session.totalTime, 0);

  // Generate chart data
  const calendarData = generatePracticeCalendarData(practiceHistory, 30);
  const taskDistributionData = generateTaskDistributionData(practiceHistory, standards || [], otherWork || []);
  const standardsProgressData = generateStandardsProgressData(standards || []);
  const weeklyTrendData = generateWeeklyTrendData(practiceHistory, 8);
  const consistencyData = generateConsistencyData(practiceHistory, 30);
  const streakData = generateStreakData(practiceHistory);

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
          }`}>Practice Reports</h1>
          <div className="flex gap-3 items-center">
            <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} square />
            <button
              onClick={onBack}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-500 text-white hover:bg-gray-600'
              }`}
            >
              Back
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Weekly Stats */}
          <div className={`p-6 rounded-lg border transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>This Week</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={`transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>Sessions:</span>
                <span className={`font-semibold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>{weeklyStats.sessions}</span>
              </div>
              <div className="flex justify-between">
                <span className={`transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>Total Time:</span>
                <span className={`font-semibold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>{weeklyStats.totalTime} min</span>
              </div>
              <div className="flex justify-between">
                <span className={`transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>Average:</span>
                <span className={`font-semibold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>{weeklyStats.averageTime} min</span>
              </div>
            </div>
          </div>

          {/* Monthly Stats */}
          <div className={`p-6 rounded-lg border transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>Last 30 Days</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={`transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>Sessions:</span>
                <span className={`font-semibold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>{last30Days.length}</span>
              </div>
              <div className="flex justify-between">
                <span className={`transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>Total Time:</span>
                <span className={`font-semibold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>{monthlyTotal} min</span>
              </div>
              <div className="flex justify-between">
                <span className={`transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>Average:</span>
                <span className={`font-semibold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>{last30Days.length > 0 ? Math.round(monthlyTotal / last30Days.length) : 0} min</span>
              </div>
            </div>
          </div>

          {/* All Time Stats */}
          <div className={`p-6 rounded-lg border transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>All Time</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={`transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>Sessions:</span>
                <span className={`font-semibold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>{practiceHistory.length}</span>
              </div>
              <div className="flex justify-between">
                <span className={`transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>Total Time:</span>
                <span className={`font-semibold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>{practiceHistory.reduce((sum, session) => sum + session.totalTime, 0)} min</span>
              </div>
              <div className="flex justify-between">
                <span className={`transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>Average:</span>
                <span className={`font-semibold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>{practiceHistory.length > 0 ? Math.round(practiceHistory.reduce((sum, session) => sum + session.totalTime, 0) / practiceHistory.length) : 0} min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visualizations */}
        <div className="mt-8">
          <h3 className={`text-xl font-semibold mb-6 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>Practice Analytics</h3>
          
          {/* First row of charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <PracticeCalendar data={calendarData} isDarkMode={isDarkMode} />
            <TaskDistributionChart data={taskDistributionData} isDarkMode={isDarkMode} />
          </div>
          
          {/* Second row of charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <WeeklyTrendChart data={weeklyTrendData} isDarkMode={isDarkMode} />
            <ProgressBarChart data={standardsProgressData} isDarkMode={isDarkMode} />
          </div>
          
          {/* Consistency and Streak Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className={`p-6 rounded-lg border transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
            }`}>
              <h4 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>Practice Consistency</h4>
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-green-400' : 'text-green-600'
                }`}>
                  {consistencyData.consistencyRate}%
                </div>
                <div className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {consistencyData.practiceDays} of {consistencyData.totalDays} days
                </div>
              </div>
            </div>
            
            <div className={`p-6 rounded-lg border transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
            }`}>
              <h4 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>Current Streak</h4>
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  {streakData.currentStreak}
                </div>
                <div className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  days
                </div>
              </div>
            </div>
            
            <div className={`p-6 rounded-lg border transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
            }`}>
              <h4 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>Longest Streak</h4>
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-purple-400' : 'text-purple-600'
                }`}>
                  {streakData.longestStreak}
                </div>
                <div className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  days
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="mt-8">
          <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>Recent Sessions</h3>
          <div className="space-y-3">
            {practiceHistory.slice(0, 10).map((session, index) => (
              <div key={index} className={`p-4 rounded-lg border transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
              }`}>
                <div className="flex justify-between items-center">
                  <div>
                    <div className={`font-medium transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      {new Date(session.date).toLocaleDateString()}
                    </div>
                    <div className={`text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {session.tasks.length} tasks • {session.totalTime} minutes
                    </div>
                  </div>
                  <div className={`text-sm transition-colors duration-300 ${
                    session.completed 
                      ? (isDarkMode ? 'text-green-400' : 'text-green-600')
                      : (isDarkMode ? 'text-yellow-400' : 'text-yellow-600')
                  }`}>
                    {session.completed ? 'Completed' : 'In Progress'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView; 