export const exportData = (standards, otherWork, practiceHistory, collections) => {
  const data = {
    standards,
    otherWork,
    practiceHistory,
    collections,
    exportDate: new Date().toISOString(),
    version: '1.0'
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `jazz-guitar-practice-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importData = async (event) => {
  const file = event.target.files[0];
  if (!file) return null;

  try {
    const text = await file.text();
    const data = JSON.parse(text);
    
    // Validate the imported data structure
    if (!data.standards || !data.otherWork || !data.practiceHistory) {
      throw new Error('Invalid data format');
    }
    
    return data;
  } catch (error) {
    console.error('Error importing data:', error);
    alert('Error importing data. Please check the file format.');
    return null;
  }
};

export const exportCollection = (session) => {
  const data = {
    session,
    exportDate: new Date().toISOString(),
    version: '1.0'
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${session.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importCollection = async (event) => {
  const file = event.target.files[0];
  if (!file) return null;

  try {
    const text = await file.text();
    const data = JSON.parse(text);
    
    // Handle single session import
    if (data.session && data.session.name && data.session.tasks) {
      return data.session;
    }
    
    // Handle series import
    if (data.type === 'teacher_session_series' && data.sessions && Array.isArray(data.sessions)) {
      // Create a collection object containing all sessions from the series
      const collection = {
        id: `series_${Date.now()}`,
        name: data.seriesName || 'Imported Series',
        description: data.description || 'Imported teacher session series',
        type: 'series',
        teacherName: data.teacherName,
        sessions: data.sessions.map((session, index) => ({
          ...session,
          name: session.title, // Map title to name for compatibility
          id: `session_${Date.now()}_${index}`,
          assignedDate: session.assignedDate || new Date().toISOString(),
          status: session.status || 'pending',
          completed: session.completed || false,
          completionDate: session.completionDate || null,
          studentNotes: session.studentNotes || ''
        }))
      };
      
      return collection;
    }
    
    // Handle single teacher session import
    if (data.type === 'teacher_session' && data.session && data.session.title && data.session.tasks) {
      return {
        ...data.session,
        name: data.session.title, // Map title to name for compatibility
        id: `imported_${Date.now()}`,
        assignedDate: new Date().toISOString(),
        status: 'pending',
        completed: false,
        completionDate: null,
        studentNotes: ''
      };
    }
    
    throw new Error('Invalid collection format');
  } catch (error) {
    console.error('Error importing collection:', error);
    alert('Error importing collection. Please check the file format.');
    return null;
  }
}; 