import { 
  generatePracticeCalendarData, 
  generateTaskDistributionData, 
  generateStandardsProgressData, 
  generateWeeklyTrendData,
  generateConsistencyData,
  generateStreakData
} from "./chartData";

export const generateAndDownloadReport = (practiceHistory, standards, otherWork) => {
  // Safely handle data with fallbacks
  const safePracticeHistory = practiceHistory || [];
  const safeStandards = standards || [];
  const safeOtherWork = otherWork || [];
  
  // Calculate summary statistics with proper fallbacks
  const last30Days = safePracticeHistory.filter(session => {
    const sessionDate = new Date(session.date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return sessionDate >= thirtyDaysAgo;
  });

  const totalMinutes = safePracticeHistory.reduce((sum, session) => sum + (session.totalTime || 0), 0);
  const monthlyMinutes = last30Days.reduce((sum, session) => sum + (session.totalTime || 0), 0);
  const avgSessionLength = safePracticeHistory.length > 0 ? Math.round(totalMinutes / safePracticeHistory.length) : 0;
  
  // Generate chart data with safe fallbacks
  const calendarData = generatePracticeCalendarData(safePracticeHistory, 30);
  const taskDistributionData = generateTaskDistributionData(safePracticeHistory, safeStandards, safeOtherWork);
  const standardsProgressData = generateStandardsProgressData(safeStandards);
  const consistencyData = generateConsistencyData(safePracticeHistory, 30);
  const streakData = generateStreakData(safePracticeHistory);

  // Calculate active standards
  const activeStandards = safeStandards.filter(standard => standard.status === 'active') || [];
  
  // Generate calendar HTML with proper structure
  const generateCalendarHTML = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    let calendarHTML = '';
    
    // Add day labels with proper styling
    calendarHTML += '<div class="flex justify-between mb-2" style="width: 168px;">';
    const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    dayLabels.forEach(day => {
      calendarHTML += `<div class="text-center text-sm font-medium text-gray-600 w-6">${day}</div>`;
    });
    calendarHTML += '</div>';
    
    // Generate calendar grid with proper structure
    calendarHTML += '<div class="grid grid-cols-7 gap-0" style="width: 168px;">';
    
    // Generate calendar days with proper heat levels
    const currentDate = new Date(thirtyDaysAgo);
    while (currentDate <= today) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayData = calendarData.find(day => day.date === dateStr);
      const heatLevel = dayData && dayData.value > 0 ? Math.min(Math.floor(dayData.value / 20), 5) : 0;
      
      calendarHTML += `
        <div class="calendar-day heat-${heatLevel}" title="${dateStr}: ${dayData && dayData.value ? dayData.value + ' min' : '0 min'}">
          ${currentDate.getDate()}
        </div>
      `;
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    calendarHTML += '</div>';
    return calendarHTML;
  };

  // Generate standards table HTML with proper styling
  const generateStandardsTableHTML = () => {
    if (!safeStandards || safeStandards.length === 0) {
      return `
        <div class="text-center py-8">
          <p class="text-gray-500 italic">No standards recorded yet</p>
          <p class="text-sm text-gray-400 mt-2">Add some standards to track your learning progress</p>
        </div>
      `;
    }
    
    let tableHTML = `
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b-2 border-gray-200">
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Standard</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Progress (5 Steps)</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Last Practiced</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
    `;
    
    safeStandards.forEach(standard => {
      const progressDots = [];
      for (let i = 0; i < 5; i++) {
        progressDots.push(
          `<span class="dot ${i < (standard.progress || 0) ? 'dot-completed' : 'dot-incomplete'}"></span>`
        );
      }
      
      const statusClass = standard.status === 'active' ? 'status-active' : 
                         standard.status === 'completed' ? 'status-completed' : 'status-inactive';
      
      const lastPracticed = standard.lastWorkedOn ? 
        new Date(standard.lastWorkedOn).toLocaleDateString() : 'Never';
      
      tableHTML += `
        <tr class="hover:bg-gray-50">
          <td class="py-3 px-4 font-medium">${standard.title || 'Untitled'}</td>
          <td class="py-3 px-4">
            <div class="progress-dots">
              ${progressDots.join('')}
              <span class="ml-2 text-sm text-gray-600">${standard.progress || 0}/5</span>
            </div>
          </td>
          <td class="py-3 px-4 text-sm text-gray-600">${lastPracticed}</td>
          <td class="py-3 px-4">
            <span class="status-badge ${statusClass}">${standard.status || 'inactive'}</span>
          </td>
        </tr>
      `;
    });
    
    tableHTML += '</tbody></table></div>';
    return tableHTML;
  };

  // Generate task distribution HTML with proper styling
  const generateTaskDistributionHTML = () => {
    if (!taskDistributionData || taskDistributionData.length === 0) {
      return `
        <div class="text-center py-8">
          <p class="text-gray-500 italic">No practice data available yet</p>
          <p class="text-sm text-gray-400 mt-2">Complete some practice sessions to see your distribution</p>
        </div>
      `;
    }
    
    let html = '<div class="space-y-4">';
    taskDistributionData.forEach(task => {
      const totalValue = taskDistributionData.reduce((sum, t) => sum + (t.value || 0), 0);
      const percentage = totalValue > 0 ? Math.round(((task.value || 0) / totalValue) * 100) : 0;
      html += `
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium">${task.name || 'Unknown Task'}</span>
          <div class="flex items-center gap-3">
            <div class="w-32 bg-gray-200 rounded-full h-3">
              <div class="bg-blue-600 h-3 rounded-full transition-all duration-300" style="width: ${percentage}%"></div>
            </div>
            <span class="text-sm text-gray-600 w-16 text-right">${percentage}%</span>
          </div>
        </div>
      `;
    });
    html += '</div>';
    return html;
  };

  // Generate recommendations HTML with smart suggestions
  const generateRecommendationsHTML = () => {
    const recommendations = [];
    
    if (safePracticeHistory.length === 0) {
      recommendations.push('Start your practice journey by completing your first session');
      recommendations.push('Set up some standards to track your learning goals');
      recommendations.push('Aim for at least 15-30 minutes per practice session');
    } else {
      if (consistencyData.consistencyRate < 70) {
        recommendations.push('Focus on establishing a more consistent daily practice routine');
      }
      
      if (avgSessionLength < 30) {
        recommendations.push('Consider extending practice sessions to at least 30 minutes for better progress');
      }
      
      if (activeStandards.length === 0) {
        recommendations.push('Set up some active standards to track your learning goals');
      }
      
      if (streakData.currentStreak < 3) {
        recommendations.push('Build momentum by maintaining a practice streak of at least 3 days');
      }
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Excellent progress! Keep up the great work');
    }
    
    return recommendations.map(rec => `<li class="mb-2">• ${rec}</li>`).join('');
  };

  // Generate pattern analysis
  const generatePatternAnalysis = () => {
    if (safePracticeHistory.length === 0) {
      return 'No practice data available yet. Start practicing to see your patterns!';
    }
    
    const bestDay = last30Days.reduce((best, session) => 
      session.totalTime > best.totalTime ? session : best, { totalTime: 0 });
    
    const avgDaily = last30Days.length > 0 ? Math.round(monthlyMinutes / last30Days.length) : 0;
    
    return `You've practiced ${last30Days.length} days in the last 30 days with an average of ${avgDaily} minutes per day. ${bestDay.totalTime > 0 ? `Your best day was ${new Date(bestDay.date).toLocaleDateString()} with ${bestDay.totalTime} minutes.` : ''} ${streakData.currentStreak > 0 ? `Current streak: ${streakData.currentStreak} days.` : ''}`;
  };

  // Generate the complete HTML report with proper structure
  const reportDate = new Date().toLocaleDateString();
  const reportPeriod = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jazz Guitar Practice Report</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @media print {
            body { margin: 0; }
            .page-break { page-break-before: always; }
        }
        
        .calendar-day {
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            border-radius: 0;
            cursor: pointer;
            transition: all 0.2s;
            margin: 0;
            border: 1px solid #e5e7eb;
        }
        
        .heat-0 { background-color: #f3f4f6; }
        .heat-1 { background-color: #dbeafe; }
        .heat-2 { background-color: #93c5fd; }
        .heat-3 { background-color: #3b82f6; }
        .heat-4 { background-color: #1d4ed8; }
        .heat-5 { background-color: #1e40af; }
        .streak { border: 2px solid #10b981; }
        
        .progress-dots {
            display: flex;
            gap: 3px;
            align-items: center;
        }
        
        .dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            display: inline-block;
        }
        
        .dot-completed {
            background: #22c55e;
        }
        
        .dot-incomplete {
            background: #e2e8f0;
        }
        
        .status-badge {
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 500;
        }
        
        .status-active {
            background: #dbeafe;
            color: #1d4ed8;
        }
        
        .status-completed {
            background: #dcfce7;
            color: #166534;
        }
        
        .status-inactive {
            background: #f1f5f9;
            color: #64748b;
        }
        
        .priority-high {
            color: #dc2626;
            font-weight: 600;
        }
        
        .priority-medium {
            color: #ea580c;
            font-weight: 500;
        }
        
        .priority-low {
            color: #65a30d;
        }
    </style>
</head>
<body class="bg-gray-50">
    <div class="max-w-7xl mx-auto p-8">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div class="flex justify-between items-start">
                <div>
                    <h1 class="text-3xl font-bold text-gray-800 mb-2">🎸 Jazz Guitar Practice Report</h1>
                    <p class="text-gray-600 mb-4">Comprehensive Practice Analysis</p>
                    <div class="flex gap-6 text-sm">
                        <div>
                            <span class="font-medium">Report Period:</span> ${reportPeriod}
                        </div>
                        <div>
                            <span class="font-medium">Generated:</span> ${reportDate}
                        </div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-2xl font-bold text-green-600">${totalMinutes}</div>
                    <div class="text-sm text-gray-600">Total Minutes</div>
                    <div class="text-lg font-semibold text-blue-600">${safePracticeHistory.length}</div>
                    <div class="text-sm text-gray-600">Practice Sessions</div>
                </div>
            </div>
        </div>

        <!-- Executive Summary -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 mb-8 text-white">
            <h2 class="text-xl font-bold mb-4 text-center">📊 PRACTICE SUMMARY</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div class="text-center">
                    <div class="text-3xl font-bold mb-1">${consistencyData.consistencyRate || 0}%</div>
                    <div class="text-sm opacity-90">Practice Consistency</div>
                </div>
                <div class="text-center">
                    <div class="text-3xl font-bold mb-1">${avgSessionLength} min</div>
                    <div class="text-sm opacity-90">Avg Session Length</div>
                </div>
                <div class="text-center">
                    <div class="text-3xl font-bold mb-1">${activeStandards.length}</div>
                    <div class="text-sm opacity-90">Active Standards</div>
                </div>
                <div class="text-center">
                    <div class="text-3xl font-bold mb-1">${streakData.currentStreak || 0}</div>
                    <div class="text-sm opacity-90">Day Streak</div>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                    <h4 class="font-semibold mb-2">🎯 Strengths</h4>
                    <ul class="space-y-1 opacity-90">
                        <li>• ${safePracticeHistory.length} practice sessions completed</li>
                        <li>• ${totalMinutes} total minutes of practice</li>
                        <li>• ${streakData.longestStreak || 0} day longest streak achieved</li>
                        <li>• Consistent practice tracking</li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-2">💡 Recommendations</h4>
                    <ul class="space-y-1 opacity-90">
                        ${generateRecommendationsHTML()}
                    </ul>
                </div>
            </div>
        </div>

        <!-- Practice Calendar Heat Map -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 class="text-xl font-bold text-gray-800 mb-4">📅 Practice Calendar - Last 30 Days</h2>
            <div class="mb-4">
                <div class="flex items-center gap-4 text-sm">
                    <span class="text-gray-600">Practice Time:</span>
                    <div class="flex items-center gap-1">
                        <div class="w-6 h-6 bg-gray-200 border border-gray-300"></div>
                        <span>0 min</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <div class="w-6 h-6 bg-blue-200 border border-gray-300"></div>
                        <span>15 min</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <div class="w-6 h-6 bg-blue-400 border border-gray-300"></div>
                        <span>30 min</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <div class="w-6 h-6 bg-blue-600 border border-gray-300"></div>
                        <span>60 min</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <div class="w-6 h-6 bg-blue-800 border border-gray-300"></div>
                        <span>90+ min</span>
                    </div>
                </div>
            </div>
            
            ${generateCalendarHTML()}
            
            <div class="mt-4 text-sm text-gray-600">
                <div class="flex gap-4">
                    <span>🟢 Current streak: ${streakData.currentStreak || 0} days</span>
                    <span>📅 Best day: ${last30Days.length > 0 ? new Date(last30Days.reduce((best, session) => session.totalTime > best.totalTime ? session : best, last30Days[0]).date).toLocaleDateString() : 'None'}</span>
                    <span>📊 Average: ${last30Days.length > 0 ? Math.round(monthlyMinutes / last30Days.length) : 0} min/day</span>
                </div>
            </div>
            
            <div class="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 class="font-semibold text-blue-800 mb-2">Pattern Analysis</h4>
                <p class="text-sm text-blue-700">
                    ${generatePatternAnalysis()}
                </p>
            </div>
        </div>

        <!-- Standards Progress Table -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 class="text-xl font-bold text-gray-800 mb-4">🎵 Standards Progress</h2>
            ${generateStandardsTableHTML()}
        </div>

        <!-- Practice Distribution -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 class="text-xl font-bold text-gray-800 mb-4">📊 Practice Distribution</h2>
            ${generateTaskDistributionHTML()}
        </div>

        <!-- Recent Activity -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 class="text-xl font-bold text-gray-800 mb-4">📈 Recent Activity</h2>
            <div class="space-y-3">
                ${safePracticeHistory.length > 0 ? safePracticeHistory.slice(0, 10).map(session => `
                    <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                            <div class="font-medium">${new Date(session.date).toLocaleDateString()}</div>
                            <div class="text-sm text-gray-600">${session.tasks ? session.tasks.length : 0} tasks • ${session.totalTime || 0} minutes</div>
                        </div>
                        <div class="text-sm ${session.completed ? 'text-green-600' : 'text-yellow-600'}">
                            ${session.completed ? 'Completed' : 'In Progress'}
                        </div>
                    </div>
                `).join('') : '<p class="text-gray-500 italic text-center py-4">No practice sessions recorded yet</p>'}
            </div>
        </div>

        <!-- Footer -->
        <div class="text-center text-gray-500 text-sm mt-8">
            <p>Generated by Jazz Guitar Tracker • ${reportDate}</p>
        </div>
    </div>
</body>
</html>
  `;

  // Create and download the file
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `jazz-guitar-practice-report-${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
