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
    
    // Validate the imported collection data structure
    if (!data.session || !data.session.name || !data.session.tasks) {
      throw new Error('Invalid collection format');
    }
    
    return data.session;
  } catch (error) {
    console.error('Error importing collection:', error);
    alert('Error importing collection. Please check the file format.');
    return null;
  }
}; 