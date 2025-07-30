import React from 'react';
import { Moon, Sun, CheckSquare } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode }) => {
  return (
    <header className="flex items-center justify-between mb-8 theme-optimized">
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-to-r from-purple-500 to-orange-500 p-3 rounded-xl shadow-lg">
          <CheckSquare className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
            Todo Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 theme-transition">Stay organized and track your progress</p>
        </div>
      </div>
      
      <button
        onClick={toggleDarkMode}
        className="btn-secondary p-3 rounded-xl transition-all duration-200 hover:scale-105"
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </button>
    </header>
  );
};

export default Header;
