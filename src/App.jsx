import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Plus, Clock, Check, X, BarChart3, FileText, ChevronDown, ChevronUp, Eye, EyeOff, Download, Upload } from 'lucide-react';
import DarkModeToggle from "./components/DarkModeToggle";
import FilterButtons from "./components/FilterButtons";
import SectionSummary from "./components/SectionSummary";
import AddStandardForm from "./components/AddStandardForm";
import AddOtherWorkForm from "./components/AddOtherWorkForm";
import EditStandardSelector from "./components/EditStandardSelector";
import EditStandardForm from "./components/EditStandardForm";
import EditOtherWorkSelector from "./components/EditOtherWorkSelector";
import EditOtherWorkForm from "./components/EditOtherWorkForm";
import StandardCard from "./components/StandardCard";
import OtherWorkCard from "./components/OtherWorkCard";
import SessionSetup from "./components/SessionSetup";
import PracticeSession from "./components/PracticeSession";
import ReportsView from "./components/ReportsView";
import SessionSummaryModal from "./components/SessionSummaryModal";
import CollectionsView from "./components/CollectionsView";
import CollectionCard from "./components/CollectionCard";
import { TASK_TYPES, STANDARD_STEPS, SESSION_STATUS, COLLECTION_TYPES, SERIES_STATUS, DEPENDENCY_STATUS } from "./constants";
import { exportData, importData, exportCollection, importCollection } from "./utils/importExport";
import { getWeeklyStats, getCollectionStats, getSessionDependencyStatus, getSeriesProgress, getSeriesSessions, getAvailableSessions, getLockedSessions } from "./utils/stats";
import { useCollections } from "./hooks/useCollections";
import { usePracticeSession } from "./hooks/usePracticeSession";

