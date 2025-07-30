import { useState, useEffect, useRef } from 'react';

export const usePracticeSession = () => {
  const [session, setSession] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [taskTimeSpent, setTaskTimeSpent] = useState({});
  const [sessionStarted, setSessionStarted] = useState(false);
  
  const timerRef = useRef(null);
  const sessionStartTimeRef = useRef(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startSession = (sessionData) => {
    setSession(sessionData);
    setActiveTask(null);
    setTimeRemaining(0);
    setIsTimerRunning(false);
    setTaskTimeSpent({});
    setSessionStarted(false);
    sessionStartTimeRef.current = null;
  };

  const startTimer = (task) => {
    setActiveTask(task);
    const allocatedTime = task.timeAllocated * 60; // Convert to seconds
    setTimeRemaining(allocatedTime);
    
    if (!sessionStarted) {
      setSessionStarted(true);
      sessionStartTimeRef.current = Date.now();
    }
    
    setIsTimerRunning(true);
    
    // Clear existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Start new timer
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;
        
        // Update task time spent
        setTaskTimeSpent(prev => ({
          ...prev,
          [task.id]: (prev[task.id] || 0) + 1
        }));
        
        return newTime;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const resumeTimer = () => {
    if (activeTask) {
      setIsTimerRunning(true);
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          
          // Update task time spent
          setTaskTimeSpent(prev => ({
            ...prev,
            [activeTask.id]: (prev[activeTask.id] || 0) + 1
          }));
          
          return newTime;
        });
      }, 1000);
    }
  };

  const endSession = () => {
    setIsTimerRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    const sessionData = {
      session,
      taskTimeSpent,
      sessionElapsed: sessionStartTimeRef.current ? Math.floor((Date.now() - sessionStartTimeRef.current) / 1000) : 0
    };
    
    // Reset state
    setSession(null);
    setActiveTask(null);
    setTimeRemaining(0);
    setIsTimerRunning(false);
    setTaskTimeSpent({});
    setSessionStarted(false);
    sessionStartTimeRef.current = null;
    
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
    }
  };

  const getSessionElapsedTime = () => {
    if (!sessionStartTimeRef.current) return 0;
    return Math.floor((Date.now() - sessionStartTimeRef.current) / 1000);
  };

  const getTaskElapsedTime = (taskId) => {
    return taskTimeSpent[taskId] || 0;
  };

  const getSessionProgress = () => {
    if (!session) return 0;
    
    const totalAllocated = session.tasks.reduce((sum, task) => sum + (task.timeAllocated * 60), 0);
    const totalSpent = Object.values(taskTimeSpent).reduce((sum, time) => sum + time, 0);
    
    return totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;
  };

  const getRemainingTaskTime = () => {
    if (!session) return 0;
    
    const totalAllocated = session.tasks.reduce((sum, task) => sum + (task.timeAllocated * 60), 0);
    const totalSpent = Object.values(taskTimeSpent).reduce((sum, time) => sum + time, 0);
    
    return Math.max(0, totalAllocated - totalSpent);
  };

  const getCappedTotalTimeSpent = () => {
    if (!session) return 0;
    
    const totalAllocated = session.tasks.reduce((sum, task) => sum + (task.timeAllocated * 60), 0);
    const totalSpent = Object.values(taskTimeSpent).reduce((sum, time) => sum + time, 0);
    
    return Math.min(totalSpent, totalAllocated);
  };

  return {
    session,
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
  };
}; 