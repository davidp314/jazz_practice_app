import React, { useEffect, useState } from 'react';

const CelebrationModal = ({ isOpen, onClose, achievement, isDarkMode }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getAchievementMessage = () => {
    switch (achievement.type) {
      case 'daily_goal':
        return `🎉 Congratulations! You've reached your ${achievement.goal} day streak goal!`;
      case 'weekly_goal':
        return `🎉 Amazing! You've practiced ${achievement.days} days this week, reaching your goal!`;
      default:
        return '🎉 Great job! You\'ve achieved a new milestone!';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`relative rounded-lg shadow-xl p-8 max-w-md w-full text-center transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Confetti effect */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random() * 2}s`
                }}
              >
                {['🎉', '🎊', '⭐', '🏆', '🔥'][Math.floor(Math.random() * 5)]}
              </div>
            ))}
          </div>
        )}

        <div className="relative z-10">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Achievement Unlocked!
          </h2>
          <p className={`text-lg mb-6 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {getAchievementMessage()}
          </p>
          <button
            onClick={onClose}
            className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
              isDarkMode 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Keep Going! 💪
          </button>
        </div>
      </div>
    </div>
  );
};

export default CelebrationModal; 