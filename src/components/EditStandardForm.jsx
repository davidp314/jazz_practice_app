import React, { useState, useEffect } from "react";
import { STANDARD_STEPS } from "../constants";

const EditStandardForm = ({ standard, onUpdate, onCancel, isDarkMode }) => {
  const [name, setName] = useState(standard.name);
  const [notes, setNotes] = useState(standard.notes || '');
  const [steps, setSteps] = useState([...standard.steps]);
  const [completed, setCompleted] = useState(standard.completed);
  const [active, setActive] = useState(standard.active);

  // Update form state when standard prop changes
  useEffect(() => {
    setName(standard.name);
    setNotes(standard.notes || '');
    setSteps([...standard.steps]);
    setCompleted(standard.completed);
    setActive(standard.active);
  }, [standard]);

  const handleStepToggle = (index) => {
    const newSteps = [...steps];
    newSteps[index] = !newSteps[index];
    setSteps(newSteps);
    
    // Auto-update completed status based on all steps
    const allCompleted = newSteps.every(step => step);
    setCompleted(allCompleted);
  };

  const handleSubmit = () => {
    if (name.trim()) {
      onUpdate(standard.id, {
        name: name.trim(),
        notes: notes.trim(),
        steps,
        completed,
        active
      });
    }
  };

  return (
    <div className={`p-4 rounded-lg mb-4 border transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-orange-900/30 border-orange-700' 
        : 'bg-orange-50 border-orange-200'
    }`}>
      <h3 className={`font-semibold mb-4 transition-colors duration-300 ${
        isDarkMode ? 'text-orange-300' : 'text-orange-800'
      }`}>Edit Standard: {standard.name}</h3>
      
      <div className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-gray-600 border-gray-500 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about this standard..."
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 h-20 resize-none transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Learning Steps</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {STANDARD_STEPS.map((step, index) => (
              <label key={index} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={steps[index]}
                  onChange={() => handleStepToggle(index)}
                  className="rounded"
                />
                <span className={`text-sm transition-colors duration-300 ${
                  steps[index] 
                    ? (isDarkMode ? 'line-through text-gray-500' : 'line-through text-gray-500')
                    : (isDarkMode ? 'text-gray-300' : 'text-gray-800')
                }`}>
                  {step}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              className="rounded"
            />
            <span className={`text-sm font-medium transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-800'
            }`}>Completed</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="rounded"
            />
            <span className={`text-sm font-medium transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-800'
            }`}>Active</span>
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Save Changes
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

export default EditStandardForm; 