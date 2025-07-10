import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Plus, Clock, Check, X, BarChart3, FileText, RotateCcw, Eye, EyeOff } from 'lucide-react';

const TASK_TYPES = {
  STANDARD: 'standard',
  OTHER_WORK: 'other_work',
  ONE_OFF: 'one_off'
};

const STANDARD_STEPS = [
  'Play through with staple chords',
  'Learn shell chords',
  'Learn scales for each chord',
  'Learn arpeggios for each chord',
  'Target the 3rds',
  'Practice improve',
  'Post performance video'
];

const JazzGuitarTracker = () => {
  // State management
  const [standards, setStandards] = useState([]);
  const [otherWork, setOtherWork] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [taskTimeSpent, setTaskTimeSpent] = useState({});
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessionRunningTime, setSessionRunningTime] = useState(0);
  const [lastTimerStart, setLastTimerStart] = useState(null);
  const [showAddStandard, setShowAddStandard] = useState(false);
  const [showAddOtherWork, setShowAddOtherWork] = useState(false);
  const [showNewSession, setShowNewSession] = useState(false);
  const [editingStandard, setEditingStandard] = useState(null);
  const [editingOtherWork, setEditingOtherWork] = useState(null);
  const [standardsFilter, setStandardsFilter] = useState('active');
  const [otherWorkFilter, setOtherWorkFilter] = useState('active');
  const [standardsExpanded, setStandardsExpanded] = useState(false);
  const [otherWorkExpanded, setOtherWorkExpanded] = useState(false);
  const [view, setView] = useState('overview');
  const [practiceHistory, setPracticeHistory] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const timerRef = useRef(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedStandards = localStorage.getItem('jazzStandards');
    const savedOtherWork = localStorage.getItem('otherWork');
    const savedHistory = localStorage.getItem('practiceHistory');
    const savedDarkMode = localStorage.getItem('darkMode');
    
    // Load dark mode preference
    if (savedDarkMode !== null) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
    
    if (savedStandards && JSON.parse(savedStandards).length > 0) {
      setStandards(JSON.parse(savedStandards));
    } else {
      // Initialize with some sample data
      const sampleStandards = [
        {
          id: '1',
          name: 'Autumn Leaves',
          type: TASK_TYPES.STANDARD,
          steps: [true, true, false, false, false, false, false],
          completed: false,
          active: true,
          notes: 'Working on the bridge section - need to focus on shell chords',
          lastWorkedOn: new Date('2025-06-28')
        },
        {
          id: '2',
          name: 'All The Things You Are',
          type: TASK_TYPES.STANDARD,
          steps: [true, true, true, true, true, true, true],
          completed: true,
          active: true,
          notes: 'Great for working on ii-V-I progressions. Posted video on June 20th.',
          lastWorkedOn: new Date('2025-06-25')
        },
        {
          id: '3',
          name: 'Body and Soul',
          type: TASK_TYPES.STANDARD,
          steps: [true, true, true, true, false, false, false],
          completed: false,
          active: false,
          notes: 'Need to work on the bridge section - put on hold for now',
          lastWorkedOn: new Date('2025-06-20')
        },
        {
          id: '4',
          name: 'Blue Bossa',
          type: TASK_TYPES.STANDARD,
          steps: [true, true, true, true, true, true, true],
          completed: true,
          active: false,
          notes: 'Completed last month but not actively reviewing. Good bossa nova example.',
          lastWorkedOn: new Date('2025-05-15')
        },
        {
          id: '5',
          name: 'Stella By Starlight',
          type: TASK_TYPES.STANDARD,
          steps: [true, false, false, false, false, false, false],
          completed: false,
          active: true,
          notes: 'Just started - complex harmony needs careful study',
          lastWorkedOn: new Date('2025-07-01')
        },
        {
          id: '6',
          name: 'Take Five',
          type: TASK_TYPES.STANDARD,
          steps: [true, true, true, false, false, false, false],
          completed: false,
          active: true,
          notes: 'Working on 5/4 time signature - getting comfortable with the feel',
          lastWorkedOn: new Date('2025-06-30')
        },
        {
          id: '7',
          name: 'Girl from Ipanema',
          type: TASK_TYPES.STANDARD,
          steps: [true, true, true, true, true, true, true],
          completed: true,
          active: true,
          notes: 'Classic bossa nova - keep in rotation for gigs',
          lastWorkedOn: new Date('2025-06-22')
        }
      ];
      setStandards(sampleStandards);
    }
    
    if (savedOtherWork && JSON.parse(savedOtherWork).length > 0) {
      setOtherWork(JSON.parse(savedOtherWork));
    } else {
      // Initialize with some sample other work
      const sampleOtherWork = [
        {
          id: '1',
          name: 'Galbraith Etude #5',
          type: TASK_TYPES.OTHER_WORK,
          description: 'Working on smooth voice leading and finger independence',
          completed: false,
          active: true,
          lastWorkedOn: new Date('2025-06-29')
        },
        {
          id: '2',
          name: 'Melodic Minor Fingerings',
          type: TASK_TYPES.OTHER_WORK,
          description: 'Berklee fingering system practice - all positions',
          completed: false,
          active: true,
          lastWorkedOn: new Date('2025-06-27')
        },
        {
          id: '3',
          name: 'ii-V-I Licks in Bb',
          type: TASK_TYPES.OTHER_WORK,
          description: 'Building jazz vocabulary - 10 essential licks',
          completed: true,
          active: false,
          lastWorkedOn: new Date('2025-06-15')
        },
        {
          id: '4',
          name: 'Hotel California Solo',
          type: TASK_TYPES.OTHER_WORK,
          description: 'Learning the Eagles solo note-for-note for rock gig',
          completed: false,
          active: true,
          lastWorkedOn: new Date('2025-07-02')
        },
        {
          id: '5',
          name: 'Bach Invention #1',
          type: TASK_TYPES.OTHER_WORK,
          description: 'Classical piece for fingerstyle technique development',
          completed: false,
          active: false,
          lastWorkedOn: new Date('2025-05-20')
        },
        {
          id: '6',
          name: 'Chromatic Exercises',
          type: TASK_TYPES.OTHER_WORK,
          description: 'Daily warm-up routine - Spider exercises 1-4',
          completed: true,
          active: true,
          lastWorkedOn: new Date('2025-07-03')
        },
        {
          id: '7',
          name: 'Altered Scale Practice',
          type: TASK_TYPES.OTHER_WORK,
          description: 'Working on altered dominant sounds - 3 note per string patterns',
          completed: false,
          active: true,
          lastWorkedOn: new Date('2025-06-26')
        },
        {
          id: '8',
          name: 'Wes Montgomery Octaves',
          type: TASK_TYPES.OTHER_WORK,
          description: 'Learning octave technique from transcribed solos',
          completed: false,
          active: false,
          lastWorkedOn: new Date('2025-06-10')
        },
        {
          id: '9',
          name: 'Bossa Nova Comping',
          type: TASK_TYPES.OTHER_WORK,
          description: 'Brazilian rhythm patterns and chord voicings',
          completed: true,
          active: true,
          lastWorkedOn: new Date('2025-06-28')
        }
      ];
      setOtherWork(sampleOtherWork);
    }
    
    if (savedHistory && JSON.parse(savedHistory).length > 0) {
      setPracticeHistory(JSON.parse(savedHistory));
    } else {
      // Add some sample practice history
      const sampleHistory = [
        {
          id: 'hist1',
          date: new Date('2025-07-03T14:30:00').toISOString(),
          tasks: [
            { id: 't1', name: 'Autumn Leaves', type: TASK_TYPES.STANDARD, timeAllocated: 25 },
            { id: 't2', name: 'Chromatic Exercises', type: TASK_TYPES.OTHER_WORK, timeAllocated: 15 },
            { id: 't3', name: 'Scale practice', type: TASK_TYPES.ONE_OFF, timeAllocated: 10 }
          ],
          totalTime: 50,
          completed: true,
          endTime: new Date('2025-07-03T15:20:00').toISOString()
        },
        {
          id: 'hist2',
          date: new Date('2025-07-02T16:00:00').toISOString(),
          tasks: [
            { id: 't4', name: 'Take Five', type: TASK_TYPES.STANDARD, timeAllocated: 30 },
            { id: 't5', name: 'Hotel California Solo', type: TASK_TYPES.OTHER_WORK, timeAllocated: 20 },
            { id: 't6', name: 'All The Things You Are (Repertoire)', type: TASK_TYPES.STANDARD, timeAllocated: 15 }
          ],
          totalTime: 65,
          completed: true,
          endTime: new Date('2025-07-02T17:05:00').toISOString()
        },
        {
          id: 'hist3',
          date: new Date('2025-07-01T10:00:00').toISOString(),
          tasks: [
            { id: 't7', name: 'Stella By Starlight', type: TASK_TYPES.STANDARD, timeAllocated: 35 },
            { id: 't8', name: 'Altered Scale Practice', type: TASK_TYPES.OTHER_WORK, timeAllocated: 20 }
          ],
          totalTime: 55,
          completed: true,
          endTime: new Date('2025-07-01T10:55:00').toISOString()
        },
        {
          id: 'hist4',
          date: new Date('2025-06-30T19:30:00').toISOString(),
          tasks: [
            { id: 't9', name: 'Take Five', type: TASK_TYPES.STANDARD, timeAllocated: 20 },
            { id: 't10', name: 'Bossa Nova Comping', type: TASK_TYPES.OTHER_WORK, timeAllocated: 25 },
            { id: 't11', name: 'Jam session prep', type: TASK_TYPES.ONE_OFF, timeAllocated: 15 }
          ],
          totalTime: 60,
          completed: true,
          endTime: new Date('2025-06-30T20:30:00').toISOString()
        },
        {
          id: 'hist5',
          date: new Date('2025-06-29T15:15:00').toISOString(),
          tasks: [
            { id: 't12', name: 'Galbraith Etude #5', type: TASK_TYPES.OTHER_WORK, timeAllocated: 30 },
            { id: 't13', name: 'Girl from Ipanema (Repertoire)', type: TASK_TYPES.STANDARD, timeAllocated: 10 }
          ],
          totalTime: 40,
          completed: true,
          endTime: new Date('2025-06-29T15:55:00').toISOString()
        }
      ];
      setPracticeHistory(sampleHistory);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('jazzStandards', JSON.stringify(standards));
  }, [standards]);

  useEffect(() => {
    localStorage.setItem('otherWork', JSON.stringify(otherWork));
  }, [otherWork]);

  useEffect(() => {
    localStorage.setItem('practiceHistory', JSON.stringify(practiceHistory));
  }, [practiceHistory]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Timer logic
  useEffect(() => {
    if (isTimerRunning && activeTask) {
      timerRef.current = setInterval(() => {
        // Update time spent for current task
        setTaskTimeSpent(prev => ({
          ...prev,
          [activeTask.id]: (prev[activeTask.id] || 0) + 1
        }));

        // Update session running time
        setSessionRunningTime(prev => prev + 1);

        setTimeRemaining(prev => {
          if (prev <= 1) {
            // When time reaches 0, don't auto-advance, just stop the timer
            // User can choose to continue or move to next task
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isTimerRunning, activeTask]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const addStandard = (name) => {
    const newStandard = {
      id: Date.now().toString(),
      name,
      type: TASK_TYPES.STANDARD,
      steps: new Array(7).fill(false),
      completed: false,
      active: true,
      notes: '',
      lastWorkedOn: null
    };
    setStandards([...standards, newStandard]);
    setShowAddStandard(false);
  };

  const addOtherWork = (name, description) => {
    const newWork = {
      id: Date.now().toString(),
      name,
      type: TASK_TYPES.OTHER_WORK,
      description,
      completed: false,
      active: true,
      lastWorkedOn: null
    };
    setOtherWork([...otherWork, newWork]);
    setShowAddOtherWork(false);
  };

  const updateStandardStep = (standardId, stepIndex) => {
    setStandards(standards.map(standard => {
      if (standard.id === standardId) {
        const newSteps = [...standard.steps];
        newSteps[stepIndex] = !newSteps[stepIndex];
        const completed = newSteps.every(step => step);
        return {
          ...standard,
          steps: newSteps,
          completed,
          lastWorkedOn: new Date()
        };
      }
      return standard;
    }));
  };

  const updateStandard = (standardId, updates) => {
    setStandards(standards.map(standard => 
      standard.id === standardId 
        ? { ...standard, ...updates, lastWorkedOn: new Date() }
        : standard
    ));
    setEditingStandard(null);
  };

  const updateOtherWork = (itemId, updates) => {
    setOtherWork(otherWork.map(item => 
      item.id === itemId 
        ? { ...item, ...updates, lastWorkedOn: new Date() }
        : item
    ));
    setEditingOtherWork(null);
  };

  const toggleStandardStatus = (standardId, field) => {
    setStandards(standards.map(standard => 
      standard.id === standardId 
        ? { ...standard, [field]: !standard[field] }
        : standard
    ));
  };

  const toggleOtherWorkStatus = (itemId, field) => {
    setOtherWork(otherWork.map(item => 
      item.id === itemId 
        ? { ...item, [field]: !item[field] }
        : item
    ));
  };

  const startNewSession = () => {
    setShowNewSession(true);
    setView('session');
  };

  const createSession = (tasks) => {
    const session = {
      id: Date.now().toString(),
      date: new Date(),
      tasks,
      totalTime: tasks.reduce((sum, task) => sum + task.timeAllocated, 0),
      completed: false
    };
    setCurrentSession(session);
    setShowNewSession(false);
    setTaskTimeSpent({});
    setSessionStartTime(null);
    setSessionRunningTime(0);
    setLastTimerStart(null);
    // Automatically set the first task as the current task
    if (tasks.length > 0) {
      setActiveTask(tasks[0]);
      setTimeRemaining(tasks[0].timeAllocated * 60);
    }
  };

  const startTimer = (task) => {
    // Set session start time if not already set
    if (!sessionStartTime) {
      setSessionStartTime(new Date());
      setSessionRunningTime(0);
    }

    // If this is a different task, switch to it and set remaining time
    if (!activeTask || activeTask.id !== task.id) {
      setActiveTask(task);
      const timeSpent = taskTimeSpent[task.id] || 0;
      const remainingTime = Math.max(0, (task.timeAllocated * 60) - timeSpent);
      setTimeRemaining(remainingTime);
      setIsTimerRunning(false); // Don't auto-start when switching tasks
    }
    // If it's the same task and timer isn't running, this acts as a start/resume
    else if (!isTimerRunning) {
      setIsTimerRunning(true);
      setLastTimerStart(new Date());
    }
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const resumeTimer = () => {
    setIsTimerRunning(true);
    setLastTimerStart(new Date());
  };

  const endSession = () => {
    if (currentSession) {
      const completedSession = {
        ...currentSession,
        completed: true,
        endTime: new Date(),
        taskTimeSpent: { ...taskTimeSpent }
      };
      setPracticeHistory([completedSession, ...practiceHistory]);
      setCurrentSession(null);
      setActiveTask(null);
      setIsTimerRunning(false);
      setTaskTimeSpent({});
      setSessionStartTime(null);
      setSessionRunningTime(0);
      setLastTimerStart(null);
      if (timerRef.current) clearInterval(timerRef.current);
      setView('overview');
    }
  };

  const getSessionElapsedTime = () => {
    return sessionRunningTime;
  };

  const getRemainingTaskTime = () => {
    if (!currentSession) return 0;
    
    // Calculate sum of time remaining for each task (never negative)
    // Overtime doesn't count against remaining time
    const totalTimeRemaining = currentSession.tasks.reduce((sum, task) => {
      const timeSpent = taskTimeSpent[task.id] || 0;
      const allocated = task.timeAllocated * 60;
      const remaining = Math.max(0, allocated - timeSpent);
      return sum + remaining;
    }, 0);
    
    return totalTimeRemaining;
  };

  const getTaskElapsedTime = (taskId) => {
    return taskTimeSpent[taskId] || 0;
  };

  const getSessionProgress = () => {
    if (!currentSession) return 0;
    const totalAllocated = currentSession.tasks.reduce((sum, task) => sum + task.timeAllocated * 60, 0);
    const totalSpentCapped = currentSession.tasks.reduce((sum, task) => {
      const spent = taskTimeSpent[task.id] || 0;
      const allocated = task.timeAllocated * 60;
      return sum + Math.min(spent, allocated);
    }, 0);
    return totalAllocated > 0 ? (totalSpentCapped / totalAllocated) * 100 : 0;
  };

  const getRepertoireRotation = () => {
    const activeCompletedStandards = standards.filter(s => s.completed && s.active);
    if (activeCompletedStandards.length === 0) return null;
    
    // Sort by last worked on date, oldest first
    return activeCompletedStandards.sort((a, b) => {
      const dateA = a.lastWorkedOn ? new Date(a.lastWorkedOn) : new Date(0);
      const dateB = b.lastWorkedOn ? new Date(b.lastWorkedOn) : new Date(0);
      return dateA - dateB;
    })[0];
  };

  const getWeeklyStats = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weekSessions = practiceHistory.filter(session => 
      new Date(session.date) >= oneWeekAgo
    );
    
    const totalTime = weekSessions.reduce((sum, session) => sum + session.totalTime, 0);
    return {
      sessions: weekSessions.length,
      totalTime: Math.round(totalTime),
      avgSession: weekSessions.length > 0 ? Math.round(totalTime / weekSessions.length) : 0
    };
  };

  const getFilteredStandards = () => {
    switch (standardsFilter) {
      case 'active':
        return standards.filter(s => s.active);
      case 'completed':
        return standards.filter(s => s.completed);
      case 'all':
      default:
        return standards;
    }
  };

  const getFilteredOtherWork = () => {
    switch (otherWorkFilter) {
      case 'active':
        return otherWork.filter(w => w.active);
      case 'completed':
        return otherWork.filter(w => w.completed);
      case 'all':
      default:
        return otherWork;
    }
  };

  if (view === 'session' && showNewSession) {
    return <SessionSetup 
      standards={standards}
      otherWork={otherWork}
      onCreateSession={createSession}
      onCancel={() => {
        setShowNewSession(false);
        setView('overview');
      }}
      getRepertoireRotation={getRepertoireRotation}
      isDarkMode={isDarkMode}
      toggleDarkMode={toggleDarkMode}
    />;
  }

  if (view === 'session' && currentSession) {
    return <PracticeSession 
      session={currentSession}
      activeTask={activeTask}
      timeRemaining={timeRemaining}
      isTimerRunning={isTimerRunning}
      onStartTimer={startTimer}
      onPauseTimer={pauseTimer}
      onResumeTimer={resumeTimer}
      onEndSession={endSession}
      formatTime={formatTime}
      isDarkMode={isDarkMode}
      toggleDarkMode={toggleDarkMode}
      getSessionElapsedTime={getSessionElapsedTime}
      getTaskElapsedTime={getTaskElapsedTime}
      getSessionProgress={getSessionProgress}
      getRemainingTaskTime={getRemainingTaskTime}
      taskTimeSpent={taskTimeSpent}
    />;
  }

  if (view === 'reports') {
    return <ReportsView 
      practiceHistory={practiceHistory}
      onBack={() => setView('overview')}
      getWeeklyStats={getWeeklyStats}
      isDarkMode={isDarkMode}
      toggleDarkMode={toggleDarkMode}
    />;
  }

  const weeklyStats = getWeeklyStats();
  const nextRepertoire = getRepertoireRotation();
  const activeStandards = standards.filter(s => s.active);
  const activeOtherWork = otherWork.filter(w => w.active);
  const filteredStandards = getFilteredStandards();
  const filteredOtherWork = getFilteredOtherWork();

  return (
    <div className={`max-w-6xl mx-auto p-6 min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className={`rounded-lg shadow-lg p-6 mb-6 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-3xl font-bold transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>Jazz Guitar Practice Tracker</h1>
          <div className="flex gap-3 items-center">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="Toggle dark mode"
            >
              {isDarkMode ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd"/>
                </svg>
              )}
            </button>
            
            <button
              onClick={() => setView('reports')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <BarChart3 size={20} />
              Reports
            </button>
            <button
              onClick={startNewSession}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              <Play size={20} />
              Start New Session
            </button>
          </div>
        </div>

        {/* Weekly Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className={`p-4 rounded-lg transition-colors duration-300 ${
            isDarkMode ? 'bg-blue-900/50 border border-blue-700' : 'bg-blue-50'
          }`}>
            <h3 className={`font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-blue-300' : 'text-blue-800'
            }`}>This Week</h3>
            <p className={`text-2xl font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-blue-400' : 'text-blue-600'
            }`}>{weeklyStats.sessions} sessions</p>
            <p className={`text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-blue-400' : 'text-blue-600'
            }`}>{weeklyStats.totalTime} minutes total</p>
          </div>
          <div className={`p-4 rounded-lg transition-colors duration-300 ${
            isDarkMode ? 'bg-green-900/50 border border-green-700' : 'bg-green-50'
          }`}>
            <h3 className={`font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-green-300' : 'text-green-800'
            }`}>Average Session</h3>
            <p className={`text-2xl font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-green-400' : 'text-green-600'
            }`}>{weeklyStats.avgSession} min</p>
          </div>
          <div className={`p-4 rounded-lg transition-colors duration-300 ${
            isDarkMode ? 'bg-orange-900/50 border border-orange-700' : 'bg-orange-50'
          }`}>
            <h3 className={`font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-orange-300' : 'text-orange-800'
            }`}>Next Repertoire</h3>
            <p className={`text-lg font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-orange-400' : 'text-orange-600'
            }`}>
              {nextRepertoire ? nextRepertoire.name : 'None active'}
            </p>
          </div>
          <div className={`p-4 rounded-lg transition-colors duration-300 ${
            isDarkMode ? 'bg-purple-900/50 border border-purple-700' : 'bg-purple-50'
          }`}>
            <h3 className={`font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-purple-300' : 'text-purple-800'
            }`}>Active Tasks</h3>
            <p className={`text-2xl font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-purple-400' : 'text-purple-600'
            }`}>{activeStandards.length + activeOtherWork.length}</p>
            <p className={`text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-purple-400' : 'text-purple-600'
            }`}>standards + other work</p>
          </div>
        </div>
      </div>

      {/* Standards Management */}
      <div className={`rounded-lg shadow-lg p-6 mb-6 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setStandardsExpanded(!standardsExpanded)}
              className={`flex items-center gap-2 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <RotateCcw 
                size={20} 
                className={`transition-transform duration-200 ${standardsExpanded ? 'rotate-90' : ''}`}
                style={{ transform: standardsExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
              />
              <h2 className={`text-2xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>Jazz Standards</h2>
            </button>
            {!standardsExpanded && (
              <SectionSummary items={standards} isDarkMode={isDarkMode} />
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setEditingStandard(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
            >
              <FileText size={20} />
              Edit Standard
            </button>
            <button
              onClick={() => {
                setStandardsExpanded(true);
                setShowAddStandard(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus size={20} />
              Add Standard
            </button>
          </div>
        </div>

        {standardsExpanded && (
          <>
            {/* Filter Buttons */}
            <div className="flex gap-2 mb-4">
              <FilterButtons 
                currentFilter={standardsFilter}
                onFilterChange={setStandardsFilter}
                items={standards}
                isDarkMode={isDarkMode}
              />
            </div>

            {showAddStandard && (
              <AddStandardForm 
                onAdd={addStandard}
                onCancel={() => setShowAddStandard(false)}
                isDarkMode={isDarkMode}
              />
            )}

            {editingStandard && (
              <EditStandardSelector 
                standards={standards}
                onSelectStandard={(standard) => setEditingStandard(standard)}
                onCancel={() => setEditingStandard(null)}
                isDarkMode={isDarkMode}
              />
            )}

            {editingStandard && typeof editingStandard === 'object' && (
              <EditStandardForm 
                standard={editingStandard}
                onUpdate={updateStandard}
                onCancel={() => setEditingStandard(null)}
                isDarkMode={isDarkMode}
              />
            )}

            <div className="grid gap-4">
              {filteredStandards.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No standards found for "{standardsFilter}" filter.
                </p>
              ) : (
                filteredStandards.map(standard => (
                  <StandardCard 
                    key={standard.id}
                    standard={standard}
                    onUpdateStep={updateStandardStep}
                    onToggleStatus={toggleStandardStatus}
                    isDarkMode={isDarkMode}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Other Work Management */}
      <div className={`rounded-lg shadow-lg p-6 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOtherWorkExpanded(!otherWorkExpanded)}
              className={`flex items-center gap-2 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <RotateCcw 
                size={20} 
                className={`transition-transform duration-200 ${otherWorkExpanded ? 'rotate-90' : ''}`}
                style={{ transform: otherWorkExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
              />
              <h2 className={`text-2xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>Other Work</h2>
            </button>
            {!otherWorkExpanded && (
              <SectionSummary items={otherWork} isDarkMode={isDarkMode} />
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setEditingOtherWork(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
            >
              <FileText size={20} />
              Edit Other Work
            </button>
            <button
              onClick={() => {
                setOtherWorkExpanded(true);
                setShowAddOtherWork(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus size={20} />
              Add Other Work
            </button>
          </div>
        </div>

        {otherWorkExpanded && (
          <>
            {/* Filter Buttons */}
            <div className="flex gap-2 mb-4">
              <FilterButtons 
                currentFilter={otherWorkFilter}
                onFilterChange={setOtherWorkFilter}
                items={otherWork}
                isDarkMode={isDarkMode}
              />
            </div>

            {showAddOtherWork && (
              <AddOtherWorkForm 
                onAdd={addOtherWork}
                onCancel={() => setShowAddOtherWork(false)}
                isDarkMode={isDarkMode}
              />
            )}

            {editingOtherWork && (
              <EditOtherWorkSelector 
                otherWork={otherWork}
                onSelectWork={(work) => setEditingOtherWork(work)}
                onCancel={() => setEditingOtherWork(null)}
                isDarkMode={isDarkMode}
              />
            )}

            {editingOtherWork && typeof editingOtherWork === 'object' && (
              <EditOtherWorkForm 
                work={editingOtherWork}
                onUpdate={updateOtherWork}
                onCancel={() => setEditingOtherWork(null)}
                isDarkMode={isDarkMode}
              />
            )}

            <div className="grid gap-4">
              {filteredOtherWork.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No other work found for "{otherWorkFilter}" filter.
                </p>
              ) : (
                filteredOtherWork.map(item => (
                  <OtherWorkCard 
                    key={item.id}
                    item={item}
                    onToggleStatus={toggleOtherWorkStatus}
                    isDarkMode={isDarkMode}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const AddStandardForm = ({ onAdd, onCancel, isDarkMode }) => {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (name.trim()) {
      onAdd(name.trim());
      setName('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className={`p-4 rounded-lg mb-4 transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
    }`}>
      <div className="flex gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter standard name..."
          className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-800'
          }`}
          autoFocus
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Add
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const AddOtherWorkForm = ({ onAdd, onCancel, isDarkMode }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (name.trim()) {
      onAdd(name.trim(), description.trim());
      setName('');
      setDescription('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      handleSubmit();
    }
  };

  return (
    <div className={`p-4 rounded-lg mb-4 transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
    }`}>
      <div className="space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter name (e.g., 'Galbraith Etude #5')..."
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-800'
          }`}
          autoFocus
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)..."
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-800'
          }`}
        />
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Add
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const StandardCard = ({ standard, onUpdateStep, onToggleStatus, isDarkMode }) => {
  const completedSteps = standard.steps.filter(Boolean).length;
  const progressPercent = (completedSteps / STANDARD_STEPS.length) * 100;

  return (
    <div className={`border rounded-lg p-4 transition-colors duration-300 ${
      !standard.active ? 'opacity-60' : ''
    } ${
      standard.completed 
        ? (isDarkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200')
        : (isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200')
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`text-lg font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>{standard.name}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => onToggleStatus(standard.id, 'completed')}
                className={`px-2 py-1 text-xs rounded ${
                  standard.completed 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}
                title="Toggle completion status"
              >
                {standard.completed ? 'Completed' : 'Uncompleted'}
              </button>
              <button
                onClick={() => onToggleStatus(standard.id, 'active')}
                className={`px-2 py-1 text-xs rounded flex items-center gap-1 ${
                  standard.active 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}
                title="Toggle active status"
              >
                {standard.active ? <Eye size={12} /> : <EyeOff size={12} />}
                {standard.active ? 'Active' : 'Inactive'}
              </button>
            </div>
          </div>
          {standard.notes && (
            <p className={`text-sm mb-1 italic transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>"{standard.notes}"</p>
          )}
          {standard.lastWorkedOn && (
            <p className={`text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-500'
            }`}>
              Last worked on: {new Date(standard.lastWorkedOn).toLocaleDateString()}
            </p>
          )}
        </div>
        <div className="text-right">
          <div className={`text-sm font-medium transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-800'
          }`}>{completedSteps}/{STANDARD_STEPS.length} steps</div>
          <div className={`w-20 rounded-full h-2 mt-1 transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
          }`}>
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {STANDARD_STEPS.map((step, index) => (
          <label key={index} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={standard.steps[index]}
              onChange={() => onUpdateStep(standard.id, index)}
              className="rounded"
            />
            <span className={`text-sm transition-colors duration-300 ${
              standard.steps[index] 
                ? (isDarkMode ? 'line-through text-gray-500' : 'line-through text-gray-500')
                : (isDarkMode ? 'text-gray-300' : 'text-gray-800')
            }`}>
              {step}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

const OtherWorkCard = ({ item, onToggleStatus, isDarkMode }) => {
  return (
    <div className={`border rounded-lg p-4 transition-colors duration-300 ${
      !item.active ? 'opacity-60' : ''
    } ${
      item.completed 
        ? (isDarkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200')
        : (isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200')
    }`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`text-lg font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>{item.name}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => onToggleStatus(item.id, 'completed')}
                className={`px-2 py-1 text-xs rounded ${
                  item.completed 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}
                title="Toggle completion status"
              >
                {item.completed ? 'Completed' : 'Uncompleted'}
              </button>
              <button
                onClick={() => onToggleStatus(item.id, 'active')}
                className={`px-2 py-1 text-xs rounded flex items-center gap-1 ${
                  item.active 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}
                title="Toggle active status"
              >
                {item.active ? <Eye size={12} /> : <EyeOff size={12} />}
                {item.active ? 'Active' : 'Inactive'}
              </button>
            </div>
          </div>
          {item.description && (
            <p className={`text-sm mb-1 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>{item.description}</p>
          )}
          {item.lastWorkedOn && (
            <p className={`text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-500'
            }`}>
              Last worked on: {new Date(item.lastWorkedOn).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const SectionSummary = ({ items, isDarkMode }) => {
  const activeCount = items.filter(item => item.active).length;
  const completedCount = items.filter(item => item.completed).length;
  const inProgressCount = items.filter(item => !item.completed).length;
  const totalCount = items.length;

  return (
    <div className="flex gap-4 text-sm">
      <span className={`px-2 py-1 rounded transition-colors duration-300 ${
        isDarkMode ? 'bg-blue-900/50 text-blue-300 border border-blue-700' : 'bg-blue-100 text-blue-800'
      }`}>
        {activeCount} active
      </span>
      <span className={`px-2 py-1 rounded transition-colors duration-300 ${
        isDarkMode ? 'bg-green-900/50 text-green-300 border border-green-700' : 'bg-green-100 text-green-800'
      }`}>
        {completedCount} completed
      </span>
      <span className={`px-2 py-1 rounded transition-colors duration-300 ${
        isDarkMode ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-700' : 'bg-yellow-100 text-yellow-800'
      }`}>
        {inProgressCount} in progress
      </span>
      <span className={`px-2 py-1 rounded transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-700 text-gray-300 border border-gray-600' : 'bg-gray-100 text-gray-800'
      }`}>
        {totalCount} total
      </span>
    </div>
  );
};

const FilterButtons = ({ currentFilter, onFilterChange, items, isDarkMode }) => {
  const activeCount = items.filter(item => item.active).length;
  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;

  const filters = [
    { key: 'active', label: `Active (${activeCount})`, count: activeCount },
    { key: 'all', label: `All (${totalCount})`, count: totalCount },
    { key: 'completed', label: `Completed (${completedCount})`, count: completedCount }
  ];

  return (
    <div className="flex gap-2">
      {filters.map(filter => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`px-3 py-1 text-sm rounded-lg transition-colors ${
            currentFilter === filter.key
              ? 'bg-blue-600 text-white'
              : (isDarkMode 
                  ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

const EditStandardSelector = ({ standards, onSelectStandard, onCancel, isDarkMode }) => {
  return (
    <div className={`p-4 rounded-lg mb-4 border transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-orange-900/30 border-orange-700' 
        : 'bg-orange-50 border-orange-200'
    }`}>
      <h3 className={`font-semibold mb-3 transition-colors duration-300 ${
        isDarkMode ? 'text-orange-300' : 'text-orange-800'
      }`}>Select Standard to Edit</h3>
      <div className="grid gap-2 mb-4 max-h-48 overflow-y-auto">
        {standards.map(standard => (
          <button
            key={standard.id}
            onClick={() => onSelectStandard(standard)}
            className={`text-left p-3 rounded border transition-colors ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 hover:bg-orange-900/50 text-white' 
                : 'bg-white border-gray-300 hover:bg-orange-50 text-gray-800'
            }`}
          >
            <div className="font-medium">{standard.name}</div>
            <div className={`text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {standard.completed ? 'Completed' : 'In Progress'} • {standard.active ? 'Active' : 'Inactive'}
            </div>
          </button>
        ))}
      </div>
      <button
        onClick={onCancel}
        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
      >
        Cancel
      </button>
    </div>
  );
};

const EditStandardForm = ({ standard, onUpdate, onCancel, isDarkMode }) => {
  const [name, setName] = useState(standard.name);
  const [notes, setNotes] = useState(standard.notes || '');
  const [steps, setSteps] = useState([...standard.steps]);
  const [completed, setCompleted] = useState(standard.completed);
  const [active, setActive] = useState(standard.active);

  const handleStepToggle = (index) => {
    const newSteps = [...steps];
    newSteps[index] = !newSteps[index];
    setSteps(newSteps);
    
    // Auto-update completed status based on all steps
    const allCompleted = newSteps.every(step => step);
    setCompleted(allCompleted);
  };

  const handleSubmit = () => {
    if (name.trim()) {
      onUpdate(standard.id, {
        name: name.trim(),
        notes: notes.trim(),
        steps,
        completed,
        active
      });
    }
  };

  return (
    <div className={`p-4 rounded-lg mb-4 border transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-orange-900/30 border-orange-700' 
        : 'bg-orange-50 border-orange-200'
    }`}>
      <h3 className={`font-semibold mb-4 transition-colors duration-300 ${
        isDarkMode ? 'text-orange-300' : 'text-orange-800'
      }`}>Edit Standard: {standard.name}</h3>
      
      <div className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-gray-600 border-gray-500 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about this standard..."
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 h-20 resize-none transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Learning Steps</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {STANDARD_STEPS.map((step, index) => (
              <label key={index} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={steps[index]}
                  onChange={() => handleStepToggle(index)}
                  className="rounded"
                />
                <span className={`text-sm transition-colors duration-300 ${
                  steps[index] 
                    ? (isDarkMode ? 'line-through text-gray-500' : 'line-through text-gray-500')
                    : (isDarkMode ? 'text-gray-300' : 'text-gray-800')
                }`}>
                  {step}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              className="rounded"
            />
            <span className={`text-sm font-medium transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-800'
            }`}>Completed</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="rounded"
            />
            <span className={`text-sm font-medium transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-800'
            }`}>Active</span>
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Save Changes
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const EditOtherWorkSelector = ({ otherWork, onSelectWork, onCancel, isDarkMode }) => {
  return (
    <div className={`p-4 rounded-lg mb-4 border transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-orange-900/30 border-orange-700' 
        : 'bg-orange-50 border-orange-200'
    }`}>
      <h3 className={`font-semibold mb-3 transition-colors duration-300 ${
        isDarkMode ? 'text-orange-300' : 'text-orange-800'
      }`}>Select Other Work to Edit</h3>
      <div className="grid gap-2 mb-4 max-h-48 overflow-y-auto">
        {otherWork.map(work => (
          <button
            key={work.id}
            onClick={() => onSelectWork(work)}
            className={`text-left p-3 rounded border transition-colors ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 hover:bg-orange-900/50 text-white' 
                : 'bg-white border-gray-300 hover:bg-orange-50 text-gray-800'
            }`}
          >
            <div className="font-medium">{work.name}</div>
            <div className={`text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {work.completed ? 'Completed' : 'In Progress'} • {work.active ? 'Active' : 'Inactive'}
              {work.description && ` • ${work.description.substring(0, 50)}${work.description.length > 50 ? '...' : ''}`}
            </div>
          </button>
        ))}
      </div>
      <button
        onClick={onCancel}
        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
      >
        Cancel
      </button>
    </div>
  );
};

const EditOtherWorkForm = ({ work, onUpdate, onCancel, isDarkMode }) => {
  const [name, setName] = useState(work.name);
  const [description, setDescription] = useState(work.description || '');
  const [completed, setCompleted] = useState(work.completed);
  const [active, setActive] = useState(work.active);

  const handleSubmit = () => {
    if (name.trim()) {
      onUpdate(work.id, {
        name: name.trim(),
        description: description.trim(),
        completed,
        active
      });
    }
  };

  return (
    <div className={`p-4 rounded-lg mb-4 border transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-orange-900/30 border-orange-700' 
        : 'bg-orange-50 border-orange-200'
    }`}>
      <h3 className={`font-semibold mb-4 transition-colors duration-300 ${
        isDarkMode ? 'text-orange-300' : 'text-orange-800'
      }`}>Edit Other Work: {work.name}</h3>
      
      <div className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-gray-600 border-gray-500 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add any notes about this work..."
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 h-20 resize-none transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          />
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              className="rounded"
            />
            <span className={`text-sm font-medium transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-800'
            }`}>Completed</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="rounded"
            />
            <span className={`text-sm font-medium transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-800'
            }`}>Active</span>
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Save Changes
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const SessionSetup = ({ standards, otherWork, onCreateSession, onCancel, getRepertoireRotation, isDarkMode, toggleDarkMode }) => {
  const [sessionTasks, setSessionTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskTime, setNewTaskTime] = useState(20);
  const [selectedStandard, setSelectedStandard] = useState('');
  const [selectedOtherWork, setSelectedOtherWork] = useState('');
  const [selectedRepertoire, setSelectedRepertoire] = useState('');
  const [dragIndex, setDragIndex] = useState(null);

  const activeStandards = standards.filter(s => s.active);
  const activeOtherWork = otherWork.filter(w => w.active);
  const totalTime = sessionTasks.reduce((sum, task) => sum + task.timeAllocated, 0);
  const suggestedRepertoireTime = Math.round(totalTime * 0.2);

  // Get repertoire list sorted by last worked on date (oldest first)
  const getRepertoireList = () => {
    const activeCompletedStandards = standards.filter(s => s.completed && s.active);
    return activeCompletedStandards.sort((a, b) => {
      const dateA = a.lastWorkedOn ? new Date(a.lastWorkedOn) : new Date(0);
      const dateB = b.lastWorkedOn ? new Date(b.lastWorkedOn) : new Date(0);
      return dateA - dateB;
    });
  };

  const repertoireList = getRepertoireList();

  // Set initial selected repertoire when component mounts or when repertoire becomes available
  useEffect(() => {
    if (repertoireList.length > 0 && !selectedRepertoire) {
      setSelectedRepertoire(repertoireList[0].id);
    } else if (repertoireList.length === 0) {
      setSelectedRepertoire('');
    }
  }, [repertoireList, selectedRepertoire]);

  const addStandardTask = () => {
    if (selectedStandard) {
      const standard = standards.find(s => s.id === selectedStandard);
      const task = {
        id: Date.now().toString(),
        name: standard.name,
        type: TASK_TYPES.STANDARD,
        timeAllocated: 25,
        standardId: standard.id
      };
      setSessionTasks([...sessionTasks, task]);
      setSelectedStandard('');
    }
  };

  const addOtherWorkTask = () => {
    if (selectedOtherWork) {
      const work = otherWork.find(w => w.id === selectedOtherWork);
      const task = {
        id: Date.now().toString(),
        name: work.name,
        type: TASK_TYPES.OTHER_WORK,
        timeAllocated: 20,
        otherWorkId: work.id
      };
      setSessionTasks([...sessionTasks, task]);
      setSelectedOtherWork('');
    }
  };

  const addCustomTask = () => {
    if (newTaskName.trim()) {
      const task = {
        id: Date.now().toString(),
        name: newTaskName.trim(),
        type: TASK_TYPES.ONE_OFF,
        timeAllocated: newTaskTime
      };
      setSessionTasks([...sessionTasks, task]);
      setNewTaskName('');
      setNewTaskTime(20);
    }
  };

  const addRepertoireTask = () => {
    if (selectedRepertoire) {
      const repertoire = standards.find(s => s.id === selectedRepertoire);
      const time = suggestedRepertoireTime || 10;
      const task = {
        id: Date.now().toString(),
        name: `${repertoire.name} (Repertoire)`,
        type: TASK_TYPES.STANDARD,
        timeAllocated: time,
        standardId: repertoire.id
      };
      setSessionTasks([...sessionTasks, task]);
      
      // Reset to next available repertoire item (or first if the selected was the first)
      const currentIndex = repertoireList.findIndex(s => s.id === selectedRepertoire);
      const nextIndex = currentIndex < repertoireList.length - 1 ? currentIndex + 1 : 0;
      if (repertoireList.length > 1) {
        setSelectedRepertoire(repertoireList[nextIndex].id);
      } else {
        setSelectedRepertoire('');
      }
    }
  };

  const removeTask = (taskId) => {
    setSessionTasks(sessionTasks.filter(t => t.id !== taskId));
  };

  const updateTaskTime = (taskId, newTime) => {
    setSessionTasks(sessionTasks.map(task =>
      task.id === taskId ? { ...task, timeAllocated: parseInt(newTime) || 0 } : task
    ));
  };

  const handleCreateSession = () => {
    if (sessionTasks.length > 0) {
      onCreateSession(sessionTasks);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
  };

  const handleDropBetween = (e, insertIndex) => {
    e.preventDefault();
    
    if (dragIndex === null || dragIndex === insertIndex) {
      setDragIndex(null);
      return;
    }

    const newTasks = [...sessionTasks];
    
    // Remove the dragged task
    const [draggedTask] = newTasks.splice(dragIndex, 1);
    
    // Calculate the correct insertion point
    let finalInsertIndex = insertIndex;
    
    // If we're moving forward (dragging down), we need to account for the removed item
    if (dragIndex < insertIndex) {
      finalInsertIndex = insertIndex - 1;
    }
    
    // Insert the task at the new position
    newTasks.splice(finalInsertIndex, 0, draggedTask);
    
    setSessionTasks(newTasks);
    setDragIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  return (
    <div className={`max-w-5xl mx-auto p-6 min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className={`rounded-lg shadow-lg p-6 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-2xl font-bold transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>Setup Practice Session</h1>
          <div className="flex gap-3 items-center">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="Toggle dark mode"
            >
              {isDarkMode ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd"/>
                </svg>
              )}
            </button>
            
            <button
              onClick={onCancel}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-500 text-white hover:bg-gray-600'
              }`}
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Add Standard */}
          <div className={`p-4 rounded-lg transition-colors duration-300 ${
            isDarkMode ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50'
          }`}>
            <h3 className={`font-semibold mb-3 transition-colors duration-300 ${
              isDarkMode ? 'text-blue-300' : 'text-gray-800'
            }`}>Add Standard</h3>
            <select
              value={selectedStandard}
              onChange={(e) => setSelectedStandard(e.target.value)}
              className={`w-full p-2 border rounded mb-3 text-sm transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
            >
              <option value="">Select a standard...</option>
              {activeStandards.map(standard => (
                <option key={standard.id} value={standard.id}>
                  {standard.name} {standard.completed ? '(completed)' : ''}
                </option>
              ))}
            </select>
            <button
              onClick={addStandardTask}
              disabled={!selectedStandard}
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 text-sm transition-colors duration-200"
            >
              Add Standard
            </button>
          </div>

          {/* Add Other Work */}
          <div className={`p-4 rounded-lg transition-colors duration-300 ${
            isDarkMode ? 'bg-purple-900/30 border border-purple-700' : 'bg-purple-50'
          }`}>
            <h3 className={`font-semibold mb-3 transition-colors duration-300 ${
              isDarkMode ? 'text-purple-300' : 'text-gray-800'
            }`}>Add Other Work</h3>
            <select
              value={selectedOtherWork}
              onChange={(e) => setSelectedOtherWork(e.target.value)}
              className={`w-full p-2 border rounded mb-3 text-sm transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
            >
              <option value="">Select other work...</option>
              {activeOtherWork.map(work => (
                <option key={work.id} value={work.id}>
                  {work.name} {work.completed ? '(completed)' : ''}
                </option>
              ))}
            </select>
            <button
              onClick={addOtherWorkTask}
              disabled={!selectedOtherWork}
              className="w-full py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-300 text-sm transition-colors duration-200"
            >
              Add Other Work
            </button>
          </div>

          {/* Add One-Off */}
          <div className={`p-4 rounded-lg transition-colors duration-300 ${
            isDarkMode ? 'bg-green-900/30 border border-green-700' : 'bg-green-50'
          }`}>
            <h3 className={`font-semibold mb-3 transition-colors duration-300 ${
              isDarkMode ? 'text-green-300' : 'text-gray-800'
            }`}>Add One-Off Task</h3>
            <input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="Task name..."
              className={`w-full p-2 border rounded mb-2 text-sm transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
            />
            <input
              type="number"
              value={newTaskTime}
              onChange={(e) => setNewTaskTime(parseInt(e.target.value) || 0)}
              placeholder="Minutes..."
              className={`w-full p-2 border rounded mb-3 text-sm transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
              min="1"
            />
            <button
              onClick={addCustomTask}
              disabled={!newTaskName.trim()}
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300 text-sm transition-colors duration-200"
            >
              Add Task
            </button>
          </div>

          {/* Add Repertoire */}
          <div className={`p-4 rounded-lg transition-colors duration-300 ${
            isDarkMode ? 'bg-orange-900/30 border border-orange-700' : 'bg-orange-50'
          }`}>
            <h3 className={`font-semibold mb-3 transition-colors duration-300 ${
              isDarkMode ? 'text-orange-300' : 'text-gray-800'
            }`}>Add Repertoire Review</h3>
            <select
              value={selectedRepertoire}
              onChange={(e) => setSelectedRepertoire(e.target.value)}
              className={`w-full p-2 border rounded mb-2 text-sm transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
            >
              {repertoireList.length === 0 ? (
                <option value="">No completed standards available</option>
              ) : (
                repertoireList.map(standard => (
                  <option key={standard.id} value={standard.id}>
                    {standard.name} {standard.lastWorkedOn ? 
                      `(${new Date(standard.lastWorkedOn).toLocaleDateString()})` : 
                      '(never practiced)'
                    }
                  </option>
                ))
              )}
            </select>
            <p className={`text-sm mb-3 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Suggested: {suggestedRepertoireTime} min (20% of total)
            </p>
            <button
              onClick={addRepertoireTask}
              disabled={!selectedRepertoire || repertoireList.length === 0}
              className="w-full py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:bg-gray-300 text-sm transition-colors duration-200"
            >
              Add Repertoire
            </button>
          </div>
        </div>

        {/* Session Tasks */}
        <div className="mb-6">
          <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>Session Tasks ({totalTime} minutes total)</h3>
          {sessionTasks.length === 0 ? (
            <p className={`text-center py-8 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>No tasks added yet</p>
          ) : (
            <>
              <div className={`mb-3 text-sm p-3 rounded-lg border transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-blue-900/30 text-blue-300 border-blue-700' 
                  : 'bg-blue-50 text-gray-600 border-blue-200'
              }`}>
                <strong>💡 Tip:</strong> Drag and drop tasks to reorder them in your practice session
              </div>
              <div className="space-y-1">
                {sessionTasks.map((task, index) => (
                  <div key={task.id}>
                    {/* Drop zone above each task */}
                    <div
                      onDragOver={handleDragOver}
                      onDragEnter={handleDragEnter}
                      onDrop={(e) => handleDropBetween(e, index)}
                      className={`h-6 transition-all duration-200 flex items-center justify-center ${
                        dragIndex !== null && dragIndex !== index 
                          ? 'bg-blue-100 border-2 border-dashed border-blue-400 rounded' 
                          : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-50'
                      }`}
                    >
                      {dragIndex !== null && dragIndex !== index && (
                        <span className="text-xs text-blue-600 font-medium">Drop here</span>
                      )}
                    </div>
                    
                    {/* The actual task */}
                    <div 
                      draggable="true"
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`flex items-center gap-4 p-3 rounded-lg cursor-move transition-all duration-200 ${
                        dragIndex === index 
                          ? 'bg-blue-100 border-2 border-blue-300 opacity-50' 
                          : isDarkMode
                            ? 'bg-gray-700 border border-gray-600 hover:bg-gray-600 hover:shadow-md'
                            : 'bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:shadow-md'
                      }`}
                    >
                      <div className={`cursor-move transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'
                      }`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="9" cy="12" r="1"/>
                          <circle cx="9" cy="5" r="1"/>
                          <circle cx="9" cy="19" r="1"/>
                          <circle cx="15" cy="12" r="1"/>
                          <circle cx="15" cy="5" r="1"/>
                          <circle cx="15" cy="19" r="1"/>
                        </svg>
                      </div>
                      <div className={`font-bold w-6 transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>{index + 1}</div>
                      <div className="flex-1">
                        <div className={`font-medium transition-colors duration-300 ${
                          isDarkMode ? 'text-white' : 'text-gray-800'
                        }`}>{task.name}</div>
                        <div className={`text-sm capitalize transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>{task.type.replace('_', ' ')}</div>
                      </div>
                      <input
                        type="number"
                        value={task.timeAllocated}
                        onChange={(e) => updateTaskTime(task.id, e.target.value)}
                        className={`w-20 p-2 border rounded transition-colors duration-300 ${
                          isDarkMode 
                            ? 'bg-gray-600 border-gray-500 text-white' 
                            : 'bg-white border-gray-300 text-gray-800'
                        }`}
                        min="1"
                      />
                      <span className={`text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>min</span>
                      <button
                        onClick={() => removeTask(task.id)}
                        className={`p-2 text-red-600 rounded transition-colors duration-200 ${
                          isDarkMode ? 'hover:bg-red-900/30' : 'hover:bg-red-100'
                        }`}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Drop zone at the end */}
                <div
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDrop={(e) => handleDropBetween(e, sessionTasks.length)}
                  className={`h-6 transition-all duration-200 flex items-center justify-center ${
                    dragIndex !== null 
                      ? 'bg-blue-100 border-2 border-dashed border-blue-400 rounded' 
                      : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-50'
                  }`}
                >
                  {dragIndex !== null && (
                    <span className="text-xs text-blue-600 font-medium">Drop here</span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleCreateSession}
            disabled={sessionTasks.length === 0}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 font-semibold transition-colors duration-200"
          >
            Start Practice Session
          </button>
        </div>
      </div>
    </div>
  );
};

const PracticeSession = ({ 
  session, 
  activeTask, 
  timeRemaining, 
  isTimerRunning, 
  onStartTimer, 
  onPauseTimer, 
  onResumeTimer, 
  onEndSession,
  formatTime,
  isDarkMode,
  toggleDarkMode,
  getSessionElapsedTime,
  getTaskElapsedTime,
  getSessionProgress,
  getRemainingTaskTime,
  taskTimeSpent
}) => {
  const currentTaskIndex = activeTask ? session.tasks.findIndex(t => t.id === activeTask.id) : -1;

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = currentTaskIndex > 0 ? currentTaskIndex - 1 : session.tasks.length - 1;
        onStartTimer(session.tasks[prevIndex]);
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = currentTaskIndex < session.tasks.length - 1 ? currentTaskIndex + 1 : 0;
        onStartTimer(session.tasks[nextIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTaskIndex, session.tasks, onStartTimer]);

  return (
    <div className={`max-w-4xl mx-auto p-6 min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className={`rounded-lg shadow-lg p-6 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-2xl font-bold transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>Practice Session</h1>
          <div className="flex gap-3 items-center">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="Toggle dark mode"
            >
              {isDarkMode ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd"/>
                </svg>
              )}
            </button>
            
            <button
              onClick={onEndSession}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              End Session
            </button>
          </div>
        </div>

        {/* Timer Display - Always Visible */}
        <div className={`p-6 rounded-lg mb-6 text-center transition-colors duration-300 ${
          isDarkMode ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50'
        }`}>
          {/* Session Time - Small display in top right */}
          <div className="flex justify-end mb-2">
            <div className={`text-right transition-colors duration-300 ${
              isDarkMode ? 'text-blue-400' : 'text-gray-600'
            }`}>
              <div className="text-xs font-medium">Session Time</div>
              <div className={`text-sm font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-blue-300' : 'text-blue-700'
              }`}>{formatTime(getSessionElapsedTime())}</div>
            </div>
          </div>

          {activeTask ? (
            <>
              <h2 className={`text-xl font-semibold mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-blue-300' : 'text-gray-800'
              }`}>{activeTask.name}</h2>
              
              {/* Remaining Task Time - Centered main display */}
              <div className="mb-6">
                <div className={`text-sm font-medium mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-blue-400' : 'text-gray-600'
                }`}>Remaining Task Time</div>
                <div className={`text-4xl font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-blue-300' : 'text-blue-600'
                }`}>{formatTime(getRemainingTaskTime())}</div>
              </div>

              <div className="flex justify-center gap-4">
                {!isTimerRunning ? (
                  <button
                    onClick={onResumeTimer}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Play size={20} />
                    {getTaskElapsedTime(activeTask.id) === 0 ? 'Start' : 'Resume'}
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
            </>
          ) : (
            <>
              <h2 className={`text-xl font-semibold mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-blue-300' : 'text-gray-800'
              }`}>Select a Task to Begin</h2>
              
              {/* Remaining Task Time - Centered main display */}
              <div className="mb-6">
                <div className={`text-sm font-medium mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-blue-400' : 'text-gray-600'
                }`}>Remaining Task Time</div>
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
            <strong>💡 Tip:</strong> Click on any task to make it current, or use arrow keys to navigate. The timer will control the selected task.
          </div>
          <div className="space-y-3">
            {session.tasks.map((task, index) => {
              const taskElapsed = getTaskElapsedTime(task.id);
              const taskAllocated = task.timeAllocated * 60;
              const isOverTime = taskElapsed > taskAllocated;
              const isCompleted = taskElapsed >= taskAllocated;
              
              return (
                <div 
                  key={task.id} 
                  onClick={() => onStartTimer(task)}
                  className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                    activeTask && activeTask.id === task.id 
                      ? (isDarkMode ? 'bg-blue-900/50 border-blue-500 ring-2 ring-blue-400' : 'bg-blue-100 border-blue-400 ring-2 ring-blue-300')
                      : isOverTime
                        ? (isDarkMode ? 'bg-orange-900/50 border-orange-700 hover:bg-orange-900/70' : 'bg-orange-100 border-orange-300 hover:bg-orange-200')
                        : isCompleted 
                          ? (isDarkMode ? 'bg-green-900/50 border-green-700 hover:bg-green-900/70' : 'bg-green-100 border-green-300 hover:bg-green-200')
                          : (isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100')
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors duration-300 ${
                    activeTask && activeTask.id === task.id
                      ? (isDarkMode ? 'bg-blue-600 border-blue-500 text-white' : 'bg-blue-500 border-blue-400 text-white')
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
                    ) : activeTask && activeTask.id === task.id ? (
                      <Play size={16} className="text-white" />
                    ) : (
                      <span className={`text-sm font-bold transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-800'
                      }`}>{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium transition-colors duration-300 ${
                      activeTask && activeTask.id === task.id
                        ? (isDarkMode ? 'text-blue-300' : 'text-blue-800')
                        : isOverTime
                          ? (isDarkMode ? 'text-orange-300' : 'text-orange-800')
                          : (isDarkMode ? 'text-white' : 'text-gray-800')
                    }`}>{task.name}</div>
                    <div className={`text-sm transition-colors duration-300 ${
                      activeTask && activeTask.id === task.id
                        ? (isDarkMode ? 'text-blue-400' : 'text-blue-600')
                        : isOverTime
                          ? (isDarkMode ? 'text-orange-400' : 'text-orange-600')
                          : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                    }`}>
                      {task.type.replace('_', ' ')} • {formatTime(taskElapsed)} / {formatTime(taskAllocated)}
                      {isOverTime && (
                        <span className="ml-1 font-medium">
                          (+{formatTime(taskElapsed - taskAllocated)} over)
                        </span>
                      )}
                    </div>
                  </div>
                  {activeTask && activeTask.id === task.id && (
                    <div className={`px-3 py-1 rounded text-xs font-medium ${
                      isDarkMode ? 'bg-blue-700 text-blue-200' : 'bg-blue-200 text-blue-800'
                    }`}>
                      Current
                    </div>
                  )}
                  {isOverTime && activeTask?.id !== task.id && (
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
            <span>{formatTime(getSessionElapsedTime())} / {formatTime(session.totalTime * 60)}</span>
          </div>
          <div className={`w-full rounded-full h-2 transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
          }`}>
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(getSessionProgress(), 100)}%` }}
            ></div>
          </div>
          <div className={`text-xs mt-1 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Progress based on completed allocated time for each task
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportsView = ({ practiceHistory, onBack, getWeeklyStats, isDarkMode, toggleDarkMode }) => {
  const weeklyStats = getWeeklyStats();
  
  const last30Days = practiceHistory.filter(session => {
    const sessionDate = new Date(session.date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return sessionDate >= thirtyDaysAgo;
  });

  const monthlyTotal = last30Days.reduce((sum, session) => sum + session.totalTime, 0);

  return (
    <div className={`max-w-6xl mx-auto p-6 min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className={`rounded-lg shadow-lg p-6 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-2xl font-bold transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>Practice Reports</h1>
          <div className="flex gap-3 items-center">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="Toggle dark mode"
            >
              {isDarkMode ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd"/>
                </svg>
              )}
            </button>
            
            <button
              onClick={onBack}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-500 text-white hover:bg-gray-600'
              }`}
            >
              Back to Overview
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className={`p-4 rounded-lg transition-colors duration-300 ${
            isDarkMode ? 'bg-blue-900/50 border border-blue-700' : 'bg-blue-50'
          }`}>
            <h3 className={`font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-blue-300' : 'text-blue-800'
            }`}>This Week</h3>
            <p className={`text-2xl font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-blue-400' : 'text-blue-600'
            }`}>{weeklyStats.sessions}</p>
            <p className={`text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-blue-400' : 'text-blue-600'
            }`}>sessions</p>
          </div>
          <div className={`p-4 rounded-lg transition-colors duration-300 ${
            isDarkMode ? 'bg-green-900/50 border border-green-700' : 'bg-green-50'
          }`}>
            <h3 className={`font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-green-300' : 'text-green-800'
            }`}>Weekly Total</h3>
            <p className={`text-2xl font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-green-400' : 'text-green-600'
            }`}>{weeklyStats.totalTime}</p>
            <p className={`text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-green-400' : 'text-green-600'
            }`}>minutes</p>
          </div>
          <div className={`p-4 rounded-lg transition-colors duration-300 ${
            isDarkMode ? 'bg-purple-900/50 border border-purple-700' : 'bg-purple-50'
          }`}>
            <h3 className={`font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-purple-300' : 'text-purple-800'
            }`}>Monthly Total</h3>
            <p className={`text-2xl font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-purple-400' : 'text-purple-600'
            }`}>{monthlyTotal}</p>
            <p className={`text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-purple-400' : 'text-purple-600'
            }`}>minutes</p>
          </div>
          <div className={`p-4 rounded-lg transition-colors duration-300 ${
            isDarkMode ? 'bg-orange-900/50 border border-orange-700' : 'bg-orange-50'
          }`}>
            <h3 className={`font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-orange-300' : 'text-orange-800'
            }`}>Avg Session</h3>
            <p className={`text-2xl font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-orange-400' : 'text-orange-600'
            }`}>{weeklyStats.avgSession}</p>
            <p className={`text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-orange-400' : 'text-orange-600'
            }`}>minutes</p>
          </div>
        </div>

        {/* Recent Sessions */}
        <div>
          <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>Recent Practice Sessions</h3>
          {practiceHistory.length === 0 ? (
            <p className={`text-center py-8 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>No practice sessions recorded yet</p>
          ) : (
            <div className="space-y-3">
              {practiceHistory.slice(0, 10).map(session => (
                <div key={session.id} className={`p-4 rounded-lg transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className={`font-medium transition-colors duration-300 ${
                        isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}>
                        {new Date(session.date).toLocaleDateString()} at {new Date(session.date).toLocaleTimeString()}
                      </div>
                      <div className={`text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {session.totalTime} minutes • {session.tasks.length} tasks
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${
                      session.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {session.completed ? 'Completed' : 'In Progress'}
                    </div>
                  </div>
                  <div className={`text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Tasks: {session.tasks.map(task => task.name).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JazzGuitarTracker;
