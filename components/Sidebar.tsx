
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', icon: 'dashboard', path: '/dashboard', section: 'Main' },
    { label: 'Sales Management', icon: 'point_of_sale', path: '/sales', section: 'Main' },
    { label: 'Inventory', icon: 'inventory_2', path: '/inventory', section: 'Main' },
    { label: 'Repair Services', icon: 'build', path: '/repairs', section: 'Main' },
    { label: 'Accessories', icon: 'extension', path: '/accessories', section: 'Management' },
    { label: 'Customers', icon: 'people', path: '/customers', section: 'Management' },
    { label: 'Expenses', icon: 'receipt', path: '/expenses', section: 'Finance' },
    { label: 'Payments & Dues', icon: 'account_balance_wallet', path: '/payments', section: 'Finance' },
    { label: 'Reports', icon: 'bar_chart', path: '/reports', section: 'System' },
  ];

  const sections = ['Main', 'Management', 'Finance', 'System'];

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-0'} bg-[#111827] text-gray-400 flex flex-col transition-all duration-300 h-full overflow-hidden z-20`}>
      <div className="h-16 flex items-center px-6 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="material-icons text-white text-sm">smartphone</span>
          </div>
          <span className="text-white font-bold text-lg tracking-tight whitespace-nowrap">MobMastery</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-6">
        {sections.map(section => (
          <div key={section}>
            <p className="px-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">{section}</p>
            <div className="space-y-1">
              {menuItems.filter(item => item.section === section).map(item => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <span className={`material-icons text-[20px] ${isActive ? 'text-white' : 'text-gray-500'}`}>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-3 p-2">
          <img 
            src="https://picsum.photos/seed/manager/64/64" 
            alt="Alex" 
            className="w-9 h-9 rounded-full ring-2 ring-gray-700" 
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">Nayyar</p>
            <p className="text-xs text-gray-500 truncate">Store Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
