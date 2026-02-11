
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Transaction, SaleItem, CartItem } from '../types';

const Sales: React.FC = () => {
  // --- Persistent State ---
  const [inventory, setInventory] = useState<SaleItem[]>([
    { id: '1', name: 'iPhone 15 Pro', brand: 'Apple', model: 'A3102', storage: '256GB', color: 'Natural Titanium', barcode: '1001', price: 1199, costPrice: 950, stock: 12, category: 'Phones', image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=200' },
    { id: '2', name: 'S24 Ultra', brand: 'Samsung', model: 'SM-S928', storage: '512GB', color: 'Titanium Black', barcode: '1002', price: 1299, costPrice: 1050, stock: 8, category: 'Phones', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200' },
    { id: '3', name: 'AirPods Pro 2', brand: 'Apple', model: 'A2698', storage: '-', color: 'White', barcode: '2001', price: 249, costPrice: 180, stock: 25, category: 'Accessories', image: 'https://images.unsplash.com/photo-1588156979435-379b9d802b0a?w=200' },
    { id: '4', name: '20W Adapter', brand: 'Apple', model: 'A2305', storage: '-', color: 'White', barcode: '2002', price: 25, costPrice: 12, stock: 50, category: 'Accessories', image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=200' },
    { id: '5', name: 'Leather Case', brand: 'Apple', model: 'iPhone 15', storage: '-', color: 'Midnight', barcode: '2003', price: 59, costPrice: 30, stock: 15, category: 'Accessories', image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=200' },
  ]);

  const [salesRecords, setSalesRecords] = useState<Transaction[]>([
    { 
      slNo: 1, id: 'INV-10001', date: '2024-03-20 10:45 AM', customer: 'James Anderson', phone: '555-0102', 
      items: [], subtotal: 1199, tax: 0, discount: 0, grandTotal: 1199, cashPaid: 1200, onlinePaid: 0, change: 1,
      gotGift: true, salesman: 'Nayyar', status: 'completed'
    }
  ]);

  // --- POS Session State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState({ name: '', phone: '' });
  const [payment, setPayment] = useState({ cash: 0, online: 0 });
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [gstEnabled, setGstEnabled] = useState(false);
  const [gotGift, setGotGift] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<SaleItem | null>(null);
  const [productSearch, setProductSearch] = useState('');

  const barcodeRef = useRef<HTMLInputElement>(null);

  // --- Utilities ---
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // --- Calculations ---
  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.cartQuantity) - item.itemDiscount, 0), [cart]);
  const tax = useMemo(() => gstEnabled ? subtotal * 0.18 : 0, [subtotal, gstEnabled]);
  const grandTotal = useMemo(() => Math.round((subtotal + tax - globalDiscount) * 100) / 100, [subtotal, tax, globalDiscount]);
  const changeToReturn = useMemo(() => Math.max(0, (payment.cash + payment.online) - grandTotal), [payment, grandTotal]);

  // --- POS Actions ---
  const addToCart = (product: SaleItem) => {
    if (product.stock <= 0) {
      showToast("Out of stock", "error");
      return;
    }
    
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.cartQuantity >= product.stock) {
          showToast("Maximum available stock reached", "error");
          return prev;
        }
        return prev.map(item => item.id === product.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item);
      }
      return [...prev, { ...product, cartQuantity: 1, itemDiscount: 0 }];
    });
    showToast(`${product.name} added to cart`);
    setBarcodeInput('');
    barcodeRef.current?.focus();
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.cartQuantity + delta;
        const product = inventory.find(p => p.id === id);
        if (newQty > 0 && product && newQty <= product.stock) {
          return { ...item, cartQuantity: newQty };
        }
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = inventory.find(p => p.barcode === barcodeInput);
    if (product) {
      addToCart(product);
    } else {
      showToast("Barcode not found", "error");
    }
    setBarcodeInput('');
  };

  const finalizeSale = () => {
    if (cart.length === 0) { showToast("Cart is empty", "error"); return; }
    if (payment.cash + payment.online < grandTotal) { showToast("Insufficient payment", "error"); return; }

    // Deduct Stock
    const updatedInventory = inventory.map(item => {
      const cartItem = cart.find(ci => ci.id === item.id);
      if (cartItem) {
        return { ...item, stock: item.stock - cartItem.cartQuantity };
      }
      return item;
    });
    setInventory(updatedInventory);

    // Save Record
    const newTransaction: Transaction = {
      slNo: salesRecords.length + 1,
      id: `INV-${10000 + salesRecords.length + 1}`,
      date: new Date().toLocaleString(),
      customer: customer.name || 'Walk-in',
      phone: customer.phone || '-',
      items: cart,
      subtotal,
      tax,
      discount: globalDiscount,
      grandTotal,
      cashPaid: payment.cash,
      onlinePaid: payment.online,
      change: changeToReturn,
      gotGift,
      salesman: 'Nayyar',
      status: 'completed'
    };

    setSalesRecords([newTransaction, ...salesRecords]);
    showToast("Sale finalized successfully!");
    resetPOS();
    setIsModalOpen(false);
  };

  const resetPOS = () => {
    setCart([]);
    setCustomer({ name: '', phone: '' });
    setPayment({ cash: 0, online: 0 });
    setGlobalDiscount(0);
    setGstEnabled(false);
    setGotGift(false);
    setSelectedProduct(null);
  };

  // --- Keyboard Shortcuts ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        setIsModalOpen(true);
      }
      if (e.key === 'Escape' && isModalOpen) {
        resetPOS();
        setIsModalOpen(false);
      }
      if (e.key === 'F4' && isModalOpen) {
        e.preventDefault();
        finalizeSale();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, cart, payment, grandTotal]);

  // --- Filter Records ---
  const [listSearch, setListSearch] = useState('');
  const filteredSales = useMemo(() => {
    return salesRecords.filter(r => 
      r.customer.toLowerCase().includes(listSearch.toLowerCase()) ||
      r.id.toLowerCase().includes(listSearch.toLowerCase())
    );
  }, [salesRecords, listSearch]);

  const todaySales = useMemo(() => filteredSales.reduce((a, b) => a + b.grandTotal, 0), [filteredSales]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Toast Notifications */}
      {toast && (
        <div className={`fixed top-8 right-8 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce ${
          toast.type === 'error' ? 'bg-red-600' : 'bg-slate-900'
        } text-white`}>
          <span className="material-icons">{toast.type === 'error' ? 'error' : 'check_circle'}</span>
          <span className="font-bold">{toast.msg}</span>
        </div>
      )}

      {/* Top Summary Bar */}
      <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-dark-border flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Sales Management</h1>
          <p className="text-slate-500 text-sm">Track daily performance and manage retail transactions.</p>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Today's Sales</p>
            <p className="text-2xl font-black text-blue-600">${todaySales.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Orders</p>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{filteredSales.length}</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <span className="material-icons text-sm">point_of_sale</span>
            New Sale (F2)
          </button>
        </div>
      </div>

      {/* Main Records Table */}
      <div className="bg-white dark:bg-dark-card rounded-3xl shadow-sm border border-slate-100 dark:border-dark-border overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-dark-border flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input 
              type="text" 
              placeholder="Search invoices, customers..." 
              value={listSearch}
              onChange={(e) => setListSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-sm"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-dark-border">
              <tr>
                <th className="px-6 py-4">SL</th>
                <th className="px-6 py-4">Invoice #</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 text-slate-400 font-mono text-xs">{sale.slNo}</td>
                  <td className="px-6 py-4 font-bold text-blue-600">{sale.id}</td>
                  <td className="px-6 py-4 text-xs text-slate-500">{sale.date}</td>
                  <td className="px-6 py-4 font-semibold">{sale.customer}</td>
                  <td className="px-6 py-4 text-right font-black text-slate-900 dark:text-slate-100">${sale.grandTotal.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-[10px] font-black uppercase border border-green-100">Paid</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><span className="material-icons">receipt</span></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* POS TERMINAL MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300"></div>
          
          <div className="relative bg-white dark:bg-dark-card w-full h-full lg:max-w-[95%] lg:h-[95vh] lg:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* POS Header */}
            <div className="px-8 py-4 border-b border-slate-100 dark:border-dark-border flex justify-between items-center bg-white dark:bg-dark-card z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-600/20">
                  <span className="material-icons text-2xl">point_of_sale</span>
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight uppercase">New POS Transaction</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">F2: New | F4: Pay | ESC: Close</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-100 dark:border-dark-border">
                  <span className="material-icons text-blue-500">qr_code_scanner</span>
                  <form onSubmit={handleBarcodeSubmit}>
                    <input 
                      ref={barcodeRef}
                      autoFocus
                      type="text" 
                      placeholder="SCAN BARCODE..." 
                      className="bg-transparent border-none focus:ring-0 text-sm font-black dark:text-slate-100 w-40 uppercase"
                      value={barcodeInput}
                      onChange={(e) => setBarcodeInput(e.target.value)}
                    />
                  </form>
                </div>
                <button onClick={() => { resetPOS(); setIsModalOpen(false); }} className="w-10 h-10 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all flex items-center justify-center">
                  <span className="material-icons">close</span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 h-full">
              
              {/* LEFT COLUMN: Product Catalog */}
              <div className="lg:col-span-3 p-6 bg-slate-50 dark:bg-slate-900/40 border-r border-slate-100 dark:border-dark-border flex flex-col gap-6 overflow-hidden">
                <div className="space-y-4 flex flex-col h-full">
                  <div className="relative">
                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input 
                      type="text" 
                      placeholder="Quick Find..." 
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border-none rounded-2xl shadow-sm text-sm"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                    />
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                    {inventory
                      .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()))
                      .map(p => (
                      <button 
                        key={p.id}
                        onClick={() => addToCart(p)}
                        className="w-full p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-dark-border text-left hover:border-blue-500 hover:shadow-xl transition-all active:scale-95 group flex items-center gap-4"
                      >
                        <div className="w-12 h-12 rounded-xl bg-slate-50 overflow-hidden">
                           <img src={p.image} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-800 dark:text-slate-100 truncate">{p.name}</p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-blue-600 font-black">${p.price}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${p.stock < 5 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>Stock: {p.stock}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <button className="w-full py-4 bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-dark-border rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-blue-400 hover:text-blue-500 transition-all">
                    + Custom Accessory
                  </button>
                </div>
              </div>

              {/* MIDDLE COLUMN: Cart & Details */}
              <div className="lg:col-span-6 p-6 flex flex-col gap-6 overflow-hidden">
                {/* Live Product Display (Selected Item) */}
                {cart.length > 0 ? (
                  <div className="h-40 bg-blue-600 rounded-[2rem] p-6 text-white flex gap-6 items-center shadow-2xl shadow-blue-600/30 animate-in slide-in-from-top-4">
                    <img src={cart[cart.length-1].image} className="w-24 h-24 rounded-2xl object-cover shadow-2xl border-4 border-white/20" alt="" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">{cart[cart.length-1].brand}</span>
                        <span className="bg-white/20 px-2 py-0.5 rounded-lg text-[9px] font-bold">{cart[cart.length-1].barcode}</span>
                      </div>
                      <h3 className="text-2xl font-black tracking-tight">{cart[cart.length-1].name}</h3>
                      <div className="flex gap-4 mt-2">
                        <div className="text-[10px] font-bold uppercase"><p className="opacity-60">Storage</p><p>{cart[cart.length-1].storage}</p></div>
                        <div className="text-[10px] font-bold uppercase"><p className="opacity-60">Color</p><p>{cart[cart.length-1].color}</p></div>
                        <div className="text-[10px] font-bold uppercase"><p className="opacity-60">Available</p><p className="text-green-300">{inventory.find(i=>i.id===cart[cart.length-1].id)?.stock}</p></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-40 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border-4 border-dashed border-slate-100 dark:border-dark-border flex flex-col items-center justify-center text-slate-300">
                    <span className="material-icons text-5xl mb-2">shopping_basket</span>
                    <p className="text-[10px] font-black uppercase tracking-widest">Scan item to begin</p>
                  </div>
                )}

                {/* Cart Table */}
                <div className="flex-1 bg-white dark:bg-dark-card border border-slate-100 dark:border-dark-border rounded-3xl overflow-hidden flex flex-col shadow-sm">
                  <div className="p-4 border-b border-slate-100 dark:border-dark-border flex justify-between items-center bg-slate-50/30">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Basket Items</h4>
                    <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg">{cart.length} Items</span>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-dark-border">
                        <tr>
                          <th className="px-6 py-3">Product Name</th>
                          <th className="px-4 py-3">Price</th>
                          <th className="px-4 py-3 text-center">Qty</th>
                          <th className="px-4 py-3 text-right">Total</th>
                          <th className="px-4 py-3"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
                        {cart.map(item => (
                          <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{item.name}</p>
                              <p className="text-[9px] text-slate-400 font-bold uppercase">{item.brand} • {item.color}</p>
                            </td>
                            <td className="px-4 py-4 text-sm font-mono">${item.price}</td>
                            <td className="px-4 py-4">
                              <div className="flex items-center justify-center gap-3">
                                <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all text-sm font-bold">-</button>
                                <span className="text-sm font-black w-4 text-center">{item.cartQuantity}</span>
                                <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all text-sm font-bold">+</button>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-right font-black text-slate-800 dark:text-slate-100">${(item.price * item.cartQuantity).toFixed(2)}</td>
                            <td className="px-4 py-4 text-right">
                              <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 rounded-full text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                <span className="material-icons text-sm">delete_outline</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {cart.length === 0 && (
                      <div className="py-20 text-center opacity-30 select-none">
                        <span className="material-icons text-6xl">inventory_2</span>
                        <p className="text-[10px] font-black uppercase mt-4">Bucket is Empty</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Billing & Checkout */}
              <div className="lg:col-span-3 p-6 bg-slate-50 dark:bg-slate-900/40 border-l border-slate-100 dark:border-dark-border flex flex-col gap-6 overflow-y-auto h-full">
                
                {/* Customer Card */}
                <div className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] shadow-sm space-y-4">
                  <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                    <span className="material-icons text-sm">person</span> Customer Entry
                  </h4>
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-xs font-bold"
                    value={customer.name}
                    onChange={(e) => setCustomer({...customer, name: e.target.value})}
                  />
                  <input 
                    type="text" 
                    placeholder="Phone No" 
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-xs font-bold"
                    value={customer.phone}
                    onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                  />
                </div>

                {/* Billing Logic Card */}
                <div className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] shadow-sm space-y-4">
                  <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Checkout Logic</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-400">Subtotal</span>
                      <span className="font-black">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-400">GST (18%)</span>
                        <input type="checkbox" checked={gstEnabled} onChange={e => setGstEnabled(e.target.checked)} className="w-4 h-4 rounded-md" />
                      </div>
                      <span className="font-black text-blue-600">+${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-400">Global Discount</span>
                      <input 
                        type="number" 
                        className="w-20 text-right bg-slate-50 rounded-lg px-2 py-1 font-black text-red-500" 
                        value={globalDiscount}
                        onChange={e => setGlobalDiscount(Number(e.target.value))}
                      />
                    </div>
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Payable</span>
                      <span className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Breakdown Card */}
                <div className="bg-slate-900 p-6 rounded-[2rem] shadow-2xl space-y-4 text-white">
                  <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Payment Split</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black opacity-60 uppercase">Cash In</label>
                      <input 
                        type="number" 
                        className="w-full bg-white/10 border-none rounded-xl px-4 py-3 font-black text-white" 
                        value={payment.cash || ''}
                        onChange={e => setPayment({...payment, cash: Number(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black opacity-60 uppercase">Online In</label>
                      <input 
                        type="number" 
                        className="w-full bg-white/10 border-none rounded-xl px-4 py-3 font-black text-white" 
                        value={payment.online || ''}
                        onChange={e => setPayment({...payment, online: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[10px] font-black opacity-60 uppercase">Return Change</span>
                    <span className="text-xl font-black text-green-400">${changeToReturn.toFixed(2)}</span>
                  </div>
                </div>

                {/* Gifts & Finalize */}
                <div className="space-y-3 mt-auto">
                  <label className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer border-2 transition-all ${gotGift ? 'bg-pink-50 border-pink-500 text-pink-600' : 'bg-white dark:bg-slate-800 border-transparent text-slate-400'}`}>
                    <div className="flex items-center gap-3">
                      <span className="material-icons">{gotGift ? 'card_giftcard' : 'redeem'}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest">Free Gift Included</span>
                    </div>
                    <input type="checkbox" checked={gotGift} onChange={e => setGotGift(e.target.checked)} className="hidden" />
                  </label>

                  <button 
                    onClick={finalizeSale}
                    disabled={cart.length === 0}
                    className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-[0.4em] text-xs shadow-2xl shadow-blue-600/50 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
                  >
                    <span className="material-icons">task_alt</span>
                    Finalize Sale (F4)
                  </button>
                  
                  <button onClick={resetPOS} className="w-full py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors">
                    Reset POS Session
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
