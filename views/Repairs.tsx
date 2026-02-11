
import React, { useState } from 'react';
import { ServiceTicket } from '../types';

interface ServiceTicketWithImage extends ServiceTicket {
  deviceImage?: string;
}

const Repairs: React.FC = () => {
  const [selectedDeviceImage, setSelectedDeviceImage] = useState<string | null>(null);

  const activeQueue: ServiceTicketWithImage[] = [
    { id: '#REP-001', customer: 'John Doe', device: 'iPhone 13 Pro', problem: 'Screen Replacement', tech: 'Alex M.', charges: 120, status: 'Pending', avatar: 'https://picsum.photos/seed/tech1/48/48', deviceImage: 'https://images.unsplash.com/photo-1633113089631-6456cccaadad?auto=format&fit=crop&q=80&w=100' },
    { id: '#REP-002', customer: 'Sarah Smith', device: 'Galaxy S22', problem: 'Battery Issue', tech: 'Sam W.', charges: 80, status: 'Completed', avatar: 'https://picsum.photos/seed/tech2/48/48', deviceImage: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=100' },
    { id: '#REP-003', customer: 'Emily Chen', device: 'MacBook Air M1', problem: 'Keyboard Repair', tech: 'David R.', charges: 150, status: 'In Progress', avatar: 'https://picsum.photos/seed/tech3/48/48', deviceImage: 'https://images.unsplash.com/photo-1611186871348-b1ec696e52c9?auto=format&fit=crop&q=80&w=100' },
    { id: '#REP-004', customer: 'Michael Jordan', device: 'iPad Pro 11', problem: 'Charging Port', tech: 'Alex M.', charges: 95, status: 'Pending', avatar: 'https://picsum.photos/seed/tech1/48/48', deviceImage: 'https://images.unsplash.com/photo-1544244015-0cd4b3ff8f90?auto=format&fit=crop&q=80&w=100' },
  ];

  const handleDeviceImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedDeviceImage(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-dark-border transition-colors duration-200">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <span className="material-icons">add_task</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">New Service Entry</h2>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">Create a new repair ticket</p>
            </div>
          </div>

          <form className="space-y-4">
            <div className="flex flex-col items-center justify-center gap-3 mb-4">
               <div className="w-full h-32 rounded-xl bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-dark-border overflow-hidden relative flex items-center justify-center group">
                {selectedDeviceImage ? (
                  <img src={selectedDeviceImage} alt="Device" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <span className="material-icons text-slate-300 text-3xl">camera_alt</span>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Add Device Photo</p>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleDeviceImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Customer Name</label>
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 text-lg">person</span>
                <input type="text" placeholder="e.g. John Doe" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 dark:text-slate-200" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Phone</label>
                <input type="tel" placeholder="(555) 000-0000" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 dark:text-slate-200" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Email</label>
                <input type="email" placeholder="john@email.com" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 dark:text-slate-200" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Device Model</label>
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 text-lg">smartphone</span>
                <input type="text" placeholder="e.g. iPhone 14 Pro Max" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 dark:text-slate-200" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Problem Diagnosis</label>
              <textarea placeholder="Describe the issue..." className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 h-24 resize-none dark:text-slate-200"></textarea>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Estimated Charges</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-bold">$</span>
                <input type="number" placeholder="0.00" className="w-full pl-7 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500/20" />
              </div>
            </div>
            <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2">
              <span className="material-icons text-base">save</span>
              Create Ticket
            </button>
          </form>
        </div>

        <div className="bg-blue-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg shadow-blue-600/20">
          <div className="relative z-10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-1">Queue Status</h3>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-bold">12</span>
              <span className="text-sm text-blue-100">pending repairs</span>
            </div>
            <div className="w-full bg-blue-400/30 rounded-full h-1.5 mb-2">
              <div className="bg-white h-1.5 rounded-full w-[45%]"></div>
            </div>
            <p className="text-[10px] text-blue-100 uppercase tracking-wider font-bold">45% OF DAILY CAPACITY UTILIZED</p>
          </div>
          <span className="material-icons absolute -right-4 -bottom-4 text-[8rem] text-blue-500/30">engineering</span>
        </div>
      </div>

      <div className="lg:col-span-8 bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-slate-100 dark:border-dark-border overflow-hidden flex flex-col h-fit transition-colors duration-200">
        <div className="p-6 border-b border-slate-100 dark:border-dark-border flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Active Service Queue</h2>
          <div className="flex gap-2">
            <select className="text-xs bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-3 py-1.5 focus:ring-0 dark:text-slate-300">
              <option>All Statuses</option>
              <option>Pending</option>
              <option>In Progress</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-dark-border">
              <tr>
                <th className="px-6 py-4">Customer & Device</th>
                <th className="px-6 py-4">Problem</th>
                <th className="px-6 py-4">Technician</th>
                <th className="px-6 py-4 text-right">Charges</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
              {activeQueue.map((ticket, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={ticket.deviceImage} alt={ticket.device} className="w-10 h-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-800" />
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{ticket.customer}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold">{ticket.device}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-800 dark:text-slate-300">{ticket.problem}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">Diagnosis recorded</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <img src={ticket.avatar} alt={ticket.tech} className="w-6 h-6 rounded-full grayscale group-hover:grayscale-0 transition-all opacity-80" />
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">{ticket.tech}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-800 dark:text-slate-100">${ticket.charges.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      ticket.status === 'Pending' ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-100 dark:border-yellow-900/30' :
                      ticket.status === 'In Progress' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30' :
                      'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/30'
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100 dark:border-dark-border flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium bg-slate-50 dark:bg-slate-800/20">
          <p>Showing 1 to 4 of 12 entries</p>
          <div className="flex gap-1">
            <button className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700">Prev</button>
            <button className="px-2 py-1 rounded bg-blue-600 text-white">1</button>
            <button className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700">2</button>
            <button className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Repairs;
