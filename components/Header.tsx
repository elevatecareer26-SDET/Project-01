
import React from 'react';

interface HeaderProps {
  onMenuClick: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, isDarkMode, toggleDarkMode }) => {
  return (
    <header className="h-16 bg-white dark:bg-dark-card border-b border-slate-200 dark:border-dark-border flex items-center justify-between px-6 z-10 flex-shrink-0 transition-colors duration-200">
      <div className="flex items-center gap-4 flex-1">
        <button onClick={onMenuClick} className="p-2 -ml-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          <span className="material-icons">menu</span>
        </button>
        <div className="relative max-w-md w-full hidden sm:block">
          <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-lg">search</span>
          <input 
            type="text" 
            placeholder="Search IMEI, Orders, Customers..." 
            className="w-full bg-slate-50 dark:bg-slate-900/50 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 dark:text-slate-200 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button 
          onClick={toggleDarkMode}
          className="p-2 text-slate-400 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <span className="material-icons">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
        </button>
        
        <button className="relative p-2 text-slate-400 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
          <span className="material-icons">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-dark-card"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-200 dark:bg-dark-border mx-1 md:mx-2"></div>
        
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-500 transition-all">
            AM
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