const JazzGuitarTracker = () => {
  // State management
  const [standards, setStandards] = useState([]);
  const [otherWork, setOtherWork] = useState([]);
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
  const [showSessionSummary, setShowSessionSummary] = useState(false);
  const [sessionSummaryData, setSessionSummaryData] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isMainImporting, setIsMainImporting] = useState(false);
  
  // Collections state management
  const [showCollections, setShowCollections] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  
  const fileInputRef = useRef(null);
  const collectionFileInputRef = useRef(null);

  // Use custom hooks
  const { collections, addCollection, updateCollection, removeCollection, addSessionToCollection, updateSessionInCollection, removeSessionFromCollection } = useCollections();
  const { 
    session: currentSession, 
    activeTask, 
    timeRemaining, 
    isTimerRunning, 
    taskTimeSpent, 
    sessionStarted,
    startSession,
    startTimer,
    pauseTimer,
    resumeTimer,
    endSession,
    updateTask,
    getSessionElapsedTime,
    getTaskElapsedTime,
    getSessionProgress,
    getRemainingTaskTime,
    getCappedTotalTimeSpent
  } = usePracticeSession();

  // Migration function to handle the new comping step
  const migrateStandardsData = (standardsData) => {
    if (!standardsData || !Array.isArray(standardsData)) {
      return [];
    }
    
    const result = standardsData.map((standard) => {
      if (standard.steps && Array.isArray(standard.steps) && standard.steps.length === 7) {
        const newSteps = [...standard.steps];
        newSteps.splice(5, 0, false);
        return { ...standard, steps: newSteps };
      }
      if (standard.steps && Array.isArray(standard.steps) && standard.steps.length === 8) {
        return standard;
      }
      if (!standard.steps || !Array.isArray(standard.steps)) {
        return { ...standard, steps: new Array(8).fill(false) };
      }
      return standard;
    });
    
    return result;
  };

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedStandards = localStorage.getItem('jazzStandards');
    const savedOtherWork = localStorage.getItem('otherWork');
    const savedHistory = localStorage.getItem('practiceHistory');
    const savedDarkMode = localStorage.getItem('darkMode');
    
    if (savedDarkMode !== null) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
    
    if (savedStandards && JSON.parse(savedStandards).length > 0) {
      const parsedStandards = JSON.parse(savedStandards);
      setStandards(migrateStandardsData(parsedStandards));
    } else {
      // Initialize with sample data
      const sampleStandards = [
        {
          id: '1',
          name: 'Autumn Leaves',
          active: true,
          completed: false,
          steps: [false, false, false, false, false, false, false, false],
          lastWorkedOn: null
        },
        {
          id: '2',
          name: 'All of Me',
          active: true,
          completed: false,
          steps: [false, false, false, false, false, false, false, false],
          lastWorkedOn: null
        }
      ];
      setStandards(sampleStandards);
    }
    
    if (savedOtherWork && JSON.parse(savedOtherWork).length > 0) {
      setOtherWork(JSON.parse(savedOtherWork));
    } else {
      const sampleOtherWork = [
        {
          id: '1',
          name: 'Sight Reading',
          description: 'Practice reading new music',
          active: true,
          completed: false
        },
        {
          id: '2',
          name: 'Ear Training',
          description: 'Interval recognition and chord identification',
          active: true,
          completed: false
        }
      ];
      setOtherWork(sampleOtherWork);
    }
    
    if (savedHistory) {
      setPracticeHistory(JSON.parse(savedHistory));
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

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleExportData = () => {
    exportData(standards, otherWork, practiceHistory, collections);
  };

  const handleImportData = async (event) => {
    const data = await importData(event);
    if (data) {
      setStandards(migrateStandardsData(data.standards || []));
      setOtherWork(data.otherWork || []);
      setPracticeHistory(data.practiceHistory || []);
      setIsMainImporting(false);
    }
  };

  const triggerImport = () => {
    setIsMainImporting(true);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleExportCollection = (session) => {
    exportCollection(session);
  };

  const handleImportCollection = async (event) => {
    const session = await importCollection(event);
    if (session) {
      // Add to collections or handle as needed
      console.log('Imported collection:', session);
    }
  };

  const triggerCollectionImport = () => {
    if (collectionFileInputRef.current) {
      collectionFileInputRef.current.click();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetImportStates = () => {
    setIsImporting(false);
    setIsMainImporting(false);
  };

  const addStandard = (name) => {
    const newStandard = {
      id: Date.now().toString(),
      name,
      active: true,
      completed: false,
      steps: new Array(8).fill(false),
      lastWorkedOn: null
    };
    setStandards([...standards, newStandard]);
  };

  const addOtherWork = (name, description) => {
    const newWork = {
      id: Date.now().toString(),
      name,
      description,
      active: true,
      completed: false
    };
    setOtherWork([...otherWork, newWork]);
  };

  const updateStandardStep = (standardId, stepIndex) => {
    setStandards(standards.map(standard =>
      standard.id === standardId
        ? {
            ...standard,
            steps: standard.steps.map((step, index) =>
              index === stepIndex ? !step : step
            )
          }
        : standard
    ));
  };

  const updateStandard = (standardId, updates) => {
    setStandards(standards.map(standard =>
      standard.id === standardId ? { ...standard, ...updates } : standard
    ));
  };

  const updateOtherWork = (itemId, updates) => {
    setOtherWork(otherWork.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    ));
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
      date: new Date().toISOString(),
      tasks,
      totalTime: tasks.reduce((sum, task) => sum + task.timeAllocated, 0),
      completed: false
    };
    
    startSession(session);
    setShowNewSession(false);
    setView('session');
  };

  const handleEndSession = () => {
    const sessionData = endSession();
    if (sessionData) {
      setSessionSummaryData(sessionData);
      setShowSessionSummary(true);
    }
  };

  const completeSession = (stepCompletions, finalNotes) => {
    if (sessionSummaryData) {
      const { session, taskTimeSpent } = sessionSummaryData;
      
      // Update session with final notes
      const updatedSession = {
        ...session,
        completed: true,
        tasks: session.tasks.map(task => ({
          ...task,
          sessionNote: finalNotes[task.id] || task.sessionNote || ''
        }))
      };
      
      // Update standards with step completions
      const updatedStandards = standards.map(standard => {
        const standardTasks = session.tasks.filter(task => 
          task.type === TASK_TYPES.STANDARD && task.standardId === standard.id
        );
        
        if (standardTasks.length > 0) {
          const newSteps = [...standard.steps];
          Object.entries(stepCompletions).forEach(([key, completed]) => {
            const [standardId, stepIndex] = key.split('-');
            if (standardId === standard.id) {
              newSteps[parseInt(stepIndex)] = completed;
            }
          });
          
          return {
            ...standard,
            steps: newSteps,
            lastWorkedOn: new Date().toISOString()
          };
        }
        return standard;
      });
      
      setStandards(updatedStandards);
      setPracticeHistory([updatedSession, ...practiceHistory]);
      setShowSessionSummary(false);
      setSessionSummaryData(null);
      setView('overview');
    }
  };

  const getRepertoireRotation = () => {
    const activeCompletedStandards = standards.filter(s => s.completed && s.active);
    if (activeCompletedStandards.length === 0) return null;
    
    // Find the standard that hasn't been worked on the longest
    return activeCompletedStandards.reduce((oldest, current) => {
      const oldestDate = oldest.lastWorkedOn ? new Date(oldest.lastWorkedOn) : new Date(0);
      const currentDate = current.lastWorkedOn ? new Date(current.lastWorkedOn) : new Date(0);
      return oldestDate < currentDate ? oldest : current;
    });
  };

  const getFilteredStandards = () => {
    switch (standardsFilter) {
      case 'active':
        return standards.filter(s => s.active);
      case 'completed':
        return standards.filter(s => s.completed);
      case 'inactive':
        return standards.filter(s => !s.active);
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
      case 'inactive':
        return otherWork.filter(w => !w.active);
      default:
        return otherWork;
    }
  };

  // Render different views
  if (view === 'session' && showNewSession) {
    return <SessionSetup 
      standards={standards}
      otherWork={otherWork}
      practiceHistory={practiceHistory}
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
    return (
      <>
        <PracticeSession 
          session={currentSession}
          activeTask={activeTask}
          timeRemaining={timeRemaining}
          isTimerRunning={isTimerRunning}
          onStartTimer={startTimer}
          onPauseTimer={pauseTimer}
          onResumeTimer={resumeTimer}
          onEndSession={handleEndSession}
          onUpdateTask={updateTask}
          formatTime={formatTime}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          getSessionElapsedTime={getSessionElapsedTime}
          getTaskElapsedTime={getTaskElapsedTime}
          getSessionProgress={getSessionProgress}
          getRemainingTaskTime={getRemainingTaskTime}
          getCappedTotalTimeSpent={getCappedTotalTimeSpent}
          taskTimeSpent={taskTimeSpent}
          sessionStarted={sessionStarted}
        />
        {showSessionSummary && (
          <SessionSummaryModal
            isOpen={showSessionSummary}
            summaryData={sessionSummaryData}
            onComplete={completeSession}
            onCancel={() => setShowSessionSummary(false)}
            standards={standards}
            isDarkMode={isDarkMode}
            formatTime={formatTime}
          />
        )}
      </>
    );
  }

  if (view === 'reports') {
    return <ReportsView 
      practiceHistory={practiceHistory}
      onBack={() => setView('overview')}
      getWeeklyStats={() => getWeeklyStats(practiceHistory)}
      isDarkMode={isDarkMode}
      toggleDarkMode={toggleDarkMode}
    />;
  }

  if (showCollections) {
    return <CollectionsView 
      collections={collections}
      onBack={() => setShowCollections(false)}
      onSelectSession={(session) => {
        const practiceTasks = session.tasks.map(task => ({
          ...task,
          id: Date.now().toString() + Math.random(),
          practiceNote: task.practiceNote || '',
          sessionNote: task.sessionNote || ''
        }));
        createSession(practiceTasks);
        setShowCollections(false);
      }}
      onExportSession={handleExportCollection}
      onImportSession={handleImportCollection}
      setIsImporting={setIsImporting}
      isImporting={isImporting}
      triggerImport={triggerCollectionImport}
      isDarkMode={isDarkMode}
      toggleDarkMode={toggleDarkMode}
      getCollectionStats={() => getCollectionStats(collections)}
      getSessionDependencyStatus={(session) => getSessionDependencyStatus(session, collections)}
      getSeriesProgress={(seriesId) => getSeriesProgress(seriesId, collections)}
      getSeriesSessions={(seriesId) => getSeriesSessions(seriesId, collections)}
      getAvailableSessions={() => getAvailableSessions(collections)}
      getLockedSessions={() => getLockedSessions(collections)}
    />;
  }

  // Main overview view
  const weeklyStats = getWeeklyStats(practiceHistory);
  const nextRepertoire = getRepertoireRotation();
  const activeStandards = standards.filter(s => s.active);
  const activeOtherWork = otherWork.filter(w => w.active);
  const filteredStandards = getFilteredStandards();
  const filteredOtherWork = getFilteredOtherWork();

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen transition-colors duration-300">
      <div className={`rounded-lg shadow-lg p-6 mb-6 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-3xl font-bold transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>Jazz Guitar Practice Tracker</h1>
          <div className="flex gap-2 items-center">
            <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} square />
            
            <div className="flex gap-1 ml-2">
              <button
                onClick={handleExportData}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white hover:bg-gray-600 border border-gray-600' 
                    : 'bg-white text-slate-700 hover:bg-gray-100 border border-slate-200 shadow-sm'
                }`}
                title="Export your practice data"
              >
                <Download size={16} />
                Export
              </button>

              <button
                onClick={triggerImport}
                disabled={isMainImporting}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isMainImporting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : isDarkMode 
                      ? 'bg-gray-700 text-white hover:bg-gray-600 border border-gray-600' 
                      : 'bg-white text-slate-700 hover:bg-gray-100 border border-slate-200 shadow-sm'
                }`}
                title="Import practice data from backup"
              >
                {isMainImporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    Import
                  </>
                )}
              </button>
              
              <button
                onClick={() => setView('reports')}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white hover:bg-gray-600 border border-gray-600' 
                    : 'bg-white text-slate-700 hover:bg-gray-100 border border-slate-200 shadow-sm'
                }`}
              >
                <BarChart3 size={16} />
                Reports
              </button>
              
              <button
                onClick={() => setShowCollections(true)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white hover:bg-gray-600 border border-gray-600' 
                    : 'bg-white text-slate-700 hover:bg-gray-100 border border-slate-200 shadow-sm'
                }`}
              >
                <FileText size={16} />
                Collections
              </button>
              
              <button
                onClick={startNewSession}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-green-600 text-white hover:bg-green-700 shadow-sm'
                }`}
              >
                <Play size={16} />
                Start Session
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportData}
              style={{ display: 'none' }}
            />
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
            }`}>{weeklyStats.averageTime} min</p>
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
              {standardsExpanded ? (
                <ChevronDown size={20} className="transition-transform duration-200" />
              ) : (
                <ChevronUp size={20} className="transition-transform duration-200" />
              )}
              <h2 className={`text-2xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>Jazz Standards</h2>
            </button>
            {!standardsExpanded && (
              <SectionSummary items={standards} isDarkMode={isDarkMode} />
            )}
          </div>
          {standardsExpanded && (
            <div className="flex gap-3">
              <button
                onClick={() => setEditingStandard(true)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
              >
                <FileText size={20} />
                Edit Standard
              </button>
              <button
                onClick={() => setShowAddStandard(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus size={20} />
                Add Standard
              </button>
            </div>
          )}
        </div>

        {standardsExpanded && (
          <>
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
              {otherWorkExpanded ? (
                <ChevronDown size={20} className="transition-transform duration-200" />
              ) : (
                <ChevronUp size={20} className="transition-transform duration-200" />
              )}
              <h2 className={`text-2xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>Other Work</h2>
            </button>
            {!otherWorkExpanded && (
              <SectionSummary items={otherWork} isDarkMode={isDarkMode} />
            )}
          </div>
          {otherWorkExpanded && (
            <div className="flex gap-3">
              <button
                onClick={() => setEditingOtherWork(true)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
              >
                <FileText size={20} />
                Edit Other Work
              </button>
              <button
                onClick={() => setShowAddOtherWork(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus size={20} />
                Add Other Work
              </button>
            </div>
          )}
        </div>

        {otherWorkExpanded && (
          <>
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

export default JazzGuitarTracker;