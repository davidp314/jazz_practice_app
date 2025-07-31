export const getWeeklyStats = (practiceHistory) => {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const weekSessions = practiceHistory.filter(session => {
    const sessionDate = new Date(session.date);
    return sessionDate >= startOfWeek;
  });

  const totalTime = weekSessions.reduce((sum, session) => sum + session.totalTime, 0);
  const averageTime = weekSessions.length > 0 ? Math.round(totalTime / weekSessions.length) : 0;

  return {
    sessions: weekSessions.length,
    totalTime,
    averageTime
  };
};

export const getCollectionStats = (collections) => {
  const totalCollections = collections.length;
  const completedSessions = collections.reduce((sum, collection) => {
    return sum + collection.sessions.filter(session => session.status === 'completed').length;
  }, 0);

  return {
    totalCollections,
    completedSessions
  };
};

export const getSessionDependencyStatus = (session, collections) => {
  if (!session.dependencies || session.dependencies.length === 0) {
    return 'available';
  }

  // Check if all dependencies are completed
  const allDependenciesCompleted = session.dependencies.every(depId => {
    const depSession = collections.flatMap(c => c.sessions).find(s => s.id === depId);
    return depSession && depSession.status === 'completed';
  });

  return allDependenciesCompleted ? 'available' : 'locked';
};

export const getSeriesProgress = (seriesId, collections) => {
  const collection = collections.find(c => c.id === seriesId);
  if (!collection) return { completed: 0, total: 0 };

  const total = collection.sessions.length;
  const completed = collection.sessions.filter(session => session.status === 'completed').length;

  return { completed, total };
};

export const getSeriesSessions = (seriesId, collections) => {
  const collection = collections.find(c => c.id === seriesId);
  return collection ? collection.sessions : [];
};

export const getAvailableSessions = (collections) => {
  return collections.flatMap(collection => 
    collection.sessions.filter(session => 
      getSessionDependencyStatus(session, collections) === 'available'
    )
  );
};

export const getLockedSessions = (collections) => {
  return collections.flatMap(collection => 
    collection.sessions.filter(session => 
      getSessionDependencyStatus(session, collections) === 'locked'
    )
  );
}; 