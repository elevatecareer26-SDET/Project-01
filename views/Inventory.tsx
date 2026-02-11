
import React, { useState, useMemo } from 'react';
import KpiCard from '../components/KpiCard';

type SortKey = 'name' | 'sku' | 'category' | 'stock' | 'cost' | 'price' | 'status';
type SortDirection = 'asc' | 'desc';

const Inventory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Phones' | 'Accessories' | 'Spare Parts'>('Phones');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>(null);

  const kpis = [
    { label: 'Total Stock Value', value: '$245,800', trend: '+3.2%', trendLabel: 'vs last week', icon: 'inventory', color: '#2563eb', bgLight: 'rgba(37, 99, 235, 0.1)' },
    { label: 'Low Stock Items', value: '18', trend: '-2', trendLabel: 'since yesterday', icon: 'warning', color: '#f59e0b', bgLight: 'rgba(245, 158, 11, 0.1)' },
    { label: 'Inbound Orders', value: '5', trendLabel: 'Arriving this week', icon: 'local_shipping', color: '#8b5cf6', bgLight: 'rgba(139, 92, 246, 0.1)' },
  ];

  const phoneInventory = [
    { name: 'iPhone 15 Pro Max', sku: 'APL-15PM-256-NT', category: 'New Phones', stock: 12, cost: '$950.00', price: '$1,199.00', status: 'In Stock', image: '' },
    { name: 'Samsung S24 Ultra', sku: 'SAM-S24U-512-BK', category: 'New Phones', stock: 8, cost: '$880.00', price: '$1,299.00', status: 'In Stock', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=100' },
    { name: 'iPhone 13 (Pre-owned)', sku: 'USED-APL-13-128', category: 'Used Phones', stock: 2, cost: '$400.00', price: '$550.00', status: 'Low Stock', image: 'https://images.unsplash.com/photo-1633113089631-6456cccaadad?auto=format&fit=crop&q=80&w=100' },
    { name: 'Google Pixel 8 Pro', sku: 'GOG-P8P-128-HZ', category: 'New Phones', stock: 0, cost: '$720.00', price: '$999.00', status: 'Out of Stock', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=100' },
    { name: 'Xiaomi 14', sku: 'XIA-14-256-WH', category: 'New Phones', stock: 15, cost: '$550.00', price: '$799.00', status: 'In Stock', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=100' },
  ];

  const categories = useMemo(() => {
    if (activeTab === 'Phones') return ['All', 'New Phones', 'Used Phones'];
    if (activeTab === 'Accessories') return ['All', 'Cases', 'Chargers', 'Audio', 'Protection'];
    return ['All', 'Screens', 'Batteries', 'Charging Ports', 'Logic Boards'];
  }, [activeTab]);

  const handleSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const parseCurrency = (value: string) => {
    return parseFloat(value.replace(/[^0-9.-]+/g, ""));
  };

  const processedInventory = useMemo(() => {
    // First, filter
    let filtered = phoneInventory.filter(item => {
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.sku.toLowerCase().includes(searchQuery.toLowerCase());
      if (activeTab !== 'Phones' && categoryFilter === 'All') return true; 
      return matchesCategory && matchesSearch;
    });

    // Then, sort
    if (sortConfig !== null) {
      filtered.sort((a: any, b: any) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle numeric sorting for specific keys
        if (sortConfig.key === 'cost' || sortConfig.key === 'price') {
          aValue = parseCurrency(aValue);
          bValue = parseCurrency(bValue);
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [categoryFilter, searchQuery, activeTab, sortConfig]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/30';
      case 'Low Stock': return 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30';
      case 'Out of Stock': return 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30';
      default: return 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-100';
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortConfig?.key !== column) return <span className="material-icons text-xs ml-1 opacity-20">sort</span>;
    return (
      <span className="material-icons text-xs ml-1 text-blue-600 dark:text-blue-400">
        {sortConfig.direction === 'asc' ? 'arrow_upward' : 'arrow_downward'}
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Inventory Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track stock levels, prices, and warehouse availability.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border px-4 py-2 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-all">
            Import CSV
          </button>
          <button 
            onClick={() => { setIsAddModalOpen(true); setSelectedImage(null); }}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 hover:bg-blue-700 active:scale-95 transition-all"
          >
            <span className="material-icons text-sm">add_box</span>
            Add New Item
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi, i) => <KpiCard key={i} data={kpi} />)}
      </div>

      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-slate-100 dark:border-dark-border overflow-hidden transition-colors duration-200">
        <div className="border-b border-slate-100 dark:border-dark-border">
          <div className="flex p-1 gap-1">
            {['Phones', 'Accessories', 'Spare Parts'].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab as any); setCategoryFilter('All'); }}
                className={`px-6 py-3 text-sm font-bold rounded-xl transition-all ${
                  activeTab === tab 
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 border-b border-slate-100 dark:border-dark-border flex flex-col gap-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-lg">search</span>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeTab.toLowerCase()}...`} 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-slate-200" 
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center mr-2">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  categoryFilter === cat
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-dark-border text-slate-600 dark:text-slate-400 hover:border-blue-400 dark:hover:border-blue-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-dark-border">
              <tr>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center">Product <SortIcon column="name" /></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => handleSort('sku')}>
                  <div className="flex items-center">SKU / IMEI <SortIcon column="sku" /></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => handleSort('category')}>
                  <div className="flex items-center">Category <SortIcon column="category" /></div>
                </th>
                <th className="px-6 py-4 text-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => handleSort('stock')}>
                  <div className="flex items-center justify-center">Stock <SortIcon column="stock" /></div>
                </th>
                <th className="px-6 py-4 text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => handleSort('cost')}>
                  <div className="flex items-center justify-end">Cost Price <SortIcon column="cost" /></div>
                </th>
                <th className="px-6 py-4 text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => handleSort('price')}>
                  <div className="flex items-center justify-end">Sale Price <SortIcon column="price" /></div>
                </th>
                <th className="px-6 py-4 text-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => handleSort('status')}>
                  <div className="flex items-center justify-center">Status <SortIcon column="status" /></div>
                </th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
              {processedInventory.length > 0 ? (
                processedInventory.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-12 h-12 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-dark-border"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=Item'; }}
                        />
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.name}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest">Model: 2024</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono text-slate-500 dark:text-slate-500">{item.sku}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">{item.category}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-lg text-sm font-bold ${
                        item.stock === 0 
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                          : item.stock < 5 
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' 
                            : 'text-slate-800 dark:text-slate-200'
                      }`}>
                        {item.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-500 dark:text-slate-400 italic">
                      {item.cost}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-800 dark:text-slate-100">
                      {item.price}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
                          <span className="material-icons text-lg">edit</span>
                        </button>
                        <button className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                          <span className="material-icons text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-icons text-4xl opacity-20">inventory_2</span>
                      <p className="font-medium">No items found matching your search and filter.</p>
                      <button 
                        onClick={() => {setCategoryFilter('All'); setSearchQuery(''); setSortConfig(null);}}
                        className="text-blue-600 dark:text-blue-400 text-sm font-bold hover:underline"
                      >
                        Reset all filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-dark-border flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
          <p>Showing 1 to {processedInventory.length} of {processedInventory.length} items</p>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">Previous</button>
            <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white shadow-sm">1</button>
            <button className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">Next</button>
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="bg-white dark:bg-dark-card rounded-2xl w-full max-w-2xl shadow-2xl relative animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-dark-border flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Add Inventory Item</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">
                <span className="material-icons">close</span>
              </button>
            </div>
            
            <div className="p-6 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 flex flex-col items-center justify-center gap-4">
                  <div className="w-32 h-32 rounded-2xl bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-dark-border overflow-hidden relative flex items-center justify-center">
                    {selectedImage ? (
                      <img src={selectedImage} alt="Selected" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-icons text-slate-300 text-4xl">add_a_photo</span>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                    />
                  </div>
                  <p className="text-xs text-slate-400 font-medium">Click to upload product image</p>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">Product Name</label>
                  <input type="text" placeholder="Enter product name" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 dark:text-slate-200" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">Category</label>
                  <select className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 dark:text-slate-200">
                    <option>New Phones</option>
                    <option>Used Phones</option>
                    <option>Accessories</option>
                    <option>Spare Parts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">SKU / IMEI</label>
                  <input type="text" placeholder="Enter SKU or Scan IMEI" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 dark:text-slate-200" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">Cost Price ($)</label>
                  <input type="number" placeholder="0.00" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 dark:text-slate-200 font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">Sale Price ($)</label>
                  <input type="number" placeholder="0.00" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 dark:text-slate-200 font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">Initial Stock</label>
                  <input type="number" defaultValue="0" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 dark:text-slate-200" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">Low Stock Threshold</label>
                  <input type="number" defaultValue="5" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 dark:text-slate-200" />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-dark-border flex justify-end gap-3">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Cancel
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
