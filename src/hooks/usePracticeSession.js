import { useState, useEffect, useRef } from 'react';

export const usePracticeSession = () => {
  const [session, setSession] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [taskTimeSpent, setTaskTimeSpent] = useState({});
  const [sessionStarted, setSessionStarted] = useState(false);
  
  // Individual timers for each task
  const [taskTimers, setTaskTimers] = useState({});
  
  const timerRef = useRef(null);
  const sessionStartTimeRef = useRef(null);
  const currentTimingTaskRef = useRef(null);

  // Timer effect - runs individual task timers
  useEffect(() => {
    if (isTimerRunning && currentTimingTaskRef.current) {
      const runTimer = () => {
        if (currentTimingTaskRef.current && isTimerRunning) {
          const taskId = currentTimingTaskRef.current.id;
          
          setTaskTimers(prev => {
            const currentTime = prev[taskId] || 0;
            // Allow negative values to continue counting down past allocated time
            const newTime = currentTime - 1;
            
            return {
              ...prev,
              [taskId]: newTime
            };
          });
          
          setTaskTimeSpent(prev => ({
            ...prev,
            [taskId]: (prev[taskId] || 0) + 1
          }));
          
          // Schedule next tick
          timerRef.current = setTimeout(runTimer, 1000);
        }
      };
      
      // Start the timer
      runTimer();
      
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    } else {
      // Clear timer when not running
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isTimerRunning, currentTimingTaskRef.current]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const startSession = (sessionData) => {
    setSession(sessionData);
    setIsTimerRunning(false);
    setTaskTimeSpent({});
    setTaskTimers({});
    setSessionStarted(false);
    sessionStartTimeRef.current = null;
    currentTimingTaskRef.current = null;
    
    // Initialize individual timers for each task
    if (sessionData && sessionData.tasks) {
      const initialTimers = {};
      sessionData.tasks.forEach(task => {
        initialTimers[task.id] = (task.timeAllocated || 0) * 60;
      });
      setTaskTimers(initialTimers);
    }
    
    // Auto-select the first task if available
    if (sessionData && sessionData.tasks && sessionData.tasks.length > 0) {
      const firstTask = sessionData.tasks[0];
      setActiveTask(firstTask);
    } else {
      setActiveTask(null);
    }
  };

  const selectTask = (task) => {
    setActiveTask(task);
    // No need to update timeRemaining since we now use individual task timers
  };

  const startTimer = (task) => {
    // If no task is provided, use the currently active task
    const taskToStart = task || activeTask;
    if (!taskToStart) return;
    
    // Clear any existing timer first
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    // Only select the task if it's different from the current one
    if (!activeTask || activeTask.id !== taskToStart.id) {
      selectTask(taskToStart);
    }
    
    // Store which task we're timing
    currentTimingTaskRef.current = taskToStart;
    
    if (!sessionStarted) {
      setSessionStarted(true);
      sessionStartTimeRef.current = Date.now();
    }
    
    setIsTimerRunning(true);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const resumeTimer = () => {
    if (activeTask) {
      // Clear any existing timer first
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      
      // Store which task we're timing
      currentTimingTaskRef.current = activeTask;
      
      setIsTimerRunning(true);
    }
  };

  const endSession = () => {
    setIsTimerRunning(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    const sessionData = {
      session,
      taskTimeSpent,
      sessionElapsed: sessionStartTimeRef.current ? Math.floor((Date.now() - sessionStartTimeRef.current) / 1000) : 0
    };
    
    // Reset state
    setSession(null);
    setActiveTask(null);
    setIsTimerRunning(false);
    setTaskTimeSpent({});
    setTaskTimers({});
    setSessionStarted(false);
    sessionStartTimeRef.current = null;
    currentTimingTaskRef.current = null;
    
    return sessionData;
  };

  const updateTask = (taskId, updates) => {
    if (session) {
      setSession(prev => ({
        ...prev,
        tasks: prev.tasks.map(task =>
          task.id === taskId ? { ...task, ...updates } : task
        )
      }));
      
      // Update the task timer if timeAllocated changed
      if (updates.timeAllocated !== undefined) {
        setTaskTimers(prev => ({
          ...prev,
          [taskId]: (updates.timeAllocated || 0) * 60
        }));
      }
    }
  };

  const getSessionElapsedTime = () => {
    if (!sessionStartTimeRef.current) return 0;
    return Math.floor((Date.now() - sessionStartTimeRef.current) / 1000);
  };

  const getTotalTaskTimeSpent = () => {
    // Sum up all time spent on individual tasks, including overtime
    return Object.values(taskTimeSpent).reduce((sum, time) => sum + time, 0);
  };

  const getTaskElapsedTime = (taskId) => {
    return taskTimeSpent[taskId] || 0;
  };

  const getTaskRemainingTime = (taskId) => {
    // Return the actual remaining time, which can be negative
    return taskTimers[taskId] || 0;
  };

  const getActiveTaskRemainingTime = () => {
    if (!activeTask) return 0;
    // Return the actual remaining time, which can be negative
    return taskTimers[activeTask.id] || 0;
  };

  const getSessionProgress = () => {
    if (!session) return 0;
    
    const totalAllocated = session.tasks.reduce((sum, task) => sum + ((task.timeAllocated || 0) * 60), 0);
    const totalSpent = Object.values(taskTimeSpent).reduce((sum, time) => sum + time, 0);
    
    return totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;
  };

  const getRemainingTaskTime = () => {
    if (!session) return 0;
    
    const totalAllocated = session.tasks.reduce((sum, task) => sum + ((task.timeAllocated || 0) * 60), 0);
    const totalSpent = Object.values(taskTimeSpent).reduce((sum, time) => sum + time, 0);
    
    return Math.max(0, totalAllocated - totalSpent);
  };

  const getCappedTotalTimeSpent = () => {
    if (!session) return 0;
    
    const totalAllocated = session.tasks.reduce((sum, task) => sum + ((task.timeAllocated || 0) * 60), 0);
    const totalSpent = Object.values(taskTimeSpent).reduce((sum, time) => sum + time, 0);
    
    return Math.min(totalSpent, totalAllocated);
  };

  return {
    session,
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
  };
}; 