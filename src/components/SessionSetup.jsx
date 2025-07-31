import React, { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import DarkModeToggle from "./DarkModeToggle";
import { TASK_TYPES, STANDARD_STEPS } from "../constants";

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
        focusStep: null,
        practiceNote: '',
        sessionNote: ''
      };
      setSessionTasks([...sessionTasks, task]);
      setSelectedStandard('');
      setShowStandardTimeInput(false);
      setStandardTimeInput(25);
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
        practiceNote: '',
        sessionNote: ''
      };
      setSessionTasks([...sessionTasks, task]);
      setSelectedOtherWork('');
      setShowOtherWorkTimeInput(false);
      setOtherWorkTimeInput(20);
    }
  };

  const addCustomTask = () => {
    if (newTaskName.trim()) {
      const task = {
        id: Date.now().toString(),
        name: newTaskName.trim(),
        type: TASK_TYPES.ONE_OFF,
        timeAllocated: newTaskTime,
        practiceNote: '',
        sessionNote: ''
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
        focusStep: null,
        practiceNote: '',
        sessionNote: ''
      };
      setSessionTasks([...sessionTasks, task]);
      
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
    const [draggedTask] = newTasks.splice(dragIndex, 1);
    
    let finalInsertIndex = insertIndex;
    if (dragIndex < insertIndex) {
      finalInsertIndex = insertIndex - 1;
    }
    
    newTasks.splice(finalInsertIndex, 0, draggedTask);
    setSessionTasks(newTasks);
    setDragIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

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

  const getLastSession = () => {
    const completedSessions = practiceHistory.filter(session => session.completed);
    return completedSessions.length > 0 ? completedSessions[0] : null;
  };

  const handleUseLastSession = () => {
    const lastSession = getLastSession();
    if (!lastSession) {
      alert('No completed sessions found to use as template.');
      return;
    }

    const repertoireTasks = lastSession.tasks.filter(task => 
      task.name && task.name.includes('(Repertoire)')
    );

    if (repertoireTasks.length > 0) {
      const initialChoices = {};
      repertoireTasks.forEach((task, index) => {
        initialChoices[task.id] = 'keep';
      });
      setRepertoireChoices(initialChoices);
      setLastSessionTemplate(lastSession);
      setShowRepertoireChoice(true);
    } else {
      applyLastSessionTemplate(lastSession);
    }
  };

  const applyLastSessionTemplate = (session, repertoireChoices = {}) => {
    const newTasks = session.tasks.filter(task => {
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
          </div>
          <div className="flex gap-3 items-center">
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
                      
                      {/* Task card */}
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
                        {/* Task header */}
                        <div 
                          onClick={() => toggleTaskExpanded(task.id)}
                          className={`flex items-center gap-4 p-3 cursor-pointer rounded-t-lg transition-all duration-200 ${
                            isExpanded 
                              ? (isDarkMode ? 'bg-blue-900/30 border-b border-blue-700' : 'bg-blue-50 border-b border-blue-200')
                              : (isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-50')
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
                        
                        {/* Expanded content */}
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

export default SessionSetup; 