import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import DarkModeToggle from "./DarkModeToggle";
import CollectionCard from "./CollectionCard";


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
  const localCollectionFileInputRef = useRef(null);
  
  const stats = getCollectionStats();
  const availableSessions = getAvailableSessions();
  const lockedSessions = getLockedSessions();

  const handleImportClick = () => {
    if (localCollectionFileInputRef.current) {
      localCollectionFileInputRef.current.click();
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      onImportSession(event);
    }
  };

  const localTriggerImport = () => {
    if (localCollectionFileInputRef.current) {
      localCollectionFileInputRef.current.click();
    }
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
            <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} square />
            <button
              onClick={onBack}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-500 text-white hover:bg-gray-600'
              }`}
            >
              Back
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className={`p-4 rounded-lg border transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
          }`}>
            <div className={`text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>Total Collections</div>
            <div className={`text-2xl font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>{stats.totalCollections}</div>
          </div>
          <div className={`p-4 rounded-lg border transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
          }`}>
            <div className={`text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>Available Sessions</div>
            <div className={`text-2xl font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>{availableSessions.length}</div>
          </div>
          <div className={`p-4 rounded-lg border transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
          }`}>
            <div className={`text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>Locked Sessions</div>
            <div className={`text-2xl font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>{lockedSessions.length}</div>
          </div>
          <div className={`p-4 rounded-lg border transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
          }`}>
            <div className={`text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>Completed</div>
            <div className={`text-2xl font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>{stats.completedSessions}</div>
          </div>
        </div>

        {/* Import Section */}
        <div className={`p-4 rounded-lg border-2 border-dashed mb-6 transition-colors duration-300 ${
          isDarkMode 
            ? 'border-gray-600 bg-gray-700/50' 
            : 'border-gray-300 bg-gray-50'
        }`}>
          <div className="text-center">
            <Upload className={`mx-auto mb-2 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} size={24} />
            <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>Import Collection</h3>
            <p className={`text-sm mb-4 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Upload a collection file to add new practice sessions
            </p>
            <button
              onClick={handleImportClick}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                isDarkMode
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Choose File
            </button>
            <input
              ref={localCollectionFileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* Collections List */}
        <div className="space-y-6">
          {collections.map((collection) => {
            // Handle both collection objects with sessions and individual session objects
            if (collection.sessions && Array.isArray(collection.sessions)) {
              // This is a collection with multiple sessions
              const seriesSessions = getSeriesSessions(collection.id);
              const seriesProgress = getSeriesProgress(collection.id);
              
              return (
                <div key={collection.id} className={`p-6 rounded-lg border transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                }`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
                        isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}>{collection.name}</h3>
                      <p className={`text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>{collection.description}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>Progress</div>
                      <div className={`text-lg font-bold transition-colors duration-300 ${
                        isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}>{seriesProgress.completed}/{seriesProgress.total}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {seriesSessions.map((session) => {
                      const dependencyStatus = getSessionDependencyStatus(session);
                      const isCompleted = session.status === 'completed';
                      const isLocked = dependencyStatus === 'locked';
                      
                      return (
                        <CollectionCard
                          key={session.id}
                          session={session}
                          onSelect={() => onSelectSession(session)}
                          onExport={() => onExportSession(session)}
                          isDarkMode={isDarkMode}
                          completed={isCompleted}
                          dependencyStatus={dependencyStatus}
                          locked={isLocked}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            } else {
              // This is an individual session
              const dependencyStatus = getSessionDependencyStatus(collection);
              const isCompleted = collection.status === 'completed';
              const isLocked = dependencyStatus === 'locked';
              
              return (
                <div key={collection.id} className={`p-6 rounded-lg border transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                }`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
                        isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}>{collection.name}</h3>
                      <p className={`text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>{collection.description}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>Status</div>
                      <div className={`text-lg font-bold transition-colors duration-300 ${
                        isCompleted 
                          ? (isDarkMode ? 'text-green-400' : 'text-green-600')
                          : (isDarkMode ? 'text-blue-400' : 'text-blue-600')
                      }`}>
                        {isCompleted ? 'Completed' : 'Available'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <CollectionCard
                      session={collection}
                      onSelect={() => onSelectSession(collection)}
                      onExport={() => onExportSession(collection)}
                      isDarkMode={isDarkMode}
                      completed={isCompleted}
                      dependencyStatus={dependencyStatus}
                      locked={isLocked}
                    />
                  </div>
                </div>
              );
            }
          })}
        </div>

        {collections.length === 0 && (
          <div className="text-center py-12">
            <p className={`text-lg transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>No collections available.</p>
            <p className={`text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>Import a collection to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionsView; 