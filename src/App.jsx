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
    isTimerRunning, 
    taskTimeSpent, 
    taskTimers,
    sessionStarted,
    startSession,
    selectTask,
    startTimer,
    pauseTimer,
    resumeTimer,
    endSession,
    updateTask,
    getSessionElapsedTime,
    getTaskElapsedTime,
    getTaskRemainingTime,
    getActiveTaskRemainingTime,
    getSessionProgress,
    getRemainingTaskTime,
    getCappedTotalTimeSpent,
    getTotalTaskTimeSpent
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
      const darkMode = JSON.parse(savedDarkMode);
      setIsDarkMode(darkMode);
      
      // Apply dark mode to document body on initial load
      if (darkMode) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
    }
    
    if (savedStandards && JSON.parse(savedStandards).length > 0) {
      const parsedStandards = JSON.parse(savedStandards);
      setStandards(migrateStandardsData(parsedStandards));
    } else {
      // Initialize with rich sample data
      const sampleStandards = [
        {
          id: '1',
          name: 'Autumn Leaves',
          type: 'standard',
          steps: [true, true, true, true, true, true, false, false],
          completed: false,
          active: true,
          notes: 'Almost ready for performance! Need to work on improvisation over the bridge section. Shell chords are solid.',
          lastWorkedOn: new Date('2025-07-10T14:30:00.000Z')
        },
        {
          id: '2',
          name: 'All The Things You Are',
          type: 'standard',
          steps: [true, true, true, true, true, true, true, true],
          completed: true,
          active: true,
          notes: 'Completed and performance-ready! Great for demonstrating ii-V-I progressions. Posted video June 15th.',
          lastWorkedOn: new Date('2025-07-08T16:45:00.000Z')
        },
        {
          id: '3',
          name: 'Blue Bossa',
          type: 'standard',
          steps: [true, true, true, true, true, true, true, true],
          completed: true,
          active: true,
          notes: 'Perfect bossa nova example. Keep in rotation for Latin gigs. Students love this one.',
          lastWorkedOn: new Date('2025-07-05T10:20:00.000Z')
        },
        {
          id: '4',
          name: 'Stella By Starlight',
          type: 'standard',
          steps: [true, true, false, false, false, false, false, false],
          completed: false,
          active: true,
          notes: 'Complex harmony - taking time with this one. Need to really understand the chord relationships before moving forward.',
          lastWorkedOn: new Date('2025-07-09T19:15:00.000Z')
        },
        {
          id: '5',
          name: 'Take Five',
          type: 'standard',
          steps: [true, true, true, true, false, false, false, false],
          completed: false,
          active: true,
          notes: '5/4 time signature is challenging but getting more comfortable. Great for teaching odd meters.',
          lastWorkedOn: new Date('2025-07-07T13:45:00.000Z')
        },
        {
          id: '6',
          name: 'Body and Soul',
          type: 'standard',
          steps: [true, true, true, false, false, false, false, false],
          completed: false,
          active: false,
          notes: 'Put on hold to focus on other priorities. Will return to this next month.',
          lastWorkedOn: new Date('2025-06-20T11:30:00.000Z')
        },
        {
          id: '7',
          name: 'Girl from Ipanema',
          type: 'standard',
          steps: [true, true, true, true, true, true, true, true],
          completed: true,
          active: true,
          notes: 'Essential bossa nova tune. Perfect for wedding gigs and teaching basic Latin feel.',
          lastWorkedOn: new Date('2025-07-06T15:20:00.000Z')
        },
        {
          id: '8',
          name: 'Fly Me to the Moon',
          type: 'standard',
          steps: [true, true, true, true, true, false, false, false],
          completed: false,
          active: true,
          notes: 'Great beginner standard. Working through different key centers and comping patterns.',
          lastWorkedOn: new Date('2025-07-11T09:30:00.000Z')
        },
        {
          id: '9',
          name: 'Summertime',
          type: 'standard',
          steps: [true, false, false, false, false, false, false, false],
          completed: false,
          active: true,
          notes: 'Just started - love the blues progression. Will be great for exploring different jazz styles.',
          lastWorkedOn: new Date('2025-07-11T11:15:00.000Z')
        },
        {
          id: '10',
          name: 'Cherokee',
          type: 'standard',
          steps: [true, true, true, true, true, true, true, true],
          completed: true,
          active: false,
          notes: 'Advanced standard completed last year. Occasionally review for technique maintenance.',
          lastWorkedOn: new Date('2025-05-15T14:00:00.000Z')
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
          name: 'Galbraith Etude #5',
          type: 'other_work',
          description: 'Working on smooth voice leading and finger independence. Focus on measures 16-24.',
          completed: false,
          active: true,
          lastWorkedOn: new Date('2025-07-10T08:45:00.000Z')
        },
        {
          id: '2',
          name: 'Melodic Minor Scale System',
          type: 'other_work',
          description: 'Berklee fingering patterns - all positions across the neck. Currently on position 4.',
          completed: false,
          active: true,
          lastWorkedOn: new Date('2025-07-09T07:30:00.000Z')
        },
        {
          id: '3',
          name: 'Pat Martino - Sunny Transcription',
          type: 'other_work',
          description: 'Learning Pat\'s solo note-for-note. Amazing use of octaves and chromatic approach tones.',
          completed: false,
          active: true,
          lastWorkedOn: new Date('2025-07-08T20:15:00.000Z')
        },
        {
          id: '4',
          name: 'ii-V-I Licks in All Keys',
          type: 'other_work',
          description: 'Building comprehensive vocabulary. Completed C, F, Bb, Eb, Ab. Working on D major next.',
          completed: false,
          active: true,
          lastWorkedOn: new Date('2025-07-11T10:00:00.000Z')
        },
        {
          id: '5',
          name: 'Chord Melody Arrangement - Yesterday',
          type: 'other_work',
          description: 'Solo guitar arrangement for wedding gigs. Working on smooth bass lines.',
          completed: false,
          active: true,
          lastWorkedOn: new Date('2025-07-07T18:30:00.000Z')
        },
        {
          id: '6',
          name: 'Daily Chromatic Exercises',
          type: 'other_work',
          description: 'Spider exercises 1-4 for warm-up routine. Essential for maintaining finger strength.',
          completed: true,
          active: true,
          lastWorkedOn: new Date('2025-07-11T07:00:00.000Z')
        },
        {
          id: '7',
          name: 'Altered Dominant Substitutions',
          type: 'other_work',
          description: 'Working on tritone substitutions and altered scales. Theory and practical application.',
          completed: false,
          active: true,
          lastWorkedOn: new Date('2025-07-06T21:45:00.000Z')
        },
        {
          id: '8',
          name: 'Wes Montgomery Octave Technique',
          type: 'other_work',
          description: 'Learning the thumb technique and octave patterns from \'Four on Six\'.',
          completed: false,
          active: false,
          lastWorkedOn: new Date('2025-06-25T16:20:00.000Z')
        },
        {
          id: '9',
          name: 'Brazilian Comping Patterns',
          type: 'other_work',
          description: 'Bossa nova and samba rhythms. Essential for Latin jazz gigs.',
          completed: true,
          active: true,
          lastWorkedOn: new Date('2025-07-05T17:00:00.000Z')
        },
        {
          id: '10',
          name: 'Jazz Chord Voicings - Drop 2',
          type: 'other_work',
          description: 'Systematic study of drop 2 voicings across all string sets. Currently on string set 2-3-4-5.',
          completed: false,
          active: true,
          lastWorkedOn: new Date('2025-07-08T12:30:00.000Z')
        }
      ];
      setOtherWork(sampleOtherWork);
    }
    
    if (savedHistory) {
      setPracticeHistory(JSON.parse(savedHistory));
    } else {
      // Initialize with sample practice history
      const sampleHistory = [
        {
          id: 'session_1',
          date: new Date('2025-07-11T09:00:00.000Z'),
          tasks: [
            {
              id: 'task1',
              name: 'Daily Chromatic Exercises',
              type: 'other_work',
              timeAllocated: 10
            },
            {
              id: 'task2',
              name: 'Autumn Leaves',
              type: 'standard',
              timeAllocated: 25
            },
            {
              id: 'task3',
              name: 'ii-V-I Licks in All Keys',
              type: 'other_work',
              timeAllocated: 15
            },
            {
              id: 'task4',
              name: 'Fly Me to the Moon',
              type: 'standard',
              timeAllocated: 20
            },
            {
              id: 'task5',
              name: 'All The Things You Are (Repertoire)',
              type: 'standard',
              timeAllocated: 10
            }
          ],
          totalTime: 80,
          completed: true,
          endTime: new Date('2025-07-11T10:20:00.000Z'),
          taskTimeSpent: {
            task1: 720,
            task2: 1680,
            task3: 900,
            task4: 1200,
            task5: 600
          }
        },
        {
          id: 'session_2',
          date: new Date('2025-07-10T14:00:00.000Z'),
          tasks: [
            {
              id: 'task6',
              name: 'Stella By Starlight',
              type: 'standard',
              timeAllocated: 30
            },
            {
              id: 'task7',
              name: 'Galbraith Etude #5',
              type: 'other_work',
              timeAllocated: 20
            },
            {
              id: 'task8',
              name: 'Scale practice warmup',
              type: 'one_off',
              timeAllocated: 10
            }
          ],
          totalTime: 60,
          completed: true,
          endTime: new Date('2025-07-10T15:00:00.000Z'),
          taskTimeSpent: {
            task6: 1950,
            task7: 1200,
            task8: 450
          }
        },
        {
          id: 'session_3',
          date: new Date('2025-07-09T19:00:00.000Z'),
          tasks: [
            {
              id: 'task9',
              name: 'Melodic Minor Scale System',
              type: 'other_work',
              timeAllocated: 15
            },
            {
              id: 'task10',
              name: 'Take Five',
              type: 'standard',
              timeAllocated: 25
            },
            {
              id: 'task11',
              name: 'Pat Martino - Sunny Transcription',
              type: 'other_work',
              timeAllocated: 20
            },
            {
              id: 'task12',
              name: 'Blue Bossa (Repertoire)',
              type: 'standard',
              timeAllocated: 15
            }
          ],
          totalTime: 75,
          completed: true,
          endTime: new Date('2025-07-09T20:15:00.000Z'),
          taskTimeSpent: {
            task9: 900,
            task10: 1620,
            task11: 1200,
            task12: 780
          }
        },
        {
          id: 'session_4',
          date: new Date('2025-07-08T16:30:00.000Z'),
          tasks: [
            {
              id: 'task13',
              name: 'Jazz Chord Voicings - Drop 2',
              type: 'other_work',
              timeAllocated: 20
            },
            {
              id: 'task14',
              name: 'Autumn Leaves',
              type: 'standard',
              timeAllocated: 30
            },
            {
              id: 'task15',
              name: 'Metronome practice',
              type: 'one_off',
              timeAllocated: 10
            }
          ],
          totalTime: 60,
          completed: true,
          endTime: new Date('2025-07-08T17:30:00.000Z'),
          taskTimeSpent: {
            task13: 1200,
            task14: 1980,
            task15: 420
          }
        },
        {
          id: 'session_5',
          date: new Date('2025-07-07T13:15:00.000Z'),
          tasks: [
            {
              id: 'task16',
              name: 'Chord Melody Arrangement - Yesterday',
              type: 'other_work',
              timeAllocated: 25
            },
            {
              id: 'task17',
              name: 'Take Five',
              type: 'standard',
              timeAllocated: 20
            },
            {
              id: 'task18',
              name: 'Girl from Ipanema (Repertoire)',
              type: 'standard',
              timeAllocated: 10
            }
          ],
          totalTime: 55,
          completed: true,
          endTime: new Date('2025-07-07T14:10:00.000Z'),
          taskTimeSpent: {
            task16: 1500,
            task17: 1320,
            task18: 480
          }
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
    
    // Apply dark mode to document body
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
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
      // Add the imported session to collections
      addCollection(session);
      alert(`Successfully imported "${session.name}"`);
    }
  };

  const triggerCollectionImport = () => {
    if (collectionFileInputRef.current) {
      collectionFileInputRef.current.click();
    }
  };

  const formatTime = (seconds) => {
    // Handle NaN, undefined, or null values
    if (isNaN(seconds) || seconds === undefined || seconds === null) {
      return '0:00';
    }
    
    // Ensure seconds is a number and handle negative values
    const safeSeconds = Math.floor(Number(seconds));
    const absSeconds = Math.abs(safeSeconds);
    const mins = Math.floor(absSeconds / 60);
    const secs = absSeconds % 60;
    const timeString = `${mins}:${secs.toString().padStart(2, '0')}`;
    
    // Add negative sign for negative values
    return safeSeconds < 0 ? `-${timeString}` : timeString;
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
      totalTime: tasks.reduce((sum, task) => sum + (task.timeAllocated || 0), 0),
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
          taskTimers={taskTimers}
          isTimerRunning={isTimerRunning}
          onSelectTask={selectTask}
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
          getTaskRemainingTime={getTaskRemainingTime}
          getActiveTaskRemainingTime={getActiveTaskRemainingTime}
          getSessionProgress={getSessionProgress}
          getRemainingTaskTime={getRemainingTaskTime}
          getCappedTotalTimeSpent={getCappedTotalTimeSpent}
          getTotalTaskTimeSpent={getTotalTaskTimeSpent}
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
    <div className={`max-w-6xl mx-auto p-6 min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-white'
    }`}>
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