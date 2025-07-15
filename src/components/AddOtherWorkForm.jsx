import React, { useState } from "react";

const AddOtherWorkForm = ({ onAdd, onCancel, isDarkMode }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (name.trim()) {
      onAdd(name.trim(), description.trim());
      setName('');
      setDescription('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      handleSubmit();
    }
  };

  return (
    <div className={`p-4 rounded-lg mb-4 transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
    }`}>
      <div className="space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter name (e.g., 'Galbraith Etude #5')..."
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-800'
          }`}
          autoFocus
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)..."
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-800'
          }`}
        />
        <div className="flex gap-3">
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
    </div>
  );
};

export default AddOtherWorkForm; 