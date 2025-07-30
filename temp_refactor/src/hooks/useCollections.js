import { useState, useEffect } from 'react';

export const useCollections = (initialCollections = []) => {
  const [collections, setCollections] = useState(initialCollections);

  // Load collections from localStorage on mount
  useEffect(() => {
    const savedCollections = localStorage.getItem('jazzGuitarCollections');
    if (savedCollections) {
      try {
        const parsed = JSON.parse(savedCollections);
        setCollections(parsed);
      } catch (error) {
        console.error('Error loading collections from localStorage:', error);
      }
    }
  }, []);

  // Save collections to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('jazzGuitarCollections', JSON.stringify(collections));
  }, [collections]);

  const addCollection = (collection) => {
    setCollections(prev => [...prev, { ...collection, id: Date.now().toString() }]);
  };

  const updateCollection = (id, updates) => {
    setCollections(prev => 
      prev.map(collection => 
        collection.id === id ? { ...collection, ...updates } : collection
      )
    );
  };

  const removeCollection = (id) => {
    setCollections(prev => prev.filter(collection => collection.id !== id));
  };

  const addSessionToCollection = (collectionId, session) => {
    setCollections(prev => 
      prev.map(collection => 
        collection.id === collectionId 
          ? { 
              ...collection, 
              sessions: [...collection.sessions, { ...session, id: Date.now().toString() }]
            }
          : collection
      )
    );
  };

  const updateSessionInCollection = (collectionId, sessionId, updates) => {
    setCollections(prev => 
      prev.map(collection => 
        collection.id === collectionId 
          ? {
              ...collection,
              sessions: collection.sessions.map(session =>
                session.id === sessionId ? { ...session, ...updates } : session
              )
            }
          : collection
      )
    );
  };

  const removeSessionFromCollection = (collectionId, sessionId) => {
    setCollections(prev => 
      prev.map(collection => 
        collection.id === collectionId 
          ? {
              ...collection,
              sessions: collection.sessions.filter(session => session.id !== sessionId)
            }
          : collection
      )
    );
  };

  return {
    collections,
    addCollection,
    updateCollection,
    removeCollection,
    addSessionToCollection,
    updateSessionInCollection,
    removeSessionFromCollection
  };
}; 