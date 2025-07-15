import React, { useState } from "react";

const AddStandardForm = ({ onAdd, onCancel, isDarkMode }) => {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (name.trim()) {
      onAdd(name.trim());
      setName('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className={`p-4 rounded-lg mb-4 transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
    }`}>
      <div className="flex gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter standard name..."
          className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-800'
          }`}
          autoFocus
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Add
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddStandardForm; 