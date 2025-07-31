import React, { useState, useEffect } from 'react';
import { Play, Pause, Clock, Check } from 'lucide-react';
import DarkModeToggle from "./DarkModeToggle";
import { TASK_TYPES } from "../constants";

const PracticeSession = ({ 
  session, 
  activeTask, 
  taskTimers,
  isTimerRunning, 
  onSelectTask,
  onStartTimer, 
  onPauseTimer, 
  onResumeTimer, 
  onEndSession,
  onUpdateTask,
  formatTime,
  isDarkMode,
  toggleDarkMode,
  getSessionElapsedTime,
  getTaskElapsedTime,
  getTaskRemainingTime,
  getActiveTaskRemainingTime,
  getSessionProgress,
  getRemainingTaskTime,
  getCappedTotalTimeSpent,
  getTotalTaskTimeSpent,
  taskTimeSpent,
  sessionStarted
}) => {
  const currentTaskIndex = activeTask ? session.tasks.findIndex(t => t.id === activeTask.id) : -1;

  const [showNotePanel, setShowNotePanel] = useState(false);
  const [editingTaskNote, setEditingTaskNote] = useState('');

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showNotePanel) {
        return;
      }
      
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        return;
      }
      
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = currentTaskIndex > 0 ? currentTaskIndex - 1 : session.tasks.length - 1;
        // Only select the task, don't start the timer
        if (isTimerRunning) {
          onPauseTimer();
        }
        onSelectTask(session.tasks[prevIndex]);
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = currentTaskIndex < session.tasks.length - 1 ? currentTaskIndex + 1 : 0;
        // Only select the task, don't start the timer
        if (isTimerRunning) {
          onPauseTimer();
        }
        onSelectTask(session.tasks[nextIndex]);
      } else if (e.key === ' ') {
        e.preventDefault();
        if (activeTask) {
          if (isTimerRunning) {
            onPauseTimer();
          } else {
            onResumeTimer();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTaskIndex, session.tasks, onSelectTask, activeTask, isTimerRunning, onPauseTimer, onResumeTimer, showNotePanel]);

  const handleTaskClick = (task) => {
    if (isTimerRunning) {
      onPauseTimer();
    }
    onSelectTask(task);
  };

  const handleTaskDoubleClick = (task) => {
    if (!activeTask || activeTask.id !== task.id) {
      onSelectTask(task);
    }
    
    if (isTimerRunning) {
      onPauseTimer();
    }
    
    setEditingTaskNote(task.sessionNote || task.practiceNote || '');
    setShowNotePanel(true);
  };

  const saveTaskNote = () => {
    if (activeTask && onUpdateTask) {
      onUpdateTask(activeTask.id, { sessionNote: editingTaskNote });
      setShowNotePanel(false);
    }
  };

  const getStepLabel = (stepIndex) => {
    const labels = [
      'Staples', 'Shells', 'Scales', 'Arpeggios', 
      '3rds', 'Comping', 'Improv', 'Video'
    ];
    const safeStepIndex = stepIndex || 0;
    return labels[safeStepIndex] || `Step ${safeStepIndex + 1}`;
  };

  return (
    <div className={`max-w-4xl mx-auto p-6 min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-white'
    }`}>
      <div className={`rounded-lg shadow-lg p-6 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-2xl font-bold transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>Practice Session</h1>
          <div className="flex gap-3 items-center">
            <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} square />
            
            <button
              onClick={onEndSession}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              End Session
            </button>
          </div>
        </div>

        {/* Timer Display */}
        <div className={`p-6 rounded-lg mb-6 text-center transition-colors duration-300 ${
          isDarkMode ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50'
        }`}>
          <div className="flex justify-end mb-2">
            <div className={`text-right transition-colors duration-300 ${
              isDarkMode ? 'text-blue-400' : 'text-gray-600'
            }`}>
              <div className="text-xs font-medium">Total Task Time</div>
              <div className={`text-sm font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-blue-300' : 'text-blue-700'
              }`}>{formatTime(getTotalTaskTimeSpent())}</div>
            </div>
          </div>

          {activeTask ? (
            <>
              <h2 className={`text-xl font-semibold mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-blue-300' : 'text-gray-800'
              }`}>{activeTask.name}</h2>
              
              <div className="mb-6">
                <div className={`text-sm font-medium mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-blue-400' : 'text-gray-600'
                }`}>Active Task Countdown</div>
                <div className={`text-4xl font-bold transition-colors duration-300 ${
                  getActiveTaskRemainingTime() < 0 
                    ? (isDarkMode ? 'text-orange-400' : 'text-orange-600')
                    : (isDarkMode ? 'text-blue-300' : 'text-blue-600')
                }`}>
                  {formatTime(getActiveTaskRemainingTime())}
                </div>
              </div>

              <div className="flex justify-center gap-4">
                {!isTimerRunning ? (
                  <button
                    onClick={() => sessionStarted ? onResumeTimer() : onStartTimer()}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Play size={20} />
                    {sessionStarted ? 'Resume' : 'Start'}
                  </button>
                ) : (
                  <button
                    onClick={onPauseTimer}
                    className="flex items-center gap-2 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                  >
                    <Pause size={20} />
                    Pause
                  </button>
                )}
              </div>
              
              <div className={`text-center mt-3 text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                💡 Press <kbd className={`px-2 py-1 rounded text-xs transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-800'
                }`}>Space</kbd> to toggle timer
              </div>
            </>
          ) : (
            <>
              <h2 className={`text-xl font-semibold mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-blue-300' : 'text-gray-800'
              }`}>Select a Task to Begin</h2>
              
              <div className="mb-6">
                <div className={`text-sm font-medium mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-blue-400' : 'text-gray-600'
                }`}>Active Task Countdown</div>
                <div className={`text-4xl font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-blue-300' : 'text-blue-600'
                }`}>{formatTime(getRemainingTaskTime())}</div>
              </div>

              <div className={`text-lg mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>
                Click on a task below or use arrow keys to navigate
              </div>
            </>
          )}
        </div>

        {/* Session Overview */}
        <div className="mb-6">
          <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>Session Tasks</h3>
          <div className={`mb-3 text-sm p-3 rounded-lg border transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-blue-900/30 text-blue-300 border-blue-700' 
              : 'bg-blue-50 text-gray-600 border-blue-200'
          }`}>
            <strong>💡 Tip:</strong> Click on any task to make it current, double-click to open practice notes, or use arrow keys to navigate. The timer will control the selected task.
          </div>
          <div className="space-y-3">
            {session.tasks.map((task, index) => {
              const taskElapsed = getTaskElapsedTime(task.id);
              const taskAllocated = task.timeAllocated * 60;
              const isOverTime = taskElapsed > taskAllocated;
              const isCompleted = taskElapsed >= taskAllocated;
              const isActive = activeTask && activeTask.id === task.id;
              
              return (
                <div 
                  key={task.id} 
                  onClick={() => handleTaskClick(task)}
                  onDoubleClick={() => handleTaskDoubleClick(task)}
                  className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                    isActive 
                      ? isOverTime
                        ? (isDarkMode ? 'bg-orange-900/50 border-orange-500 ring-2 ring-orange-400' : 'bg-orange-100 border-orange-400 ring-2 ring-orange-300')
                        : (isDarkMode ? 'bg-blue-900/50 border-blue-500 ring-2 ring-blue-400' : 'bg-blue-100 border-blue-400 ring-2 ring-blue-300')
                      : isOverTime
                        ? (isDarkMode ? 'bg-orange-900/50 border-orange-700 hover:bg-orange-900/70' : 'bg-orange-100 border-orange-300 hover:bg-orange-200')
                        : isCompleted 
                          ? (isDarkMode ? 'bg-green-900/50 border-green-700 hover:bg-green-900/70' : 'bg-green-100 border-green-300 hover:bg-green-200')
                          : (isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100')
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors duration-300 ${
                    isActive
                      ? isOverTime
                        ? 'bg-orange-600 border-orange-500 text-white'
                        : (isDarkMode ? 'bg-blue-600 border-blue-500 text-white' : 'bg-blue-500 border-blue-400 text-white')
                      : isOverTime
                        ? 'bg-orange-600 border-orange-500 text-white'
                        : isCompleted 
                          ? 'bg-green-600 border-green-500 text-white'
                          : (isDarkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300')
                  }`}>
                    {isOverTime ? (
                      <Clock size={16} className="text-white" />
                    ) : isCompleted ? (
                      <Check size={16} className="text-white" />
                    ) : isActive ? (
                      <Play size={16} className="text-white" />
                    ) : (
                      <span className={`text-sm font-bold transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-800'
                      }`}>{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium transition-colors duration-300 ${
                      isActive
                        ? isOverTime
                          ? (isDarkMode ? 'text-orange-300' : 'text-orange-800')
                          : (isDarkMode ? 'text-blue-300' : 'text-blue-800')
                        : isOverTime
                          ? (isDarkMode ? 'text-orange-300' : 'text-orange-800')
                          : (isDarkMode ? 'text-white' : 'text-gray-800')
                    }`}>
                      {task.name}
                      {task.type === TASK_TYPES.STANDARD && task.focusStep !== null && (
                        <span className={`ml-2 text-xs px-2 py-1 rounded transition-colors duration-300 ${
                          isDarkMode ? 'bg-blue-900/50 text-blue-300 border border-blue-700' : 'bg-blue-100 text-blue-800'
                        }`}>
                          Step {(task.focusStep || 0) + 1}: {getStepLabel(task.focusStep || 0)}
                        </span>
                      )}
                    </div>
                    <div className={`text-sm transition-colors duration-300 ${
                      isActive
                        ? isOverTime
                          ? (isDarkMode ? 'text-orange-400' : 'text-orange-600')
                          : (isDarkMode ? 'text-blue-400' : 'text-blue-600')
                        : isOverTime
                          ? (isDarkMode ? 'text-orange-400' : 'text-orange-600')
                          : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                    }`}>
                      {task.type.replace('_', ' ')} • {formatTime(getTaskRemainingTime(task.id))} / {formatTime(taskAllocated)}
                      {isOverTime && (
                        <span className="ml-1 font-medium">
                          (+{formatTime(taskElapsed - taskAllocated)} over)
                        </span>
                      )}
                      {(task.practiceNote || task.sessionNote) && (
                        <span className="ml-2">📝</span>
                      )}
                    </div>
                  </div>
                  {isActive && (
                    <div className={`px-3 py-1 rounded text-xs font-medium ${
                      isOverTime
                        ? (isDarkMode ? 'bg-orange-700 text-orange-200' : 'bg-orange-200 text-orange-800')
                        : (isDarkMode ? 'bg-blue-700 text-blue-200' : 'bg-blue-200 text-blue-800')
                    }`}>
                      {isOverTime ? 'Overtime' : 'Current'}
                    </div>
                  )}
                  {isOverTime && !isActive && (
                    <div className={`px-3 py-1 rounded text-xs font-medium ${
                      isDarkMode ? 'bg-orange-700 text-orange-200' : 'bg-orange-200 text-orange-800'
                    }`}>
                      Overtime
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Session Progress */}
        <div className={`p-4 rounded-lg transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <div className={`flex justify-between text-sm mb-2 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            <span>Time Progress</span>
            <span>{formatTime(getTotalTaskTimeSpent())} / {formatTime(session.totalTime * 60)}</span>
          </div>
          
          <div className={`w-full h-3 rounded-full transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
          }`} style={{ position: 'relative' }}>
            {session.tasks.map((task, index) => {
              const taskElapsed = getTaskElapsedTime(task.id);
              const taskAllocated = task.timeAllocated * 60;
              const isActive = activeTask && activeTask.id === task.id;
              const isCompleted = taskElapsed >= taskAllocated;
              
              const totalAllocated = session.totalTime * 60;
              const segmentWidth = (taskAllocated / totalAllocated) * 100;
              const segmentLeft = session.tasks.slice(0, index).reduce((sum, t) => 
                sum + ((t.timeAllocated * 60) / totalAllocated) * 100, 0
              );
              
              const fillWidth = (taskElapsed / taskAllocated) * 100;
              
              return (
                <div key={task.id} style={{ 
                  position: 'absolute', 
                  left: `${segmentLeft}%`, 
                  width: `${segmentWidth}%`,
                  height: '100%'
                }}>
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      isActive 
                        ? 'bg-blue-600' 
                        : isCompleted 
                          ? 'bg-blue-500' 
                          : 'bg-blue-400'
                    }`}
                    style={{ width: `${fillWidth}%` }}
                  />
                  
                  {index > 0 && (
                    <div 
                      className="absolute left-0 top-0 w-0.5 h-full bg-blue-300"
                      style={{ zIndex: 1 }}
                    />
                  )}
                </div>
              );
            })}
          </div>
          
          <div className={`text-xs mt-1 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Each segment represents a task, filled as you practice
          </div>
        </div>
      </div>

      {showNotePanel && (
        <div className={`fixed bottom-6 right-6 w-80 rounded-lg shadow-lg p-4 border transition-all duration-300 transform ${
          showNotePanel ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        } ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}`}>
          <div className="flex justify-between items-center mb-3">
            <h3 className={`font-medium transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              📝 Practice Note
            </h3>
            <button
              onClick={() => setShowNotePanel(false)}
              className={`text-xl leading-none transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              ×
            </button>
          </div>
          
          {activeTask && (
            <>
              <div className={`text-sm mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {activeTask.name}
                {activeTask.type === TASK_TYPES.STANDARD && activeTask.focusStep !== null && (
                  <span className="ml-1">• Step {(activeTask.focusStep || 0) + 1}</span>
                )}
              </div>
              
              {activeTask.practiceNote && activeTask.practiceNote !== editingTaskNote && (
                <div className={`p-2 rounded mb-2 text-sm transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-700'
                }`}>
                  <strong>Original note:</strong> {activeTask.practiceNote}
                </div>
              )}
              
              <textarea
                value={editingTaskNote}
                onChange={(e) => setEditingTaskNote(e.target.value)}
                placeholder="Update your practice notes..."
                className={`w-full p-2 border rounded resize-none h-24 text-sm transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-800'
                }`}
              />
              
              <div className="flex gap-2 mt-3">
                <button
                  onClick={saveTaskNote}
                  className="flex-1 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Save Note
                </button>
                <button
                  onClick={() => setShowNotePanel(false)}
                  className={`px-4 py-2 rounded text-sm transition-colors duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PracticeSession; 