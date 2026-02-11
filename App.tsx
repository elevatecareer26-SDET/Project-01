
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './views/Dashboard';
import Sales from './views/Sales';
import Repairs from './views/Repairs';
import Expenses from './views/Expenses';
import Payments from './views/Payments';
import Accessories from './views/Accessories';
import Inventory from './views/Inventory';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('mobmastery-theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('mobmastery-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('mobmastery-theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <Router>
      <div className="flex h-screen overflow-hidden text-slate-800 dark:text-slate-100">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header 
            onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            isDarkMode={isDarkMode} 
            toggleDarkMode={toggleDarkMode}
          />
          
          <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f6f6f8] dark:bg-dark-bg transition-colors duration-200">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/dashboard" element={<Dashboard isDarkMode={isDarkMode} />} />
                <Route path="/sales" element={<Sales />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/repairs" element={<Repairs />} />
                <Route path="/expenses" element={<Expenses />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/accessories" element={<Accessories />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
