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
  // Handle undefined or null collections
  if (!collections || !Array.isArray(collections)) {
    return {
      totalCollections: 0,
      completedSessions: 0
    };
  }

  const totalCollections = collections.length;
  const completedSessions = collections.reduce((sum, collection) => {
    // Handle collection objects with sessions (series)
    if (collection.sessions && Array.isArray(collection.sessions)) {
      return sum + collection.sessions.filter(session => session.status === 'completed').length;
    } else {
      // Handle individual session objects
      return sum + (collection.status === 'completed' ? 1 : 0);
    }
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

  // Handle undefined or null collections
  if (!collections || !Array.isArray(collections)) {
    return 'available';
  }

  // Flatten all sessions from collections to check dependencies
  const allSessions = collections.flatMap(collection => {
    if (collection.sessions && Array.isArray(collection.sessions)) {
      return collection.sessions;
    } else {
      return [collection];
    }
  });

  // Check if all dependencies are completed
  const allDependenciesCompleted = session.dependencies.every(depId => {
    const depSession = allSessions.find(s => s.id === depId);
    return depSession && depSession.status === 'completed';
  });

  return allDependenciesCompleted ? 'available' : 'locked';
};

export const getSeriesProgress = (seriesId, collections) => {
  // Handle undefined or null collections
  if (!collections || !Array.isArray(collections)) {
    return { completed: 0, total: 0 };
  }

  const collection = collections.find(c => c.id === seriesId);
  if (!collection) return { completed: 0, total: 0 };

  // Handle collection objects with sessions
  if (collection.sessions && Array.isArray(collection.sessions)) {
    const total = collection.sessions.length;
    const completed = collection.sessions.filter(session => session.status === 'completed').length;
    return { completed, total };
  } else {
    // Handle individual session objects
    return { completed: collection.status === 'completed' ? 1 : 0, total: 1 };
  }
};

export const getSeriesSessions = (seriesId, collections) => {
  // Handle undefined or null collections
  if (!collections || !Array.isArray(collections)) {
    return [];
  }

  const collection = collections.find(c => c.id === seriesId);
  if (!collection) return [];

  // Handle collection objects with sessions
  if (collection.sessions && Array.isArray(collection.sessions)) {
    return collection.sessions;
  } else {
    // Handle individual session objects
    return [collection];
  }
};

export const getAvailableSessions = (collections) => {
  // Handle undefined or null collections
  if (!collections || !Array.isArray(collections)) {
    return [];
  }

  // Flatten all sessions from collections
  const allSessions = collections.flatMap(collection => {
    if (collection.sessions && Array.isArray(collection.sessions)) {
      return collection.sessions;
    } else {
      return [collection];
    }
  });

  return allSessions.filter(session => 
    getSessionDependencyStatus(session, collections) === 'available'
  );
};

export const getLockedSessions = (collections) => {
  // Handle undefined or null collections
  if (!collections || !Array.isArray(collections)) {
    return [];
  }

  // Flatten all sessions from collections
  const allSessions = collections.flatMap(collection => {
    if (collection.sessions && Array.isArray(collection.sessions)) {
      return collection.sessions;
    } else {
      return [collection];
    }
  });

  return allSessions.filter(session => 
    getSessionDependencyStatus(session, collections) === 'locked'
  );
}; 