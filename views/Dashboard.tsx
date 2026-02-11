
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import KpiCard from '../components/KpiCard';
import { KpiData } from '../types';

interface DashboardProps {
  isDarkMode: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ isDarkMode }) => {
  const textColor = isDarkMode ? '#94a3b8' : '#64748b';
  const gridColor = isDarkMode ? '#334155' : '#f1f5f9';

  const kpis: KpiData[] = [
    { label: 'Total Sales', value: '$124,500', trend: '+12%', trendLabel: 'vs last month', icon: 'payments', color: '#2563eb', bgLight: isDarkMode ? 'rgba(37, 99, 235, 0.1)' : '#eff6ff' },
    { label: 'Accessories', value: '$8,200', trend: '+5%', trendLabel: 'vs last month', icon: 'headphones', color: '#8b5cf6', bgLight: isDarkMode ? 'rgba(139, 92, 246, 0.1)' : '#f5f3ff' },
    { label: 'Service', value: '$4,100', trend: '-2%', trendLabel: 'vs last month', icon: 'build', color: '#f59e0b', bgLight: isDarkMode ? 'rgba(245, 158, 11, 0.1)' : '#fffbeb' },
    { label: 'Expenses', value: '$32,000', trendLabel: 'Total operational', icon: 'receipt', color: '#ef4444', bgLight: isDarkMode ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2' },
    { label: 'Payments In', value: '$55,000', trendLabel: 'Received today', icon: 'arrow_downward', color: '#10b981', bgLight: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : '#ecfdf5' },
    { label: 'Payments Out', value: '$12,000', trendLabel: 'Paid today', icon: 'arrow_upward', color: '#ec4899', bgLight: isDarkMode ? 'rgba(236, 72, 153, 0.1)' : '#fdf2f8' },
  ];

  const salesData = [
    { name: 'Mon', value: 3000 },
    { name: 'Tue', value: 4500 },
    { name: 'Wed', value: 3800 },
    { name: 'Thu', value: 6200 },
    { name: 'Fri', value: 5400 },
    { name: 'Sat', value: 7800 },
    { name: 'Sun', value: 8500 },
  ];

  const flowData = [
    { name: 'W1', inc: 8000, exp: 4000 },
    { name: 'W2', inc: 6000, exp: 5000 },
    { name: 'W3', inc: 9500, exp: 3000 },
    { name: 'W4', inc: 7000, exp: 4500 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Welcome back, here's what's happening at your store today.</p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center px-4 py-2 border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card text-sm font-semibold rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
            <span className="material-icons text-base mr-2">download</span>
            Export
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-sm font-semibold rounded-lg text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
            <span className="material-icons text-base mr-2">add</span>
            New Sale
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {kpis.map((kpi, idx) => (
          <KpiCard key={idx} data={kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-dark-card rounded-xl shadow-sm p-6 border border-slate-100 dark:border-dark-border flex flex-col h-96 transition-colors duration-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Sales Overview</h3>
            <select className="bg-slate-50 dark:bg-slate-800 border-none text-xs rounded-lg px-2 py-1 text-slate-600 dark:text-slate-300 focus:ring-0 cursor-pointer">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: textColor }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: textColor }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDarkMode ? '#1e293b' : '#fff',
                    borderRadius: '8px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    color: isDarkMode ? '#f1f5f9' : '#1e293b'
                  }}
                  itemStyle={{ color: '#2563eb' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#2563eb" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: isDarkMode ? '#1e293b' : '#fff' }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm p-6 border border-slate-100 dark:border-dark-border flex flex-col h-96 transition-colors duration-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Income vs Expense</h3>
            <div className="flex gap-2">
              <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span> Inc
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></span> Exp
              </div>
            </div>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={flowData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: textColor }} 
                  dy={10}
                />
                <Tooltip 
                  cursor={{ fill: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f8fafc' }}
                  contentStyle={{ 
                    backgroundColor: isDarkMode ? '#1e293b' : '#fff',
                    borderRadius: '8px', 
                    border: 'none'
                  }}
                />
                <Bar dataKey="inc" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={16} />
                <Bar dataKey="exp" fill={isDarkMode ? '#475569' : '#cbd5e1'} radius={[4, 4, 0, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-slate-100 dark:border-dark-border overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-dark-border flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Low Stock Alerts</h3>
            <a href="#" className="text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline">View Inventory</a>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">SKU</th>
                  <th className="px-6 py-3 text-center">Stock</th>
                  <th className="px-6 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
                {[
                  { name: 'iPhone 14 Pro Max', sku: 'APL-14PM-128', stock: 2, status: 'Critical', color: 'red' },
                  { name: 'Samsung S23 Ultra', sku: 'SAM-S23U-256', stock: 4, status: 'Low', color: 'amber' },
                  { name: 'AirPods Pro Gen 2', sku: 'APL-APP-G2', stock: 1, status: 'Critical', color: 'red' },
                ].map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">{item.name}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono">{item.sku}</td>
                    <td className="px-6 py-4 text-center font-bold text-slate-800 dark:text-slate-200">{item.stock}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        item.color === 'red' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-slate-100 dark:border-dark-border overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-dark-border flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Recent Transactions</h3>
            <a href="#" className="text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline">View All</a>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">ID & Date</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
                {[
                  { id: '#TRX-9821', date: 'Today, 10:42 AM', customer: 'John Doe', initial: 'JD', type: 'Sale', amount: '+$1,299.00', color: 'green' },
                  { id: '#REP-4022', date: 'Today, 09:15 AM', customer: 'Sarah A.', initial: 'SA', type: 'Repair', amount: '+$150.00', color: 'blue' },
                  { id: '#EXP-0021', date: 'Yesterday, 4:00 PM', customer: 'TechParts', initial: 'TP', type: 'Expense', amount: '-$450.00', color: 'slate' },
                ].map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{item.id}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">{item.date}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-[10px] font-bold text-blue-600 dark:text-blue-400">
                          {item.initial}
                        </div>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{item.customer}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        item.color === 'green' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 
                        item.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-right font-bold ${item.amount.startsWith('+') ? 'text-slate-800 dark:text-slate-100' : 'text-red-500 dark:text-red-400'}`}>
                      {item.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
