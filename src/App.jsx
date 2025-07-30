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
import { TASK_TYPES, STANDARD_STEPS, SESSION_STATUS, COLLECTION_TYPES, SERIES_STATUS, DEPENDENCY_STATUS } from "./constants";

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
  const [showSessionSummary, setShowSessionSummary] = useState(false);
  const [sessionSummaryData, setSessionSummaryData] = useState(null);
  const [sessionStarted, setSessionStarted] = useState(false);
  
  // Collections state management
  const [collections, setCollections] = useState([]);
  const [showCollections, setShowCollections] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isMainImporting, setIsMainImporting] = useState(false);
  
  const timerRef = useRef(null);
  const fileInputRef = useRef(null);
  const collectionFileInputRef = useRef(null); // NEW: for collection import

  // Migration function to handle the new comping step
  const migrateStandardsData = (standardsData) => {
    // Early return if no data
    if (!standardsData || !Array.isArray(standardsData)) {
      return [];
    }
    
    const result = standardsData.map((standard) => {
      // Handle standards with 7 steps (old format) - add comping step
      if (standard.steps && Array.isArray(standard.steps) && standard.steps.length === 7) {
        // Insert comping step at index 5 (between "Target the 3rds" and "Practice improv")
        const newSteps = [...standard.steps];
        newSteps.splice(5, 0, false); // Add comping step as unchecked
        return { ...standard, steps: newSteps };
      }
      // Handle standards with 8 steps (new format) - no migration needed
      if (standard.steps && Array.isArray(standard.steps) && standard.steps.length === 8) {
        return standard; // Already in correct format
      }
      // Handle standards with no steps or invalid format - create default 8-step array
      if (!standard.steps || !Array.isArray(standard.steps)) {
        return { ...standard, steps: new Array(8).fill(false) };
      }
      // For any other case, return as-is
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
    const savedCollections = localStorage.getItem('collections');
    
    // Load dark mode preference
    if (savedDarkMode !== null) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
    
    if (savedStandards && JSON.parse(savedStandards).length > 0) {
      const parsedStandards = JSON.parse(savedStandards);
      setStandards(migrateStandardsData(parsedStandards));
    } else {
      // Initialize with some sample data (updated to 8 steps)
      const sampleStandards = [
        {
          id: '1',
          name: 'Autumn Leaves',
          type: TASK_TYPES.STANDARD,
          steps: [true, true, false, false, false, false, false, false],
          completed: false,
          active: true,
          notes: 'Working on the bridge section - need to focus on shell chords',
          lastWorkedOn: new Date('2025-06-28')
        },
        {
          id: '2',
          name: 'All The Things You Are',
          type: TASK_TYPES.STANDARD,
          steps: [true, true, true, true, true, true, true, true],
          completed: true,
          active: true,
          notes: 'Great for working on ii-V-I progressions. Posted video on June 20th.',
          lastWorkedOn: new Date('2025-06-25')
        },
        {
          id: '3',
          name: 'Body and Soul',
          type: TASK_TYPES.STANDARD,
          steps: [true, true, true, true, false, false, false, false],
          completed: false,
          active: false,
          notes: 'Need to work on the bridge section - put on hold for now',
          lastWorkedOn: new Date('2025-06-20')
        },
        {
          id: '4',
          name: 'Blue Bossa',
          type: TASK_TYPES.STANDARD,
          steps: [true, true, true, true, true, true, true, true],
          completed: true,
          active: false,
          notes: 'Completed last month but not actively reviewing. Good bossa nova example.',
          lastWorkedOn: new Date('2025-05-15')
        },
        {
          id: '5',
          name: 'Stella By Starlight',
          type: TASK_TYPES.STANDARD,
          steps: [true, false, false, false, false, false, false, false],
          completed: false,
          active: true,
          notes: 'Just started - complex harmony needs careful study',
          lastWorkedOn: new Date('2025-07-01')
        },
        {
          id: '6',
          name: 'Take Five',
          type: TASK_TYPES.STANDARD,
          steps: [true, true, true, false, false, false, false, false],
          completed: false,
          active: true,
          notes: 'Working on 5/4 time signature - getting comfortable with the feel',
          lastWorkedOn: new Date('2025-06-30')
        },
        {
          id: '7',
          name: 'Girl from Ipanema',
          type: TASK_TYPES.STANDARD,
          steps: [true, true, true, true, true, true, true, true],
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
    
    // Load collections
    if (savedCollections && JSON.parse(savedCollections).length > 0) {
      setCollections(JSON.parse(savedCollections));
    } else {
      // Initialize with empty collections for demo
      setCollections([]);
    }
  }, []);

  // Save data to localStorage whenever it changes (debounced to prevent performance issues)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem('jazzStandards', JSON.stringify(standards));
      } catch (error) {
        console.error('Error saving standards:', error);
      }
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [standards]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem('otherWork', JSON.stringify(otherWork));
      } catch (error) {
        console.error('Error saving other work:', error);
      }
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [otherWork]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem('practiceHistory', JSON.stringify(practiceHistory));
      } catch (error) {
        console.error('Error saving practice history:', error);
      }
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [practiceHistory]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('collections', JSON.stringify(collections));
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [collections]);

  // Session timer logic - runs when task timer is running
  useEffect(() => {
    if (sessionStartTime && currentSession && isTimerRunning) {
      const sessionTimerRef = setInterval(() => {
        setSessionRunningTime(prev => prev + 1);
      }, 1000);
      
      return () => clearInterval(sessionTimerRef);
    }
  }, [sessionStartTime, currentSession, isTimerRunning]);

  // Task timer logic
  useEffect(() => {
    if (isTimerRunning && activeTask) {
      timerRef.current = setInterval(() => {
        // Update time spent for current task
        setTaskTimeSpent(prev => ({
          ...prev,
          [activeTask.id]: (prev[activeTask.id] || 0) + 1
        }));

        // Update timeRemaining to show countdown or overtime
        const taskElapsed = (taskTimeSpent[activeTask.id] || 0) + 1; // +1 because we just updated it
        const taskAllocated = activeTask.timeAllocated * 60;
        const remaining = taskAllocated - taskElapsed;
        
        setTimeRemaining(remaining);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isTimerRunning, activeTask, taskTimeSpent]);

  // Add useEffect to control body background for dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.body.style.backgroundColor = '#111827'; // gray-900
      document.body.style.color = '#ffffff';
    } else {
      document.body.style.backgroundColor = '#f9fafb'; // gray-50
      document.body.style.color = '#111827';
    }
    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    };
  }, [isDarkMode]);

  // Reset stuck import states on component mount
  useEffect(() => {
    resetImportStates();
  }, []);

  // Periodic check for stuck import states (Brave workaround)
  useEffect(() => {
    if (!isMainImporting) return;
    
    const interval = setInterval(() => {
      // If import has been running for more than 5 seconds, force reset
      console.log('Periodic check: Import state still active, forcing reset...');
      simulateBraveWakeup();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isMainImporting]);





  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const exportData = () => {
    const exportObj = {
      standards,
      otherWork,
      practiceHistory,
      exportDate: new Date().toISOString(),
      version: "2.1",
      appName: "Jazz Guitar Practice Tracker"
    };
    
    const dataStr = JSON.stringify(exportObj, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `jazz-guitar-practice-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

    const importData = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Prevent multiple simultaneous imports
    if (isMainImporting) {
      return;
    }

    // Show loading state
    setIsMainImporting(true);

    try {
      // Read file
      const fileContent = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
      });

      // Parse JSON
      let importedData;
      try {
        importedData = JSON.parse(fileContent);
      } catch (parseError) {
        throw new Error('Invalid JSON format');
      }

      // Validate file format
      if (!importedData.appName || importedData.appName !== "Jazz Guitar Practice Tracker") {
        throw new Error('Invalid file format');
      }

      // Process data
      const updates = {};
      
      if (importedData.standards) {
        updates.standards = migrateStandardsData(importedData.standards);
      }
      if (importedData.otherWork) {
        updates.otherWork = importedData.otherWork;
      }
      if (importedData.practiceHistory) {
        updates.practiceHistory = importedData.practiceHistory;
      }

      // Apply updates
      if (updates.standards) setStandards(updates.standards);
      if (updates.otherWork) setOtherWork(updates.otherWork);
      if (updates.practiceHistory) setPracticeHistory(updates.practiceHistory);

      alert(`Successfully imported data from ${new Date(importedData.exportDate).toLocaleDateString()}`);

    } catch (error) {
      console.error('Import error:', error);
      let errorMessage = 'Error importing file. Please make sure it\'s a valid Jazz Guitar Practice Tracker backup file.';
      
      if (error.message === 'Invalid JSON format') {
        errorMessage = 'Invalid file format. Please make sure the file is a valid JSON backup.';
      } else if (error.message === 'Invalid file format') {
        errorMessage = 'This file does not appear to be a Jazz Guitar Practice Tracker backup.';
      }
      
      alert(errorMessage);
    } finally {
      // Reset loading state and clear file input
      setIsMainImporting(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const triggerImport = () => {
    fileInputRef.current?.click();
  };

  // Collection import/export functions
  const exportCollection = (session) => {
          const exportData = {
        version: "1.0",
        type: "collection",
      session: {
        ...session,
        id: undefined, // Remove internal ID
        status: SESSION_STATUS.PENDING, // Reset status
        completed: false,
        completionDate: null,
        studentNotes: ''
      },
      exportDate: new Date().toISOString(),
      teacherName: session.teacherName
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `collection-${session.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importCollection = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    // Prevent multiple simultaneous imports
    if (isImporting) {
      return;
    }

    // Set loading state
    setIsImporting(true);

    // Use synchronous FileReader to avoid async complexity
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        let importedData;
        try {
          importedData = JSON.parse(e.target.result);
        } catch (parseError) {
          throw new Error('Invalid JSON format');
        }
        
        // Check if this is a single session or multiple sessions
        if (importedData.type === 'teacher_session') {
          // Single session import
          const session = {
            ...importedData.session,
            id: `ts_${Date.now()}`,
            assignedDate: new Date().toISOString(),
            status: SESSION_STATUS.PENDING
          };

          // Process synchronously
          setCollections(prev => [session, ...prev]);

          alert(`Successfully imported "${session.title}" from ${importedData.teacherName}`);
          
        } else if (importedData.type === 'teacher_session_series') {
          // Multiple sessions import
          const sessions = importedData.sessions || [];
          
          if (sessions.length === 0) {
            alert('No sessions found in the imported file.');
            throw new Error('No sessions found');
          }

          // Generate unique timestamp for this import
          const importTimestamp = Date.now();
          
          // Process all sessions synchronously
          const processedSessions = sessions.map((session, index) => {
            const sessionId = `ts_${importTimestamp}_${index}`;
            
            // Simplified prerequisite mapping
            const prerequisites = session.prerequisites ? 
              session.prerequisites.map(prereq => {
                const prereqIndex = sessions.findIndex(s => 
                  s.title.includes(prereq.replace('ts_', '').replace('week', 'Week '))
                );
                return prereqIndex >= 0 ? `ts_${importTimestamp}_${prereqIndex}` : prereq;
              }) : [];
            
            return {
              ...session,
              id: sessionId,
              assignedDate: new Date().toISOString(),
              status: SESSION_STATUS.PENDING,
              completed: false,
              completionDate: null,
              studentNotes: '',
              prerequisites
            };
          });

          // Update state synchronously
          setCollections(prev => [...processedSessions, ...prev]);
          
          const seriesName = importedData.seriesName || 'Series';
          alert(`Successfully imported ${sessions.length} sessions from "${seriesName}" by ${importedData.teacherName || 'your teacher'}`);
          
        } else {
          alert('This file does not appear to be a valid collection file.');
          throw new Error('Invalid collection format');
        }
        
      } catch (error) {
        console.error('Import error:', error);
        let errorMessage = 'Error importing collection file. Please check the file format.';
        
        if (error.message === 'Invalid JSON format') {
          errorMessage = 'Invalid file format. Please make sure the file is a valid JSON.';
        } else if (error.message === 'Invalid collection format') {
          errorMessage = 'This file does not appear to be a valid collection file.';
        } else if (error.message === 'No sessions found') {
          errorMessage = 'No sessions found in the imported file.';
        }
        
        alert(errorMessage);
      } finally {
        // Always reset loading state and clear file input
        setIsImporting(false);
        event.target.value = '';
      }
    };
    
    reader.onerror = () => {
      console.error('File read error');
      alert('Error reading the file. Please try again.');
      setIsImporting(false);
      event.target.value = '';
    };
    
    // Start reading the file
    reader.readAsText(file);
  };

  const triggerCollectionImport = () => {
    // Reset any stuck states before starting new import
    if (isImporting) {
      setIsImporting(false);
    }
    collectionFileInputRef.current?.click(); // Use the new ref
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Reset import states on component mount
  const resetImportStates = () => {
    setIsMainImporting(false);
    setIsImporting(false);
  };





  const addStandard = (name) => {
    const newStandard = {
      id: Date.now().toString(),
      name,
      type: TASK_TYPES.STANDARD,
      steps: new Array(8).fill(false),
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
    setSessionStarted(false);
    // Set view to session to show the practice session
    setView('session');
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
      const remainingTime = (task.timeAllocated * 60) - timeSpent;
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
    // Set session start time if not already set (this starts the session timer)
    if (!sessionStartTime) {
      setSessionStartTime(new Date());
      setSessionRunningTime(0);
      setSessionStarted(true);
    }
    setIsTimerRunning(true);
    setLastTimerStart(new Date());
  };

  const endSession = () => {
    if (currentSession) {
      // Prepare data for summary modal
      const summaryData = {
        session: currentSession,
        taskTimeSpent: { ...taskTimeSpent },
        sessionElapsed: getSessionElapsedTime()
      };
      
      setSessionSummaryData(summaryData);
      setShowSessionSummary(true);
      
      // Note: Don't actually end the session yet - the modal will handle that
    }
  };

  const completeSession = (stepCompletions, finalNotes) => {
    if (currentSession && sessionSummaryData) {
      // Update standards with completed steps
      if (stepCompletions && Object.keys(stepCompletions).length > 0) {
        setStandards(standards.map(standard => {
          if (stepCompletions[standard.id]) {
            const stepIndex = stepCompletions[standard.id];
            const newSteps = [...standard.steps];
            newSteps[stepIndex] = true;
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
      }
      
      // Create completed session record
      const completedSession = {
        ...currentSession,
        completed: true,
        endTime: new Date(),
        taskTimeSpent: sessionSummaryData.taskTimeSpent,
        finalNotes: finalNotes || {},
        stepCompletions: stepCompletions || {}
      };
      
      setPracticeHistory([completedSession, ...practiceHistory]);
      
      // Reset session state
      setCurrentSession(null);
      setActiveTask(null);
      setIsTimerRunning(false);
      setTaskTimeSpent({});
      setSessionStartTime(null);
      setSessionRunningTime(0);
      setLastTimerStart(null);
      setShowSessionSummary(false);
      setSessionSummaryData(null);
      
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

  const getCappedTotalTimeSpent = () => {
    if (!currentSession) return 0;
    return currentSession.tasks.reduce((sum, task) => {
      const spent = taskTimeSpent[task.id] || 0;
      const allocated = task.timeAllocated * 60;
      return sum + Math.min(spent, allocated);
    }, 0);
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

  // Collection utility functions
  const getCollectionStats = () => {
    const completedSessions = collections.filter(s => s.completed);
    const overdueSessions = collections.filter(s => 
      s.status === SESSION_STATUS.PENDING && 
      new Date(s.dueDate) < new Date()
    );
    
    return {
            total: collections.length,
      completed: completedSessions.length,
      overdue: overdueSessions.length,
      completionRate: collections.length > 0
        ? Math.round((completedSessions.length / collections.length) * 100)
        : 0
    };
  };

  // Helper functions for series and dependencies
  const getSessionDependencyStatus = (session) => {
    if (!session.prerequisites || session.prerequisites.length === 0) {
      return DEPENDENCY_STATUS.AVAILABLE;
    }
    
    const completedSessions = collections.filter(s => s.completed);
    const completedIds = completedSessions.map(s => s.id);
    
    const unmetPrerequisites = session.prerequisites.filter(prereq => 
      !completedIds.includes(prereq)
    );
    
    if (unmetPrerequisites.length > 0) {
      return DEPENDENCY_STATUS.LOCKED;
    }
    
    return DEPENDENCY_STATUS.AVAILABLE;
  };

  const getSeriesProgress = (seriesId) => {
    const seriesSessions = collections.filter(s => s.seriesId === seriesId);
    if (seriesSessions.length === 0) return SERIES_STATUS.NOT_STARTED;
    
    const completedSessions = seriesSessions.filter(s => s.completed);
    if (completedSessions.length === seriesSessions.length) {
      return SERIES_STATUS.COMPLETED;
    }
    
    return SERIES_STATUS.IN_PROGRESS;
  };

  const getSeriesSessions = (seriesId) => {
    return collections
      .filter(s => s.seriesId === seriesId)
      .sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0));
  };

  const getAvailableSessions = () => {
    return collections.filter(session => {
      const dependencyStatus = getSessionDependencyStatus(session);
      return dependencyStatus === DEPENDENCY_STATUS.AVAILABLE && !session.completed;
    });
  };

  const getLockedSessions = () => {
    return collections.filter(session => {
      const dependencyStatus = getSessionDependencyStatus(session);
      return dependencyStatus === DEPENDENCY_STATUS.LOCKED && !session.completed;
    });
  };

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
          onEndSession={endSession}
          onUpdateTask={(taskId, updates) => {
            setCurrentSession(prev => ({
              ...prev,
              tasks: prev.tasks.map(task =>
                task.id === taskId ? { ...task, ...updates } : task
              )
            }));
          }}
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
        {/* Session Summary Modal */}
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
      getWeeklyStats={getWeeklyStats}
      isDarkMode={isDarkMode}
      toggleDarkMode={toggleDarkMode}
    />;
  }

  if (showCollections) {
    return <CollectionsView 
      collections={collections}
      onBack={() => setShowCollections(false)}
      onSelectSession={(session) => {
        // Convert collection tasks to practice session format
        const practiceTasks = session.tasks.map(task => ({
          ...task,
          id: Date.now().toString() + Math.random(), // Generate new IDs
          practiceNote: task.practiceNote || '',
          sessionNote: task.sessionNote || ''
        }));
        
        // Create and start the session directly
        createSession(practiceTasks);
        setShowCollections(false);
      }}
      onExportSession={exportCollection}
      onImportSession={importCollection}
      setIsImporting={setIsImporting}
      isImporting={isImporting}
      triggerImport={triggerCollectionImport}
      isDarkMode={isDarkMode}
      toggleDarkMode={toggleDarkMode}
      getCollectionStats={getCollectionStats}
      getSessionDependencyStatus={getSessionDependencyStatus}
      getSeriesProgress={getSeriesProgress}
      getSeriesSessions={getSeriesSessions}
      getAvailableSessions={getAvailableSessions}
      getLockedSessions={getLockedSessions}
    />;
  }

  const weeklyStats = getWeeklyStats();
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
		      {/* Dark Mode Toggle - separate from main actions */}
		      <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} square />
		      
		      {/* Main action buttons - grouped and consistent */}
		      <div className="flex gap-1 ml-2">
			<button
			  onClick={exportData}
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
			onChange={importData}
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
              {standardsExpanded ? (
                <ChevronDown 
                  size={20} 
                  className="transition-transform duration-200"
                />
              ) : (
                <ChevronUp 
                  size={20} 
                  className="transition-transform duration-200"
                />
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
                onClick={() => {
                  setShowAddStandard(true);
                }}
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
                <ChevronDown 
                  size={20} 
                  className="transition-transform duration-200"
                />
              ) : (
                <ChevronUp 
                  size={20} 
                  className="transition-transform duration-200"
                />
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
                onClick={() => {
                  setShowAddOtherWork(true);
                }}
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





const StandardCard = ({ standard, isDarkMode }) => {
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
              <span className={`px-2 py-1 text-xs rounded ${
                standard.completed 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {standard.completed ? 'Completed' : 'Uncompleted'}
              </span>
              <span className={`px-2 py-1 text-xs rounded flex items-center gap-1 ${
                standard.active 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {standard.active ? <Eye size={12} /> : <EyeOff size={12} />}
                {standard.active ? 'Active' : 'Inactive'}
              </span>
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
          <div key={index} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={standard.steps[index]}
              disabled
              className="rounded"
            />
            <span className={`text-sm transition-colors duration-300 ${
              standard.steps[index] 
                ? (isDarkMode ? 'line-through text-gray-500' : 'line-through text-gray-500')
                : (isDarkMode ? 'text-gray-300' : 'text-gray-800')
            }`}>
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const OtherWorkCard = ({ item, isDarkMode }) => {
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
              <span className={`px-2 py-1 text-xs rounded ${
                item.completed 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {item.completed ? 'Completed' : 'Uncompleted'}
              </span>
              <span className={`px-2 py-1 text-xs rounded flex items-center gap-1 ${
                item.active 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {item.active ? <Eye size={12} /> : <EyeOff size={12} />}
                {item.active ? 'Active' : 'Inactive'}
              </span>
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









const SessionSetup = ({ standards, otherWork, practiceHistory, onCreateSession, onCancel, getRepertoireRotation, isDarkMode, toggleDarkMode }) => {
  const [sessionTasks, setSessionTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskTime, setNewTaskTime] = useState(20);
  const [selectedStandard, setSelectedStandard] = useState('');
  const [selectedOtherWork, setSelectedOtherWork] = useState('');
  const [selectedRepertoire, setSelectedRepertoire] = useState('');
  const [dragIndex, setDragIndex] = useState(null);
  const [expandedTasks, setExpandedTasks] = useState(new Set());
  const [showStandardTimeInput, setShowStandardTimeInput] = useState(false);
  const [standardTimeInput, setStandardTimeInput] = useState(25);
  const [showOtherWorkTimeInput, setShowOtherWorkTimeInput] = useState(false);
  const [otherWorkTimeInput, setOtherWorkTimeInput] = useState(20);
  const [showRepertoireChoice, setShowRepertoireChoice] = useState(false);
  const [lastSessionTemplate, setLastSessionTemplate] = useState(null);
  const [repertoireChoices, setRepertoireChoices] = useState({});

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
        timeAllocated: standardTimeInput,
        standardId: standard.id,
        focusStep: null,        // NEW: Focus step selection
        practiceNote: '',       // NEW: Practice note
        sessionNote: ''         // NEW: Session note (updated during practice)
      };
      setSessionTasks([...sessionTasks, task]);
      setSelectedStandard('');
      setShowStandardTimeInput(false);
      setStandardTimeInput(25); // Reset to default
    }
  };

  const addOtherWorkTask = () => {
    if (selectedOtherWork) {
      const work = otherWork.find(w => w.id === selectedOtherWork);
      const task = {
        id: Date.now().toString(),
        name: work.name,
        type: TASK_TYPES.OTHER_WORK,
        timeAllocated: otherWorkTimeInput,
        otherWorkId: work.id,
        practiceNote: '',       // NEW: Practice note
        sessionNote: ''         // NEW: Session note
      };
      setSessionTasks([...sessionTasks, task]);
      setSelectedOtherWork('');
      setShowOtherWorkTimeInput(false);
      setOtherWorkTimeInput(20); // Reset to default
    }
  };

  const addCustomTask = () => {
    if (newTaskName.trim()) {
      const task = {
        id: Date.now().toString(),
        name: newTaskName.trim(),
        type: TASK_TYPES.ONE_OFF,
        timeAllocated: newTaskTime,
        practiceNote: '',       // NEW: Practice note
        sessionNote: ''         // NEW: Session note
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
        standardId: repertoire.id,
        focusStep: null,        // NEW: Focus step selection
        practiceNote: '',       // NEW: Practice note
        sessionNote: ''         // NEW: Session note
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
      task.id === taskId ? { 
        ...task, 
        timeAllocated: newTime === '' ? '' : parseInt(newTime) || 0 
      } : task
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

  // Helper functions for enhanced task management
  const toggleTaskExpanded = (taskId) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const updateTaskField = (taskId, field, value) => {
    setSessionTasks(sessionTasks.map(task =>
      task.id === taskId ? { ...task, [field]: value } : task
    ));
  };

  const getStepStatus = (standard, stepIndex) => {
    if (!standard || !standard.steps) return '○';
    if (standard.steps[stepIndex]) return '✅';
    return '○';
  };

  const getStepLabel = (stepIndex) => {
    const labels = [
      'Staples', 'Shells', 'Scales', 'Arpeggios', 
      '3rds', 'Comping', 'Improv', 'Video'
    ];
    const safeStepIndex = stepIndex || 0;
    return labels[safeStepIndex] || `Step ${safeStepIndex + 1}`;
  };

  // Get the most recent completed session
  const getLastSession = () => {
    const completedSessions = practiceHistory.filter(session => session.completed);
    return completedSessions.length > 0 ? completedSessions[0] : null;
  };

  // Handle "Use Last Session" button click
  const handleUseLastSession = () => {
    const lastSession = getLastSession();
    if (!lastSession) {
      alert('No completed sessions found to use as template.');
      return;
    }

    // Check if the last session has any repertoire tasks
    const repertoireTasks = lastSession.tasks.filter(task => 
      task.name && task.name.includes('(Repertoire)')
    );

    if (repertoireTasks.length > 0) {
      // Initialize choices for each repertoire task
      const initialChoices = {};
      repertoireTasks.forEach((task, index) => {
        initialChoices[task.id] = 'keep';
      });
      setRepertoireChoices(initialChoices);
      
      // Show repertoire choice modal
      setLastSessionTemplate(lastSession);
      setShowRepertoireChoice(true);
    } else {
      // Apply template directly
      applyLastSessionTemplate(lastSession);
    }
  };

  // Apply the last session template with repertoire choices
  const applyLastSessionTemplate = (session, repertoireChoices = {}) => {
    const newTasks = session.tasks.filter(task => {
      // Remove repertoire tasks that were marked for removal
      if (task.name && task.name.includes('(Repertoire)')) {
        const choice = repertoireChoices[task.id];
        return choice !== 'remove';
      }
      return true;
    }).map(task => {
      const newTask = {
        id: Date.now().toString() + Math.random(),
        name: task.name,
        type: task.type,
        timeAllocated: task.timeAllocated,
        practiceNote: task.practiceNote || '',
        sessionNote: ''
      };
      // Copy other properties
      if (task.standardId) newTask.standardId = task.standardId;
      if (task.otherWorkId) newTask.otherWorkId = task.otherWorkId;
      if (task.focusStep !== undefined) newTask.focusStep = task.focusStep;
      return newTask;
    });
    setSessionTasks(newTasks);
    setShowRepertoireChoice(false);
    setLastSessionTemplate(null);
    setRepertoireChoices({});
  };

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen transition-colors duration-300">
      <div className={`rounded-lg shadow-lg p-6 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className={`text-2xl font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>Setup Practice Session</h1>
            {/* Removed Use Last Session button from here */}
          </div>
          <div className="flex gap-3 items-center">
            {/* Dark Mode Toggle */}
            <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} square />
            
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
          <div className={`p-4 rounded-lg border-2 transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gray-800 border-blue-500 hover:border-blue-300' 
              : 'bg-white border-blue-300 hover:border-blue-400'
          }`}>
            <h3 className={`font-semibold mb-3 transition-colors duration-300 ${
              isDarkMode ? 'text-blue-300' : 'text-blue-700'
            }`}>Add Standard</h3>
            <select
              value={selectedStandard}
              onChange={(e) => {
                setSelectedStandard(e.target.value);
                if (e.target.value) {
                  setShowStandardTimeInput(true);
                } else {
                  setShowStandardTimeInput(false);
                }
              }}
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
            {showStandardTimeInput && (
              <div className="mb-3">
                <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Time allocation (minutes)
                </label>
                <input
                  type="number"
                  value={standardTimeInput}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      setStandardTimeInput('');
                    } else {
                      const numValue = parseInt(value);
                      if (!isNaN(numValue)) {
                        setStandardTimeInput(numValue);
                      }
                    }
                  }}
                  onFocus={(e) => e.target.select()}
                  className={`w-full p-2 border rounded text-sm transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                  min="1"
                  max="120"
                />
              </div>
            )}
            <button
              onClick={addStandardTask}
              disabled={!selectedStandard}
              className={`w-full py-2 rounded text-sm transition-colors duration-200 ${
                isDarkMode
                  ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-600 disabled:text-gray-400'
                  : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500'
              }`}
            >
              Add Standard
            </button>
          </div>

          {/* Add Other Work */}
          <div className={`p-4 rounded-lg border-2 transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gray-800 border-purple-500 hover:border-purple-300' 
              : 'bg-white border-purple-300 hover:border-purple-400'
          }`}>
            <h3 className={`font-semibold mb-3 transition-colors duration-300 ${
              isDarkMode ? 'text-purple-300' : 'text-purple-700'
            }`}>Add Other Work</h3>
            <select
              value={selectedOtherWork}
              onChange={(e) => {
                setSelectedOtherWork(e.target.value);
                if (e.target.value) {
                  setShowOtherWorkTimeInput(true);
                } else {
                  setShowOtherWorkTimeInput(false);
                }
              }}
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
            {showOtherWorkTimeInput && (
              <div className="mb-3">
                <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Time allocation (minutes)
                </label>
                <input
                  type="number"
                  value={otherWorkTimeInput}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      setOtherWorkTimeInput('');
                    } else {
                      const numValue = parseInt(value);
                      if (!isNaN(numValue)) {
                        setOtherWorkTimeInput(numValue);
                      }
                    }
                  }}
                  onFocus={(e) => e.target.select()}
                  className={`w-full p-2 border rounded text-sm transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                  min="1"
                  max="120"
                />
              </div>
            )}
            <button
              onClick={addOtherWorkTask}
              disabled={!selectedOtherWork}
              className={`w-full py-2 rounded text-sm transition-colors duration-200 ${
                isDarkMode
                  ? 'bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-600 disabled:text-gray-400'
                  : 'bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-300 disabled:text-gray-500'
              }`}
            >
              Add Other Work
            </button>
          </div>

          {/* Add One-Off */}
          <div className={`p-4 rounded-lg border-2 transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gray-800 border-green-500 hover:border-green-300' 
              : 'bg-white border-green-300 hover:border-green-400'
          }`}>
            <h3 className={`font-semibold mb-3 transition-colors duration-300 ${
              isDarkMode ? 'text-green-300' : 'text-green-700'
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
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setNewTaskTime('');
                } else {
                  const numValue = parseInt(value);
                  if (!isNaN(numValue)) {
                    setNewTaskTime(numValue);
                  }
                }
              }}
              onFocus={(e) => e.target.select()}
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
              className={`w-full py-2 rounded text-sm transition-colors duration-200 ${
                isDarkMode
                  ? 'bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-600 disabled:text-gray-400'
                  : 'bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500'
              }`}
            >
              Add Task
            </button>
          </div>

          {/* Add Repertoire */}
          <div className={`p-4 rounded-lg border-2 transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gray-800 border-orange-500 hover:border-orange-300' 
              : 'bg-white border-orange-300 hover:border-orange-400'
          }`}>
            <h3 className={`font-semibold mb-3 transition-colors duration-300 ${
              isDarkMode ? 'text-orange-300' : 'text-orange-700'
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
              className={`w-full py-2 rounded text-sm transition-colors duration-200 ${
                isDarkMode
                  ? 'bg-orange-600 text-white hover:bg-orange-700 disabled:bg-gray-600 disabled:text-gray-400'
                  : 'bg-orange-600 text-white hover:bg-orange-700 disabled:bg-gray-300 disabled:text-gray-500'
              }`}
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
            <div className="text-center py-8">
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>No tasks added yet.</p>
              {getLastSession() && (
                <button
                  onClick={handleUseLastSession}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors duration-200 ${
                    isDarkMode
                      ? 'border-blue-500 text-blue-300 hover:bg-blue-900/30'
                      : 'border-blue-600 text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Use Last Session as Template
                </button>
              )}
            </div>
          ) : (
            <>
              <div className={`mb-3 text-sm p-3 rounded-lg border transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-blue-900/30 text-blue-300 border-blue-700' 
                  : 'bg-blue-50 text-gray-600 border-blue-200'
              }`}>
                <strong>💡 Tip:</strong> Drag tasks to reorder • Click any task to add practice notes
              </div>
              <div className="space-y-1">
                {sessionTasks.map((task, index) => {
                  const isExpanded = expandedTasks.has(task.id);
                  const isStandard = task.type === TASK_TYPES.STANDARD;
                  const standard = isStandard && task.standardId ? 
                    standards.find(s => s.id === task.standardId) : null;
                  
                  return (
                    <div key={task.id}>
                      {/* Drop zone above each task - PRESERVE EXISTING */}
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
                      
                      {/* ENHANCED task card */}
                      <div 
                        draggable="true"
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`rounded-lg transition-all duration-200 ${
                          dragIndex === index 
                            ? 'bg-blue-100 border-2 border-blue-300 opacity-50' 
                            : isDarkMode
                              ? 'bg-gray-700 border border-gray-600 hover:bg-gray-500 hover:shadow-md'
                              : 'bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:shadow-md'
                        }`}
                      >
                        {/* Task header - NOW CLICKABLE to expand */}
                        <div 
                          onClick={() => toggleTaskExpanded(task.id)}
                          className={`flex items-center gap-4 p-3 cursor-pointer rounded-t-lg transition-all duration-200 ${
                            isExpanded 
                              ? (isDarkMode ? 'bg-blue-900/30 border-b border-blue-700' : 'bg-blue-50 border-b border-blue-200')
                              : (isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-50')
                          }`}
                        >
                          {/* PRESERVE existing drag handle */}
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
                            }`}>
                              {task.name}
                              {task.type === TASK_TYPES.STANDARD && task.focusStep !== null && task.focusStep !== undefined && (
                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  Step {(task.focusStep || 0) + 1}
                                </span>
                              )}
                            </div>
                            <div className={`text-sm capitalize transition-colors duration-300 ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {task.type.replace('_', ' ')}
                              {task.practiceNote && (
                                <span className="ml-2 text-xs">📝</span>
                              )}
                            </div>
                          </div>
                          {/* PRESERVE existing time input and remove button */}
                          <input
                            type="number"
                            value={task.timeAllocated}
                            onChange={(e) => updateTaskTime(task.id, e.target.value)}
                            onClick={(e) => e.stopPropagation()}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              removeTask(task.id);
                            }}
                            className={`p-2 text-red-600 rounded transition-colors duration-200 ${
                              isDarkMode ? 'hover:bg-red-900/30' : 'hover:bg-red-100'
                            }`}
                          >
                            <X size={16} />
                          </button>
                          {/* NEW: Enhanced expand indicator */}
                          <div className={`flex items-center gap-1 text-sm transition-colors duration-200 ${
                            isExpanded ? 'text-blue-600' : 'text-gray-500'
                          }`}>
                            <span>{isExpanded ? 'Hide' : 'Show'} details</span>
                            <ChevronDown 
                              size={20} 
                              className="transition-transform duration-200"
                            />
                          </div>
                        </div>
                        
                        {/* NEW: Expanded content */}
                        {isExpanded && (
                          <div className={`p-4 transition-colors duration-300 ${
                            isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                          }`}>
                            {/* Step selection for jazz standards */}
                            {isStandard && standard && (
                              <div className="mb-4">
                                <label className={`block text-sm font-medium mb-3 transition-colors duration-300 ${
                                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                  Focus Step (Optional) • Progress: {standard.steps.filter(Boolean).length}/8 completed
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                  {STANDARD_STEPS.map((_, stepIndex) => {
                                    const stepStatus = getStepStatus(standard, stepIndex);
                                    const isSelected = task.focusStep === stepIndex;
                                    const isCompleted = stepStatus === '✅';
                                    
                                    return (
                                      <div
                                        key={stepIndex}
                                        onClick={() => updateTaskField(task.id, 'focusStep', 
                                          isSelected ? null : stepIndex)}
                                        className={`flex items-center gap-2 p-2 border rounded-md cursor-pointer transition-all duration-200 text-sm ${
                                          isSelected
                                            ? 'border-blue-500 bg-blue-50 text-blue-800'
                                            : isCompleted
                                              ? 'border-green-200 bg-green-50 hover:border-green-300'
                                              : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                                        } ${isDarkMode && !isSelected ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                                      >
                                        <input
                                          type="radio"
                                          name={`focusStep-${task.id}`}
                                          checked={isSelected}
                                          onChange={() => {}}
                                          className="pointer-events-none"
                                        />
                                        <span className="font-medium text-gray-600">
                                          {stepIndex + 1}
                                        </span>
                                        <span className="flex-1 min-w-0">
                                          {getStepLabel(stepIndex)}
                                        </span>
                                        <span>{stepStatus}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                            
                            {/* Practice note */}
                            <div>
                              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                Practice Note
                              </label>
                              <textarea
                                value={task.practiceNote}
                                onChange={(e) => updateTaskField(task.id, 'practiceNote', e.target.value)}
                                placeholder="What will you focus on during this practice?"
                                className={`w-full px-3 py-2 border rounded-md resize-none h-20 transition-colors duration-300 ${
                                  isDarkMode 
                                    ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                                    : 'bg-white border-gray-300 text-gray-800'
                                }`}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                
                {/* Drop zone at the end - PRESERVE EXISTING */}
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

      {/* Repertoire Choice Modal */}
      {showRepertoireChoice && lastSessionTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg shadow-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="text-center mb-6">
              <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Last Session Template
              </h3>
              <p className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Your last session included repertoire tasks. How would you like to handle each one?
              </p>
            </div>

            {(() => {
              const repertoireTasks = lastSessionTemplate.tasks.filter(task => 
                task.name && task.name.includes('(Repertoire)')
              );
              const repertoireList = getRepertoireList();
              
              return (
                <div className="space-y-6">
                  {repertoireTasks.map((task, index) => {
                    const nextRepertoire = repertoireList[index] || repertoireList[0];
                    const currentChoice = repertoireChoices[task.id] || 'keep';
                    
                    return (
                      <div key={task.id} className={`p-4 rounded-lg border transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className={`font-medium mb-3 transition-colors duration-300 ${
                          isDarkMode ? 'text-white' : 'text-gray-800'
                        }`}>
                          Repertoire Task {index + 1}
                        </div>
                        <div className={`text-sm mb-3 transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {task.name} ({task.timeAllocated} min)
                        </div>
                        {nextRepertoire && (
                          <div className={`text-sm mb-4 transition-colors duration-300 ${
                            isDarkMode ? 'text-blue-400' : 'text-blue-600'
                          }`}>
                            Next in rotation: {nextRepertoire.name}
                          </div>
                        )}

                        <div className="space-y-3">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name={`repertoireChoice-${task.id}`}
                              value="keep"
                              checked={currentChoice === 'keep'}
                              onChange={(e) => setRepertoireChoices(prev => ({
                                ...prev,
                                [task.id]: e.target.value
                              }))}
                              className="text-blue-600"
                            />
                            <div>
                              <div className={`font-medium transition-colors duration-300 ${
                                isDarkMode ? 'text-white' : 'text-gray-800'
                              }`}>
                                Keep the same
                              </div>
                              <div className={`text-sm transition-colors duration-300 ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                Use {task.name} again
                              </div>
                            </div>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name={`repertoireChoice-${task.id}`}
                              value="remove"
                              checked={currentChoice === 'remove'}
                              onChange={(e) => setRepertoireChoices(prev => ({
                                ...prev,
                                [task.id]: e.target.value
                              }))}
                              className="text-red-600"
                            />
                            <div>
                              <div className={`font-medium transition-colors duration-300 ${
                                isDarkMode ? 'text-white' : 'text-gray-800'
                              }`}>
                                Remove from template
                              </div>
                              <div className={`text-sm transition-colors duration-300 ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                Don't include this repertoire task
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            <div className="flex gap-3 pt-6">
              <button
                onClick={() => {
                  setShowRepertoireChoice(false);
                  setLastSessionTemplate(null);
                  setRepertoireChoices({});
                }}
                className={`flex-1 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => applyLastSessionTemplate(lastSessionTemplate, repertoireChoices)}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                Apply Template
              </button>
            </div>
          </div>
        </div>
      )}
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
  onUpdateTask,
  formatTime,
  isDarkMode,
  toggleDarkMode,
  getSessionElapsedTime,
  getTaskElapsedTime,
  getSessionProgress,
  getRemainingTaskTime,
  getCappedTotalTimeSpent,
  taskTimeSpent,
  sessionStarted
}) => {
  const currentTaskIndex = activeTask ? session.tasks.findIndex(t => t.id === activeTask.id) : -1;

  // DIFF 8: Add new state variables
  const [showNotePanel, setShowNotePanel] = useState(false);
  const [editingTaskNote, setEditingTaskNote] = useState('');

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't handle keyboard shortcuts when note panel is open
      if (showNotePanel) {
        return;
      }
      
      // Don't handle keyboard shortcuts when user is typing in form elements
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        return;
      }
      
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = currentTaskIndex > 0 ? currentTaskIndex - 1 : session.tasks.length - 1;
        onStartTimer(session.tasks[prevIndex]);
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = currentTaskIndex < session.tasks.length - 1 ? currentTaskIndex + 1 : 0;
        onStartTimer(session.tasks[nextIndex]);
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
  }, [currentTaskIndex, session.tasks, onStartTimer, activeTask, isTimerRunning, onPauseTimer, onResumeTimer, showNotePanel]);

  // DIFF 9: Add helper functions
  const handleTaskClick = (task) => {
    if (isTimerRunning) {
      onPauseTimer();
    }
    onStartTimer(task);
  };

  const handleTaskDoubleClick = (task) => {
    // Make task active if not already active
    if (!activeTask || activeTask.id !== task.id) {
      onStartTimer(task);
    }
    
    // Always pause the timer when opening the practice note box
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
    <div className="max-w-4xl mx-auto p-6 min-h-screen transition-colors duration-300">
      <div className={`rounded-lg shadow-lg p-6 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-2xl font-bold transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>Practice Session</h1>
          <div className="flex gap-3 items-center">
            {/* Dark Mode Toggle */}
            <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} square />
            
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
              
              {/* Active Task Countdown - Centered main display */}
              <div className="mb-6">
                <div className={`text-sm font-medium mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-blue-400' : 'text-gray-600'
                }`}>Active Task Countdown</div>
                <div className={`text-4xl font-bold transition-colors duration-300 ${
                  timeRemaining < 0 
                    ? (isDarkMode ? 'text-orange-400' : 'text-orange-600')
                    : (isDarkMode ? 'text-blue-300' : 'text-blue-600')
                }`}>
                  {timeRemaining < 0 ? '-' : ''}{formatTime(Math.abs(timeRemaining))}
                </div>
              </div>

              <div className="flex justify-center gap-4">
                {!isTimerRunning ? (
                  <button
                    onClick={onResumeTimer}
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
              
              {/* Spacebar hint */}
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
              
              {/* Active Task Countdown - Centered main display */}
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
                      {task.type.replace('_', ' ')} • {formatTime(taskElapsed)} / {formatTime(taskAllocated)}
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
            <span>{formatTime(getCappedTotalTimeSpent())} / {formatTime(session.totalTime * 60)}</span>
          </div>
          
          {/* Segmented Progress Bar */}
          <div className={`w-full h-3 rounded-full transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
          }`} style={{ position: 'relative' }}>
            {session.tasks.map((task, index) => {
              const taskElapsed = getTaskElapsedTime(task.id);
              const taskAllocated = task.timeAllocated * 60;
              const isActive = activeTask && activeTask.id === task.id;
              const isCompleted = taskElapsed >= taskAllocated;
              
              // Calculate segment width and position
              const totalAllocated = session.totalTime * 60;
              const segmentWidth = (taskAllocated / totalAllocated) * 100;
              const segmentLeft = session.tasks.slice(0, index).reduce((sum, t) => 
                sum + ((t.timeAllocated * 60) / totalAllocated) * 100, 0
              );
              
              // Calculate fill width for this segment
              const fillWidth = Math.min((taskElapsed / taskAllocated) * 100, 100);
              
              return (
                <div key={task.id} style={{ 
                  position: 'absolute', 
                  left: `${segmentLeft}%`, 
                  width: `${segmentWidth}%`,
                  height: '100%'
                }}>
                  {/* Segment fill */}
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
                  
                  {/* Dividing line (except for first segment) */}
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
    <div className="max-w-6xl mx-auto p-6 min-h-screen transition-colors duration-300">
      <div className={`rounded-lg shadow-lg p-6 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-2xl font-bold transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>Practice Reports</h1>
          <div className="flex gap-3 items-center">
            {/* Dark Mode Toggle */}
            <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} square />
            
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
                      {session.completed ? 'Completed' : 'Active'}
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

const SessionSummaryModal = ({ 
  isOpen, 
  summaryData, 
  onComplete, 
  onCancel, 
  standards,
  isDarkMode,
  formatTime 
}) => {
  const [stepCompletions, setStepCompletions] = useState({});
  const [finalNotes, setFinalNotes] = useState({});

  if (!isOpen || !summaryData) return null;

  const { session, taskTimeSpent, sessionElapsed } = summaryData;
  
  // Get jazz standards from the session that had focus steps
  const jazzStandardTasks = session.tasks.filter(task => 
    task.type === TASK_TYPES.STANDARD && task.focusStep !== null
  );

  // Get all other tasks (non-standards or standards without focus steps)
  const otherTasks = session.tasks.filter(task => 
    task.type !== TASK_TYPES.STANDARD || task.focusStep === null
  );

  const handleStepCompletion = (standardId, stepIndex, completed) => {
    setStepCompletions(prev => {
      const updated = { ...prev };
      if (completed) {
        updated[standardId] = stepIndex;
      } else {
        delete updated[standardId];
      }
      return updated;
    });
  };

  const handleFinalNote = (taskId, note) => {
    setFinalNotes(prev => ({
      ...prev,
      [taskId]: note
    }));
  };

  const getStepLabel = (stepIndex) => {
    const labels = [
      'Play through with staple chords',
      'Learn shell chords', 
      'Learn scales for each chord',
      'Learn arpeggios for each chord',
      'Target the 3rds',
      'Comping practice',
      'Practice improvisation',
      'Post performance video'
    ];
    const safeStepIndex = stepIndex || 0;
    return labels[safeStepIndex] || `Step ${safeStepIndex + 1}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="text-center mb-6">
          <h2 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            🎯 Session Complete!
          </h2>
          <p className={`transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Great work today - {formatTime(sessionElapsed)} of focused practice
          </p>
        </div>

        {/* Jazz Standards Progress */}
        {jazzStandardTasks.length > 0 && (
          <div className="mb-6">
            <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Jazz Standards Progress
            </h3>
            
            {jazzStandardTasks.map(task => {
              const standard = standards.find(s => s.id === task.standardId);
              const timeSpent = taskTimeSpent[task.id] || 0;
              const finalNote = finalNotes[task.id] || '';
              
              if (!standard) return null;
              
              return (
                <div key={task.id} className={`border rounded-lg p-4 mb-4 transition-colors duration-300 ${
                  isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`font-medium transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      🎵 {task.name}
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                      ⏱️ {formatTime(timeSpent)}
                    </span>
                  </div>
                  
                  <div className={`text-sm mb-3 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                                            Step {(task.focusStep || 0) + 1}: {getStepLabel(task.focusStep || 0)}
                  </div>
                  
                  {/* Show practice notes */}
                  {(task.practiceNote || task.sessionNote) && (
                    <div className={`p-3 rounded mb-3 text-sm transition-colors duration-300 ${
                      isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-white text-gray-700'
                    }`}>
                      {task.practiceNote && (
                        <div>
                          <strong>📝 Practice note:</strong> {task.practiceNote}
                        </div>
                      )}
                      {task.sessionNote && task.sessionNote !== task.practiceNote && (
                        <div className="mt-2">
                          <strong>Session update:</strong> {task.sessionNote}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Step completion checkbox */}
                  <div className={`flex items-start gap-3 p-3 rounded transition-colors duration-300 ${
                    isDarkMode ? 'bg-green-900/30' : 'bg-green-50'
                  }`}>
                    <input
                      type="checkbox"
                      id={`complete-${task.id}`}
                      checked={stepCompletions[standard.id] === task.focusStep}
                      onChange={(e) => handleStepCompletion(
                        standard.id, 
                        task.focusStep, 
                        e.target.checked
                      )}
                      className="mt-1 transform scale-110"
                    />
                    <label htmlFor={`complete-${task.id}`} className="flex-1">
                      <div className={`font-medium transition-colors duration-300 ${
                        isDarkMode ? 'text-green-300' : 'text-green-800'
                      }`}>
                        Mark Step {(task.focusStep || 0) + 1} as completed?
                      </div>
                      <div className={`text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-green-400' : 'text-green-700'
                      }`}>
                        Check this only when you're confident you've mastered this step
                      </div>
                    </label>
                  </div>
                  
                  {/* Final session note */}
                  <div className="mt-3">
                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Final session note (optional)
                    </label>
                    <textarea
                      value={finalNote}
                      onChange={(e) => handleFinalNote(task.id, e.target.value)}
                      placeholder="Any final thoughts about this practice session?"
                      className={`w-full px-3 py-2 border rounded-md resize-none h-16 text-sm transition-colors duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-800'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* All Other Tasks */}
        {otherTasks.length > 0 && (
          <div className="mb-6">
            <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Other Tasks
            </h3>
            
            {otherTasks.map(task => {
              const timeSpent = taskTimeSpent[task.id] || 0;
              const finalNote = finalNotes[task.id] || '';
              
              return (
                <div key={task.id} className={`border rounded-lg p-4 mb-4 transition-colors duration-300 ${
                  isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`font-medium transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      {task.type === TASK_TYPES.STANDARD ? '🎵' : '📚'} {task.name}
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                      ⏱️ {formatTime(timeSpent)}
                    </span>
                  </div>
                  
                  {/* Show practice notes */}
                  {(task.practiceNote || task.sessionNote) && (
                    <div className={`p-3 rounded mb-3 text-sm transition-colors duration-300 ${
                      isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-white text-gray-700'
                    }`}>
                      {task.practiceNote && (
                        <div>
                          <strong>📝 Practice note:</strong> {task.practiceNote}
                        </div>
                      )}
                      {task.sessionNote && task.sessionNote !== task.practiceNote && (
                        <div className="mt-2">
                          <strong>Session update:</strong> {task.sessionNote}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Final session note */}
                  <div className="mt-3">
                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Final session note (optional)
                    </label>
                    <textarea
                      value={finalNote}
                      onChange={(e) => handleFinalNote(task.id, e.target.value)}
                      placeholder="Any final thoughts about this practice session?"
                      className={`w-full px-3 py-2 border rounded-md resize-none h-16 text-sm transition-colors duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-800'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => onCancel()}
            className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
              isDarkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={() => onComplete(stepCompletions, finalNotes)}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
          >
            Complete Session
          </button>
        </div>
      </div>
    </div>
  );
};

const CollectionsView = ({ 
  collections, 
  onBack, 
  onSelectSession, 
  onExportSession, 
  onImportSession, 
  setIsImporting,
  isImporting,
  triggerImport,
  isDarkMode, 
  toggleDarkMode,
  getCollectionStats,
  getSessionDependencyStatus,
  getSeriesProgress,
  getSeriesSessions,
  getAvailableSessions,
  getLockedSessions
}) => {
  // Local ref for collection file input
  const localCollectionFileInputRef = useRef(null);
  
  const stats = getCollectionStats();
  const availableSessions = getAvailableSessions();
  const lockedSessions = getLockedSessions();
  const completedSessions = collections.filter(s => s.completed);
  const overdueSessions = collections.filter(s => 
    s.status === SESSION_STATUS.PENDING && 
    new Date(s.dueDate) < new Date()
  );

  // Group sessions by series
  const seriesGroups = {};
  collections.forEach(session => {
    if (session.seriesId) {
      if (!seriesGroups[session.seriesId]) {
        seriesGroups[session.seriesId] = [];
      }
      seriesGroups[session.seriesId].push(session);
    }
  });

  // Sort series by the first session's assigned date
  const sortedSeries = Object.keys(seriesGroups).sort((a, b) => {
    const aFirstSession = seriesGroups[a][0];
    const bFirstSession = seriesGroups[b][0];
    return new Date(aFirstSession.assignedDate) - new Date(bFirstSession.assignedDate);
  });

  // Local trigger function that uses the local ref
  const localTriggerImport = () => {
    console.log('Triggering file input...');
    localCollectionFileInputRef.current?.click();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen transition-colors duration-300">
      <div className={`rounded-lg shadow-lg p-6 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-2xl font-bold transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>Collections</h1>
          <div className="flex gap-3 items-center">
            {/* Dark Mode Toggle */}
            <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} square />
            
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

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className={`p-4 rounded-lg transition-colors duration-300 ${
            isDarkMode ? 'bg-blue-900/50 border border-blue-700' : 'bg-blue-50'
          }`}>
            <h3 className={`font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-blue-300' : 'text-blue-800'
            }`}>Total Assignments</h3>
            <p className={`text-2xl font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-blue-400' : 'text-blue-600'
            }`}>{stats.total}</p>
          </div>
          <div className={`p-4 rounded-lg transition-colors duration-300 ${
            isDarkMode ? 'bg-green-900/50 border border-green-700' : 'bg-green-50'
          }`}>
            <h3 className={`font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-green-300' : 'text-green-800'
            }`}>Completed</h3>
            <p className={`text-2xl font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-green-400' : 'text-green-600'
            }`}>{stats.completed}</p>
            <p className={`text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-green-400' : 'text-green-600'
            }`}>{stats.completionRate}% completion rate</p>
          </div>
          <div className={`p-4 rounded-lg transition-colors duration-300 ${
            isDarkMode ? 'bg-orange-900/50 border border-orange-700' : 'bg-orange-50'
          }`}>
            <h3 className={`font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-orange-300' : 'text-orange-800'
            }`}>Available</h3>
            <p className={`text-2xl font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-orange-400' : 'text-orange-600'
            }`}>{availableSessions.length}</p>
          </div>
          <div className={`p-4 rounded-lg transition-colors duration-300 ${
            isDarkMode ? 'bg-red-900/50 border border-red-700' : 'bg-red-50'
          }`}>
            <h3 className={`font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-red-300' : 'text-red-800'
            }`}>Overdue</h3>
            <p className={`text-2xl font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-red-400' : 'text-red-600'
            }`}>{stats.overdue}</p>
          </div>
        </div>

        {/* Import/Export Section */}
        <div className={`p-4 rounded-lg mb-6 transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-gray-50 border border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>Import Collections</h3>
          <div className="space-y-3">
            <div className="flex gap-3 items-center">
              <button
                onClick={localTriggerImport}
                disabled={isImporting}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isImporting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : isDarkMode 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isImporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    Import Sessions
                  </>
                )}
              </button>
              <p className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Import single sessions or complete series from collections
              </p>
            </div>
            <div className={`text-sm p-3 rounded transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-blue-900/30 text-blue-300 border border-blue-700' 
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              <strong>💡 Tip:</strong> Collections can contain multiple lessons that will automatically appear in the correct order with proper dependencies.
            </div>
          </div>
        </div>

        {/* All Assignments */}
        <div className="mb-8">
          <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            📚 All Collections ({collections.length})
          </h3>
                      {collections.length === 0 ? (
            <div className={`text-center py-8 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <p>No collections yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Group all sessions by series */}
              {(() => {
                // Group all sessions by series
                const seriesGroups = {};
                collections.forEach(session => {
                  if (session.seriesId) {
                    if (!seriesGroups[session.seriesId]) {
                      seriesGroups[session.seriesId] = [];
                    }
                    seriesGroups[session.seriesId].push(session);
                  } else {
                    // Standalone sessions
                    if (!seriesGroups['standalone']) {
                      seriesGroups['standalone'] = [];
                    }
                    seriesGroups['standalone'].push(session);
                  }
                });

                return Object.entries(seriesGroups).map(([seriesId, sessions]) => {
                  if (seriesId === 'standalone') {
                    // Show standalone sessions individually
                    return (
                      <div key="standalone" className="space-y-4">
                        {sessions.map(session => (
                          <CollectionCard 
                            key={session.id}
                            session={session}
                            onSelect={() => onSelectSession(session)}
                            onExport={() => onExportSession(session)}
                            isDarkMode={isDarkMode}
                            dependencyStatus={getSessionDependencyStatus(session)}
                          />
                        ))}
                      </div>
                    );
                  } else {
                    // Show series as a grouped package with all sessions
                    const sortedSessions = sessions.sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0));
                    const seriesName = sortedSessions[0]?.title?.split(':')[0] || 'Series';
                    const teacherName = sortedSessions[0]?.teacherName || 'Teacher';
                    const completedCount = sortedSessions.filter(s => s.completed).length;
                    const totalCount = sortedSessions.length;
                    
                    return (
                      <div key={seriesId} className={`p-4 rounded-lg border-2 transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-800 border-blue-600' : 'bg-blue-50 border-blue-300'
                      }`}>
                        {/* Series Header */}
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h4 className={`text-lg font-bold transition-colors duration-300 ${
                              isDarkMode ? 'text-blue-300' : 'text-blue-800'
                            }`}>
                              📦 {seriesName} Package
                            </h4>
                            <p className={`text-sm transition-colors duration-300 ${
                              isDarkMode ? 'text-blue-400' : 'text-blue-600'
                            }`}>
                              {teacherName} • {totalCount} sessions • {sessions.reduce((sum, s) => sum + s.totalTime, 0)} minutes total
                              {completedCount > 0 && ` • ${completedCount}/${totalCount} completed`}
                            </p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isDarkMode ? 'bg-blue-700 text-blue-200' : 'bg-blue-200 text-blue-800'
                          }`}>
                            Series
                          </div>
                        </div>
                        
                        {/* Individual Sessions */}
                        <div className="space-y-3">
                          {sortedSessions.map(session => {
                            const isLocked = getSessionDependencyStatus(session) === DEPENDENCY_STATUS.LOCKED;
                            const isCompleted = session.completed;
                            
                            return (
                              <div key={session.id} className={`p-3 rounded-lg border transition-colors duration-300 ${
                                isCompleted
                                  ? (isDarkMode ? 'bg-green-900/30 border-green-600' : 'bg-green-50 border-green-300')
                                  : isLocked
                                    ? (isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300')
                                    : (isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200')
                              }`}>
                                <div className="flex justify-between items-center">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                        isCompleted
                                          ? 'bg-green-600 text-white'
                                          : isLocked
                                            ? 'bg-gray-400 text-white'
                                            : (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                                      }`}>
                                        {session.seriesOrder || '?'}
                                      </div>
                                      <div>
                                        <h5 className={`font-medium transition-colors duration-300 ${
                                          isCompleted
                                            ? (isDarkMode ? 'text-green-300' : 'text-green-800')
                                            : isLocked
                                              ? (isDarkMode ? 'text-gray-400' : 'text-gray-600')
                                              : (isDarkMode ? 'text-white' : 'text-gray-800')
                                        }`}>
                                          {session.title}
                                          {isLocked && <span className="ml-2 text-orange-600">🔒</span>}
                                          {isCompleted && <span className="ml-2 text-green-600">✅</span>}
                                        </h5>
                                        <p className={`text-sm transition-colors duration-300 ${
                                          isCompleted
                                            ? (isDarkMode ? 'text-green-400' : 'text-green-600')
                                            : isLocked
                                              ? (isDarkMode ? 'text-gray-500' : 'text-gray-500')
                                              : (isDarkMode ? 'text-gray-400' : 'text-gray-600')
                                        }`}>
                                          {session.totalTime} minutes • {session.tasks.length} tasks
                                          {isLocked && ' • Locked'}
                                          {isCompleted && ' • Completed'}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => onSelectSession(session)}
                                      disabled={isLocked}
                                      className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${
                                        isLocked
                                          ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                          : isDarkMode 
                                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                      }`}
                                    >
                                      {isCompleted ? 'Review' : isLocked ? 'Locked' : 'Start Session'}
                                    </button>
                                    <button
                                      onClick={() => onExportSession(session)}
                                      className={`px-3 py-1 rounded text-sm transition-colors duration-200 ${
                                        isDarkMode 
                                          ? 'bg-gray-600 text-white hover:bg-gray-700' 
                                          : 'bg-gray-600 text-white hover:bg-gray-700'
                                      }`}
                                    >
                                      Export
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                });
              })()}
            </div>
          )}
        </div>



        {/* Series Progress */}
        {sortedSeries.length > 0 && (
          <div className="mb-8">
            <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              📊 Series Progress
            </h3>
            <div className="space-y-6">
              {sortedSeries.map(seriesId => {
                const seriesSessions = getSeriesSessions(seriesId);
                const seriesProgress = getSeriesProgress(seriesId);
                const completedCount = seriesSessions.filter(s => s.completed).length;
                const totalCount = seriesSessions.length;
                
                return (
                  <div key={seriesId} className={`p-4 rounded-lg border transition-colors duration-300 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className={`font-semibold transition-colors duration-300 ${
                        isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}>
                        {seriesSessions[0]?.title?.split(':')[0] || 'Series'} Progression
                      </h4>
                      <span className={`px-2 py-1 text-xs rounded ${
                        seriesProgress === SERIES_STATUS.COMPLETED 
                          ? 'bg-green-600 text-white'
                          : seriesProgress === SERIES_STATUS.IN_PROGRESS
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-600 text-white'
                      }`}>
                        {completedCount}/{totalCount} completed
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {seriesSessions.map(session => (
                        <div key={session.id} className={`flex items-center gap-3 p-2 rounded transition-colors duration-300 ${
                          session.completed
                            ? (isDarkMode ? 'bg-green-900/30' : 'bg-green-50')
                            : getSessionDependencyStatus(session) === DEPENDENCY_STATUS.LOCKED
                              ? (isDarkMode ? 'bg-gray-600' : 'bg-gray-100')
                              : (isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50')
                        }`}>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            session.completed
                              ? 'bg-green-600 text-white'
                              : getSessionDependencyStatus(session) === DEPENDENCY_STATUS.LOCKED
                                ? 'bg-gray-400 text-white'
                                : 'bg-blue-600 text-white'
                          }`}>
                            {session.seriesOrder || '?'}
                          </div>
                          <div className="flex-1">
                            <div className={`font-medium transition-colors duration-300 ${
                              isDarkMode ? 'text-white' : 'text-gray-800'
                            }`}>
                              {session.title}
                            </div>
                            <div className={`text-sm transition-colors duration-300 ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {session.completed ? 'Completed' : 
                               getSessionDependencyStatus(session) === DEPENDENCY_STATUS.LOCKED ? 'Locked' : 'Available'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
      
      {/* Collection File Input - moved here so it's available when CollectionsView is rendered */}
      <input
        ref={localCollectionFileInputRef}
        type="file"
        accept=".json"
        onChange={(event) => {
          console.log('File input onChange triggered');
          onImportSession(event);
        }}
        style={{ display: 'none' }}
      />
    </div>
  );
};

const CollectionCard = ({ session, onSelect, onExport, isDarkMode, completed = false, dependencyStatus, locked = false }) => {
  const daysUntilDue = Math.ceil((new Date(session.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
  const isOverdue = daysUntilDue < 0;
  const isLocked = locked || dependencyStatus === DEPENDENCY_STATUS.LOCKED;
  
  return (
    <div className={`p-4 rounded-lg border transition-all duration-300 ${
      completed
        ? (isDarkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200')
        : isLocked
          ? (isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-100 border-gray-300')
          : isOverdue
            ? (isDarkMode ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-200')
            : (isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-white border-gray-200 hover:bg-gray-50')
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className={`font-semibold transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {session.title}
          </h4>
          <div className={`text-sm mb-2 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <div>👤 {session.teacherName}</div>
            <div>📅 Due: {new Date(session.dueDate).toLocaleDateString()}</div>
            <div>⏱️ {session.totalTime} minutes • {session.tasks.length} tasks</div>
            {session.seriesOrder && (
              <div className="text-blue-600 font-medium">
                Week {session.seriesOrder} of series
              </div>
            )}
            {!completed && !isLocked && (
              <div className={`font-medium ${
                isOverdue ? 'text-red-600' : 'text-blue-600'
              }`}>
                {isOverdue ? `${Math.abs(daysUntilDue)} days overdue` : `${daysUntilDue} days remaining`}
              </div>
            )}
            {isLocked && (
              <div className="text-orange-600 font-medium">
                🔒 Requires previous sessions
              </div>
            )}
            {completed && session.completionDate && (
              <div className="text-green-600 font-medium">
                Completed: {new Date(session.completionDate).toLocaleDateString()}
              </div>
            )}
          </div>
          {session.description && (
            <p className={`text-sm italic transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              "{session.description}"
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <span className={`px-2 py-1 text-xs rounded ${
            completed
              ? 'bg-green-600 text-white'
              : isOverdue
                ? 'bg-red-600 text-white'
                : 'bg-blue-600 text-white'
          }`}>
            {completed ? 'Completed' : isOverdue ? 'Overdue' : 'Pending'}
          </span>
        </div>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={onSelect}
          disabled={isLocked}
          className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors duration-200 ${
            isLocked
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : isDarkMode 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <Play size={16} />
          {completed ? 'Review Session' : isLocked ? 'Locked' : 'Start Session'}
        </button>
        <button
          onClick={onExport}
          className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors duration-200 ${
            isDarkMode 
              ? 'bg-gray-600 text-white hover:bg-gray-700' 
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
        >
          <Download size={16} />
          Export
        </button>
      </div>
    </div>
  );
};

export default JazzGuitarTracker;