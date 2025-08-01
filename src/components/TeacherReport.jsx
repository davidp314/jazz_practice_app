import React, { useState } from 'react';
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
import { simplePDFExport, generateFilename } from "../utils/pdfExport";

const TeacherReport = ({ 
  practiceHistory, 
  standards, 
  otherWork, 
  onBack, 
  isDarkMode, 
  toggleDarkMode,
  studentName = "Student",
  teacherName = "Teacher",
  reportPeriod = "Last 30 Days"
}) => {
  const [selectedTab, setSelectedTab] = useState('overview');
  
  // Generate chart data
  const calendarData = generatePracticeCalendarData(practiceHistory, 30);
  const taskDistributionData = generateTaskDistributionData(practiceHistory, standards || [], otherWork || []);
  const standardsProgressData = generateStandardsProgressData(standards || []);
  const weeklyTrendData = generateWeeklyTrendData(practiceHistory, 8);
  const consistencyData = generateConsistencyData(practiceHistory, 30);
  const streakData = generateStreakData(practiceHistory);

  // Calculate key metrics
  const totalSessions = practiceHistory.length;
  const totalTime = practiceHistory.reduce((sum, session) => sum + session.totalTime, 0);
  const averageSessionLength = totalSessions > 0 ? Math.round(totalTime / totalSessions) : 0;
  const activeStandards = standards?.filter(s => s.active && !s.completed).length || 0;
  const completedStandards = standards?.filter(s => s.completed).length || 0;

  // Generate recommendations
  const generateRecommendations = () => {
    const recommendations = [];
    
    // Consistency recommendations
    if (consistencyData.consistencyRate < 60) {
      recommendations.push({
        priority: 'high',
        category: 'Consistency',
        title: 'Improve Practice Consistency',
        description: `Student practices ${consistencyData.consistencyRate}% of days. Recommend setting daily practice goals and establishing a routine.`
      });
    }
    
    // Standards progress recommendations
    const stalledStandards = standardsProgressData.filter(s => 
      s.status === 'active' && s.progressPercentage < 50
    );
    if (stalledStandards.length > 0) {
      recommendations.push({
        priority: 'high',
        category: 'Standards',
        title: 'Address Stalled Standards',
        description: `${stalledStandards.length} standards showing minimal progress. Consider revisiting fundamentals or breaking down complex sections.`
      });
    }
    
    // Practice balance recommendations
    const jazzStandardsPercentage = taskDistributionData.find(d => d.type === 'Jazz Standards')?.percentage || 0;
    const repertoirePercentage = taskDistributionData.find(d => d.type === 'Repertoire Review')?.percentage || 0;
    
    if (jazzStandardsPercentage > 70) {
      recommendations.push({
        priority: 'medium',
        category: 'Balance',
        title: 'Increase Repertoire Review',
        description: 'Student focuses heavily on new standards. Recommend 20% time on repertoire maintenance.'
      });
    }
    
    if (repertoirePercentage < 10) {
      recommendations.push({
        priority: 'medium',
        category: 'Balance',
        title: 'Maintain Completed Standards',
        description: 'Low time spent on repertoire review. Completed standards need regular practice to stay performance-ready.'
      });
    }
    
    // Technical work recommendations
    const technicalPercentage = taskDistributionData.find(d => d.type === 'Technical Work')?.percentage || 0;
    if (technicalPercentage < 15) {
      recommendations.push({
        priority: 'medium',
        category: 'Technique',
        title: 'Increase Technical Work',
        description: 'Technical exercises are essential for skill development. Recommend 15-20% of practice time.'
      });
    }
    
    // Positive reinforcement
    if (streakData.currentStreak >= 7) {
      recommendations.push({
        priority: 'low',
        category: 'Motivation',
        title: 'Excellent Consistency',
        description: `Great work! ${streakData.currentStreak}-day practice streak. Continue this momentum.`
      });
    }
    
    return recommendations;
  };

  const recommendations = generateRecommendations();

  // PDF Export functionality
  const handlePDFExport = () => {
    const filename = generateFilename(studentName, reportPeriod);
    simplePDFExport('teacher-report-container');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return isDarkMode ? 'text-red-400' : 'text-red-600';
      case 'medium':
        return isDarkMode ? 'text-yellow-400' : 'text-yellow-600';
      case 'low':
        return isDarkMode ? 'text-green-400' : 'text-green-600';
      default:
        return isDarkMode ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getPriorityBg = (priority) => {
    switch (priority) {
      case 'high':
        return isDarkMode ? 'bg-red-900/20' : 'bg-red-50';
      case 'medium':
        return isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50';
      case 'low':
        return isDarkMode ? 'bg-green-900/20' : 'bg-green-50';
      default:
        return isDarkMode ? 'bg-gray-900/20' : 'bg-gray-50';
    }
  };

  return (
    <div id="teacher-report-container" className={`max-w-7xl mx-auto p-6 min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-white'
    }`}>
      <div className={`rounded-lg shadow-lg p-6 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        {/* Header */}
        <div className="report-header flex justify-between items-center mb-6">
          <div>
            <h1 className={`text-3xl font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>🎸 Teacher Report</h1>
            <div className={`report-meta text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {studentName} • {teacherName} • {reportPeriod}
            </div>
          </div>
          <div className="flex gap-3 items-center no-print">
            <button
              onClick={handlePDFExport}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 ${
                isDarkMode 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              title="Export to PDF"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export PDF
            </button>
            <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} square />
            <button
              onClick={onBack}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-gray-500 text-white hover:bg-gray-600'
              }`}
            >
              Back
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={`tab-navigation flex space-x-1 mb-6 p-1 rounded-lg transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'standards', label: 'Standards Progress' },
            { id: 'practice', label: 'Practice Analysis' },
            { id: 'recommendations', label: 'Recommendations' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                selectedTab === tab.id
                  ? (isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-800 shadow-sm')
                  : (isDarkMode ? 'text-white hover:text-gray-200' : 'text-gray-600 hover:text-gray-800')
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        <div className={`tab-content${selectedTab !== 'overview' ? ' hidden' : ''} space-y-6`}>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className={`metric-card p-6 rounded-lg border transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>Practice Sessions</h3>
              <div className="text-center">
                <div className={`metric-value text-3xl font-bold mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  {totalSessions}
                </div>
                <div className={`metric-label text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Total Sessions
                </div>
              </div>
            </div>

            <div className={`metric-card p-6 rounded-lg border transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>Total Time</h3>
              <div className="text-center">
                <div className={`metric-value text-3xl font-bold mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-green-400' : 'text-green-600'
                }`}>
                  {Math.round(totalTime / 60 * 10) / 10}
                </div>
                <div className={`metric-label text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Hours
                </div>
              </div>
            </div>

            <div className={`metric-card p-6 rounded-lg border transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>Consistency</h3>
              <div className="text-center">
                <div className={`metric-value text-3xl font-bold mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-purple-400' : 'text-purple-600'
                }`}>
                  {consistencyData.consistencyRate}%
                </div>
                <div className={`metric-label text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Practice Rate
                </div>
              </div>
            </div>

            <div className={`metric-card p-6 rounded-lg border transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>Current Streak</h3>
              <div className="text-center">
                <div className={`metric-value text-3xl font-bold mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-orange-400' : 'text-orange-600'
                }`}>
                  {streakData.currentStreak}
                </div>
                <div className={`metric-label text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Days
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="chart-container">
              <PracticeCalendar data={calendarData} isDarkMode={isDarkMode} />
            </div>
            <div className="chart-container">
              <TaskDistributionChart data={taskDistributionData} isDarkMode={isDarkMode} />
            </div>
          </div>

          {/* Weekly Trends */}
          <div className="chart-container">
            <WeeklyTrendChart data={weeklyTrendData} isDarkMode={isDarkMode} />
          </div>
        </div>

        {/* Standards Progress Tab */}
        <div className={`tab-content${selectedTab !== 'standards' ? ' hidden' : ''} space-y-6`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className={`metric-card p-6 rounded-lg border transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h4 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>Active Standards</h4>
              <div className="text-center">
                <div className={`metric-value text-3xl font-bold mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  {activeStandards}
                </div>
                <div className={`metric-label text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  In Progress
                </div>
              </div>
            </div>

            <div className={`metric-card p-6 rounded-lg border transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h4 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>Completed Standards</h4>
              <div className="text-center">
                <div className={`metric-value text-3xl font-bold mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-green-400' : 'text-green-600'
                }`}>
                  {completedStandards}
                </div>
                <div className={`metric-label text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Performance Ready
                </div>
              </div>
            </div>

            <div className={`metric-card p-6 rounded-lg border transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h4 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>Average Progress</h4>
              <div className="text-center">
                <div className={`metric-value text-3xl font-bold mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-purple-400' : 'text-purple-600'
                }`}>
                  {standardsProgressData.length > 0 
                    ? Math.round(standardsProgressData.reduce((sum, s) => sum + s.progressPercentage, 0) / standardsProgressData.length)
                    : 0}%
                </div>
                <div className={`metric-label text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Across Standards
                </div>
              </div>
            </div>
          </div>

          <div className="chart-container">
            <ProgressBarChart data={standardsProgressData} isDarkMode={isDarkMode} />
          </div>
        </div>

        {/* Practice Analysis Tab */}
        <div className={`tab-content${selectedTab !== 'practice' ? ' hidden' : ''} space-y-6`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`p-6 rounded-lg border transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>Practice Patterns</h3>
              <div className="space-y-4">
                <div className={`pattern-item flex justify-between items-center`}>
                  <span className={`pattern-label transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Average Session Length:</span>
                  <span className={`pattern-value font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>{averageSessionLength} minutes</span>
                </div>
                <div className={`pattern-item flex justify-between items-center`}>
                  <span className={`pattern-label transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Best Practice Days:</span>
                  <span className={`pattern-value font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>Tuesday-Thursday</span>
                </div>
                <div className={`pattern-item flex justify-between items-center`}>
                  <span className={`pattern-label transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Longest Streak:</span>
                  <span className={`pattern-value font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>{streakData.longestStreak} days</span>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-lg border transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>Practice Quality</h3>
              <div className="space-y-4">
                <div className={`pattern-item flex justify-between items-center`}>
                  <span className={`pattern-label transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Session Completion:</span>
                  <span className={`pattern-value font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-green-400' : 'text-green-600'
                  }`}>100%</span>
                </div>
                <div className={`pattern-item flex justify-between items-center`}>
                  <span className={`pattern-label transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Task Variety:</span>
                  <span className={`pattern-value font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}>Good</span>
                </div>
                <div className={`pattern-item flex justify-between items-center`}>
                  <span className={`pattern-label transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Consistency:</span>
                  <span className={`pattern-value font-semibold transition-colors duration-300 ${
                    consistencyData.consistencyRate >= 70 ? (isDarkMode ? 'text-green-400' : 'text-green-600')
                    : consistencyData.consistencyRate >= 50 ? (isDarkMode ? 'text-yellow-400' : 'text-yellow-600')
                    : (isDarkMode ? 'text-red-400' : 'text-red-600')
                  }`}>
                    {consistencyData.consistencyRate >= 70 ? 'Excellent' 
                     : consistencyData.consistencyRate >= 50 ? 'Good' 
                     : 'Needs Improvement'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="chart-container">
            <WeeklyTrendChart data={weeklyTrendData} isDarkMode={isDarkMode} />
          </div>
        </div>

        {/* Recommendations Tab */}
        <div className={`tab-content${selectedTab !== 'recommendations' ? ' hidden' : ''} space-y-6`}>
          <div className={`p-6 rounded-lg border transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>Lesson Recommendations</h3>
            
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className={`recommendation-card p-4 rounded-lg border-l-4 transition-colors duration-300 ${
                  getPriorityBg(rec.priority)
                } ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`recommendation-priority text-sm font-semibold uppercase ${getPriorityColor(rec.priority)}`}>
                          {rec.priority} Priority
                        </span>
                        <span className={`recommendation-category text-xs px-2 py-1 rounded-full transition-colors duration-300 ${
                          isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {rec.category}
                        </span>
                      </div>
                      <h4 className={`recommendation-title font-semibold mb-1 transition-colors duration-300 ${
                        isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}>
                        {rec.title}
                      </h4>
                      <p className={`recommendation-description text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {rec.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {recommendations.length === 0 && (
              <div className={`text-center py-8 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                No specific recommendations at this time. Student is making good progress!
              </div>
            )}
          </div>

          {/* Next Lesson Focus */}
          <div className={`p-6 rounded-lg border transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>Suggested Next Lesson Focus</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className={`font-semibold mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>Review</h4>
                <ul className={`space-y-1 text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {standardsProgressData.filter(s => s.status === 'active' && s.progressPercentage > 50).slice(0, 2).map(standard => (
                    <li key={standard.name}>• {standard.name} (Step {standard.completedSteps + 1})</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className={`font-semibold mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>Introduce</h4>
                <ul className={`space-y-1 text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {standardsProgressData.filter(s => s.status === 'active' && s.progressPercentage > 80).slice(0, 2).map(standard => (
                    <li key={standard.name}>• Next step for {standard.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer for print */}
        <div className="report-footer mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-500 no-print">
          <p>Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
          <p>Jazz Guitar Practice Tracker - Teacher Report</p>
        </div>
      </div>
    </div>
  );
};

export default TeacherReport; 