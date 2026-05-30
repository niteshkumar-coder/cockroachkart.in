import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, ShieldAlert, CheckCircle, Package, Users, Truck, Plus, Trash2, 
  RotateCcw, DollarSign, Star, FileText, Image, RefreshCw, X, Eye
} from 'lucide-react';
import { Product, Order, SavedAddress } from '../../types';
import { collection, collectionGroup, onSnapshot, query, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../../firebase';
import { PRODUCTS } from '../../data';

interface AdminDashboardPageProps {
  products: Product[];
  setProducts: (updatedList: Product[]) => void;
  setScreen: (screen: any) => void;
}

export default function AdminDashboardPage({
  products,
  setProducts,
  setScreen
}: AdminDashboardPageProps) {
  // Passcode verification gate
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_authenticated') === 'true';
  });
  const [errorMsg, setErrorMsg] = useState('');

  // Tab Manager: 'orders' | 'inventory'
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory'>('orders');
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  // Orders list state
  const [orders, setOrders] = useState<Order[]>([]);

  // Selected Order for Modal Detail view
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<Order | null>(null);

  // New product form states
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(999);
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState(1499);
  const [newProdCategory, setNewProdCategory] = useState('Graphic Tees');
  const [newProdRating, setNewProdRating] = useState(4.8);
  const [newProdTag, setNewProdTag] = useState<'Best Seller' | 'New Arrival' | 'Limited Edition' | '20% OFF' | 'Nuclear Proof'>('New Arrival');
  const [newProdDescription, setNewProdDescription] = useState('');
  const [newProdSizes, setNewProdSizes] = useState<string[]>(['M', 'L', 'XL']);
  const [newProdColors, setNewProdColors] = useState<{name: string, value: string}[]>([
    { name: 'Onyx Black', value: '#121212' },
    { name: 'Sliver White', value: '#FFFFFF' }
  ]);
  const [newProdImageUrl, setNewProdImageUrl] = useState('https://i.ibb.co/6cHKvQCg/image.png');
  const [newProdSpecs, setNewProdSpecs] = useState<string[]>([
    '240 GSM organic pre-shrunk combed cotton',
    'High density durable print details',
    'Resilient neck collar construction'
  ]);
  const [newProdMaterial, setNewProdMaterial] = useState('100% Organic Combed Cotton');
  const [newProdFit, setNewProdFit] = useState('Oversized streetwear relaxed drop');
  const [newProdCare, setNewProdCare] = useState('Machine wash cold, air dry reverse side');

  const [formSuccess, setFormSuccess] = useState(false);

  // Stream all placement orders from Firestore collection group in real time!
  useEffect(() => {
    if (isAuthenticated) {
      const ordersQuery = query(collectionGroup(db, 'orders'));
      const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
        const aggregatedOrders: Order[] = [];
        snapshot.forEach((docSnap) => {
          aggregatedOrders.push(docSnap.data() as Order);
        });

        // Sort by order date descending (newest first)
        const sorted = aggregatedOrders.sort((a, b) => {
          const dateA = a.date ? new Date(a.date).getTime() : 0;
          const dateB = b.date ? new Date(b.date).getTime() : 0;
          return dateB - dateA;
        });

        setOrders(sorted);
      }, (err) => {
        console.error("Admin failed to stream collection group orders:", err);
      });

      return () => unsubscribe();
    }
  }, [isAuthenticated]);

  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'ANMOL45090') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setErrorMsg('');
    } else {
      setErrorMsg('Access Denied. Passcode parameters do not match terminal clearance.');
    }
  };

  // Change order status live in Firestore
  const handleUpdateOrderStatus = async (orderId: string, nextStatus: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled') => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) {
      console.error("Order not found with ID:", orderId);
      return;
    }

    const userId = targetOrder.userId;
    if (!userId) {
      console.error("No valid userId associated with order:", orderId);
      alert("Error: Associated customer UID is missing for live synchronization.");
      return;
    }

    try {
      const orderRef = doc(db, 'users', userId, 'orders', orderId);
      await setDoc(orderRef, { 
        status: nextStatus,
        updatedAt: new Date().toISOString() 
      }, { merge: true });

      // Sync detail modal if active
      if (selectedOrderDetail && selectedOrderDetail.id === orderId) {
        setSelectedOrderDetail({ ...selectedOrderDetail, status: nextStatus });
      }
    } catch (err) {
      console.error('Failed to update live user order status in Firestore', err);
      alert('Failed to update status: Insufficient authorization or Firebase error.');
    }
  };

  // Delete product live from the catalogue in Firestore
  const handleDeleteProduct = async (prodId: string) => {
    const confirmation = window.confirm(`Confirm terminal removal of product ID: ${prodId}?`);
    if (confirmation) {
      try {
        const productRef = doc(db, 'products', prodId);
        await deleteDoc(productRef);
      } catch (err) {
        console.error("Failed to delete product from Firestore:", err);
        alert("Failed to delete product: Insufficient authorization or Firebase error.");
      }
    }
  };

  // Seed default static catalog to Firestore
  const handleSeedCatalog = async () => {
    const confirmation = window.confirm("Bootloader: Seed default products catalog to Firestore? This will overwrite or populate all 14 heavy-duty streetwear entries.");
    if (!confirmation) return;
    try {
      for (const p of PRODUCTS) {
        await setDoc(doc(db, 'products', p.id), p);
      }
      alert("System database populated successfully with original product lineup.");
    } catch (err) {
      console.error("Failed to seed product collections:", err);
      alert("Bootloader failed: Insufficient authorization or database error.");
    }
  };

  // Publish a brand new product live to Firestore!
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdDescription.trim()) {
      alert('Specify a product title and description parameters.');
      return;
    }

    const nextId = `prod-live-${Date.now()}`;
    const freshProduct: Product = {
      id: nextId,
      name: newProdName,
      price: Number(newProdPrice),
      originalPrice: Number(newProdOriginalPrice),
      rating: Number(newProdRating),
      reviewCount: Math.floor(Math.random() * 15) + 5,
      category: newProdCategory,
      sizes: newProdSizes,
      colors: newProdColors,
      images: [newProdImageUrl, 'https://i.ibb.co/6cHKvQCg/image.png'],
      tag: newProdTag,
      description: newProdDescription,
      specs: newProdSpecs.filter(line => line.trim().length > 0),
      material: newProdMaterial,
      fit: newProdFit,
      care: newProdCare
    };

    try {
      const productRef = doc(db, 'products', nextId);
      await setDoc(productRef, freshProduct);

      // Clear form fields
      setNewProdName('');
      setNewProdDescription('');
      setFormSuccess(true);
      setTimeout(() => setFormSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to add product to Firestore:", err);
      alert("Failed to insert product: Insufficient authorization or database error.");
    }
  };

  // Helper toggle item sizes
  const toggleSizeCheckbox = (sz: string) => {
    if (newProdSizes.includes(sz)) {
      setNewProdSizes(newProdSizes.filter(s => s !== sz));
    } else {
      setNewProdSizes([...newProdSizes, sz]);
    }
  };

  // Dynamic spec actions helper
  const updateSpecLine = (index: number, value: string) => {
    const next = [...newProdSpecs];
    next[index] = value;
    setNewProdSpecs(next);
  };

  const addSpecLine = () => {
    setNewProdSpecs([...newProdSpecs, '']);
  };

  // Total calculated statistics from all live order entries
  const totalRevenue = orders.reduce((sum, o) => o.status !== 'Cancelled' ? sum + o.totalAmount : sum, 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white pt-10 pb-20 px-4 sm:px-6 lg:px-8">
      
      {!isAuthenticated ? (
        /* passcode gate layout */
        <div className="max-w-md mx-auto mt-20 mb-32 bg-[#121316] border border-amber-500/10 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
          <div className="h-16 w-16 mx-auto rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 text-3xl">
            🔒
          </div>
          <div>
            <h1 className="text-xl font-mono uppercase font-black tracking-wider text-amber-400">
              Admin Terminal Clearances
            </h1>
            <p className="text-xs text-zinc-400 font-mono mt-1 leading-relaxed">
              Establishing a sandboxed link requires encrypted key authorization credentials.
            </p>
          </div>

          <form onSubmit={handleVerifyPasscode} className="space-y-4 pt-2">
            <div>
              <label className="block text-[10px] font-mono uppercase text-zinc-500 text-left font-bold mb-1.5 tracking-wider">
                Enter Root Passcode:
              </label>
              <input
                type="password"
                placeholder="••••••••••••••"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-[#1A1B1E] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-center text-amber-400 placeholder-neutral-700 outline-none focus:border-amber-500/60 transition-all font-mono"
                autoFocus
              />
            </div>

            {errorMsg && (
              <p className="text-rose-500 text-[11px] font-mono text-center rounded bg-rose-950/20 border border-rose-950/50 p-2.5">
                ⚠ {errorMsg}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.98] transition-all text-black font-mono uppercase tracking-widest text-xs font-black py-3 rounded-xl cursor-pointer shadow-[0_4px_15px_rgba(245,158,11,0.2)]"
            >
              Verify Credentials
            </button>
          </form>

          <button
            onClick={() => setScreen('home')}
            className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 hover:text-white cursor-pointer transition-colors pt-2 block mx-auto underline"
          >
            ← Exit Back to Home Base
          </button>
        </div>
      ) : (
        /* Full Authorized Workspace Panel */
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Dashboard Header Branding */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-neutral-900 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs bg-amber-500/10 border border-amber-500/30 text-amber-500 font-mono font-black px-2.5 py-1 rounded">
                  SYSADMIN OPERATIONAL TUNNEL
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-mono uppercase font-black tracking-tighter text-white">
                CockroachKart Live Hub
              </h1>
              <p className="text-xs text-zinc-500 font-mono">
                System parameters: Live state synchronization active. Direct local index reads running.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {products.length === 0 && (
                <button
                  onClick={handleSeedCatalog}
                  className="bg-amber-500/15 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 h-10 px-4 rounded-xl text-xs font-mono flex items-center gap-2 cursor-pointer transition-colors animate-pulse"
                  title="Seed products from default data to Firestore"
                >
                  <Plus className="h-3.5 w-3.5 text-amber-400" />
                  <span>Seed Default Catalog</span>
                </button>
              )}
              
              <div
                className="bg-[#121316] border border-neutral-800 text-zinc-400 h-10 px-4 rounded-xl text-xs font-mono flex items-center gap-2 select-none"
                title="Firebase real-time synchronization is live and listening"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Firestore Live Active</span>
              </div>
              
              <button
                onClick={() => {
                  sessionStorage.removeItem('admin_authenticated');
                  setIsAuthenticated(false);
                }}
                className="bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/30 h-10 px-4 rounded-xl text-xs font-mono text-rose-400 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span>Log Out</span>
              </button>
              
              <button
                onClick={() => { setScreen('home'); }}
                className="bg-amber-500 hover:bg-amber-600 text-black h-10 px-4 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <span>Store View</span>
              </button>
            </div>
          </div>

          {/* Core Analytics Quick Widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#121316] border border-neutral-850 p-5 rounded-xl space-y-1">
              <span className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">Total Gross Sales Revenue</span>
              <span className="block text-xl sm:text-2xl font-black font-mono text-emerald-400">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </span>
              <span className="block text-[9px] text-zinc-500 font-mono">excluding cancelled operations</span>
            </div>

            <div className="bg-[#121316] border border-neutral-850 p-5 rounded-xl space-y-1">
              <span className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">Total Registered Orders</span>
              <span className="block text-xl sm:text-2xl font-black font-mono text-white">
                {orders.length} orders
              </span>
              <span className="block text-[9px] text-zinc-500 font-mono">placed across database instances</span>
            </div>

            <div className="bg-[#121316] border border-neutral-850 p-5 rounded-xl space-y-1">
              <span className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">Pending Dispatches</span>
              <span className="block text-xl sm:text-2xl font-black font-mono text-amber-400">
                {activeOrdersCount} dispatches
              </span>
              <span className="block text-[9px] text-zinc-500 font-mono">processing / shipped status</span>
            </div>

            <div className="bg-[#121316] border border-neutral-850 p-5 rounded-xl space-y-1">
              <span className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">Catalogue Items</span>
              <span className="block text-xl sm:text-2xl font-black font-mono text-white text-clip">
                {products.length} Products
              </span>
              <span className="block text-[9px] text-zinc-500 font-mono">live store list size</span>
            </div>
          </div>

          {/* Tabs switch panel */}
          <div className="flex border-b border-neutral-900">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-3 font-mono text-xs uppercase tracking-wider font-extrabold cursor-pointer border-b-2 transition-all gap-2 flex items-center ${
                activeTab === 'orders' 
                  ? 'border-amber-500 text-amber-400 bg-amber-500/[0.02]' 
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              💼 Live Customer Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-6 py-3 font-mono text-xs uppercase tracking-wider font-extrabold cursor-pointer border-b-2 transition-all gap-2 flex items-center ${
                activeTab === 'inventory' 
                  ? 'border-amber-500 text-amber-400 bg-amber-500/[0.02]' 
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              📦 Product Inventory Manage ({products.length})
            </button>
          </div>

          {/* TAB CONTENT 1: REGISTERED SYSTEM ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="bg-[#121316] border border-neutral-850 p-20 text-center rounded-2xl font-mono text-zinc-500 text-xs">
                  ⚡ No live order actions on file in the local sandbox registry yet. Place a checkout order down the funnel to view it here live!
                </div>
              ) : (
                <div className="overflow-x-auto bg-[#121316] border border-neutral-850 rounded-2xl shadow-xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-neutral-850 bg-neutral-950/60 text-zinc-400 font-mono uppercase text-[9px] tracking-wider font-bold">
                        <th className="p-4">Order ID & Date</th>
                        <th className="p-4">Recipient Customer</th>
                        <th className="p-4">Delivery Coordinates</th>
                        <th className="p-4">Summary of Items</th>
                        <th className="p-4 text-center">Amount Price</th>
                        <th className="p-4 text-center font-bold">Operational Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-900">
                      {orders.map((o) => {
                        const totalProductsQty = o.items.reduce((acc, item) => acc + item.quantity, 0);
                        return (
                          <tr key={o.id} className="hover:bg-neutral-900/30 transition-colors">
                            
                            {/* ID and Date */}
                            <td className="p-4 font-mono space-y-1">
                              <span className="block font-bold text-amber-400 select-all font-mono">{o.id}</span>
                              <span className="block text-[10px] text-zinc-500">{new Date(o.date).toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                              })}</span>
                            </td>

                            {/* Recipient */}
                            <td className="p-4 font-mono whitespace-nowrap">
                              <span className="block text-white font-bold">{o.address.name}</span>
                              <span className="block text-[10px] text-zinc-400">{o.address.phone}</span>
                            </td>

                            {/* Delivery Location Coordinates */}
                            <td className="p-4 font-mono max-w-xs">
                              <span className="block truncate text-zinc-300" title={`${o.address.houseNo}, ${o.address.street}`}>{o.address.houseNo}, {o.address.street}</span>
                              <span className="block text-[10px] text-zinc-500">{o.address.city}, {o.address.state} - {o.address.pincode}</span>
                              {o.address.landmark && <span className="block text-[9px] text-amber-500/70 italic">Near: {o.address.landmark}</span>}
                            </td>

                            {/* Summary / Product Images */}
                            <td className="p-4 space-y-2">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {o.items.map((item, idx) => (
                                  <div key={idx} className="relative h-10 w-9 border border-neutral-800 rounded bg-black shrink-0 group">
                                    <img 
                                      src={item.product?.images?.[0]} 
                                      alt={item.product?.name} 
                                      className="h-full w-full object-cover rounded" 
                                      referrerPolicy="no-referrer"
                                    />
                                    <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-black text-[8px] font-black h-3.5 w-3.5 rounded-full flex items-center justify-center">
                                      {item.quantity}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <span className="block text-[10px] font-mono text-zinc-400 truncate max-w-xs">{totalProductsQty} items ({o.items.map(it => `${it.product?.name} [${it.selectedSize}/${it.selectedColor}]`).join(', ')})</span>
                            </td>

                            {/* Total Pricing Amount */}
                            <td className="p-4 text-center font-mono font-black text-white text-sm">
                              ₹{o.totalAmount}
                            </td>

                            {/* Status controls */}
                            <td className="p-4 text-center">
                              <select
                                value={o.status}
                                onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as any)}
                                className={`rounded-lg px-2.5 py-1.5 text-[10px] font-bold font-mono outline-none border cursor-pointer ${
                                  o.status === 'Delivered' ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/20' :
                                  o.status === 'Cancelled' ? 'bg-rose-950/80 text-rose-400 border-rose-500/20' :
                                  o.status === 'Shipped' ? 'bg-blue-950/80 text-blue-400 border-blue-500/20' :
                                  'bg-amber-950/80 text-amber-400 border-amber-500/20'
                                }`}
                              >
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Dispatched/Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>

                            {/* Modal Viewer Trigger */}
                            <td className="p-4 text-right">
                              <button
                                onClick={() => setSelectedOrderDetail(o)}
                                className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-amber-500/30 text-amber-400 hover:bg-neutral-850 cursor-pointer transition-colors"
                                title="View details sheet"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            </td>

                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT 2: LIVE STORE CATALOGUE AND INVENTORY MANAGER */}
          {activeTab === 'inventory' && (() => {
            // Compute category distributions
            const categoryCounts = products.reduce((acc: {[key: string]: number}, p) => {
              const cat = p.category || "Graphic Tees";
              acc[cat] = (acc[cat] || 0) + 1;
              return acc;
            }, {});

            const totalProducts = products.length;
            
            // Custom high-contrast brand color layout coordinates
            const categoryColors: {[key: string]: string} = {
              'Graphic Tees': '#F59E0B',      // amber-500
              'Plain Tees': '#3B82F6',        // blue-400
              'Oversized': '#10B981',         // emerald-500
              'Vintage': '#8B5CF6',           // violet-500
              'Sports': '#EC4899',            // pink-500
              'Limited Edition': '#F43F5E',   // rose-500
              'Other': '#6B7280'              // gray-500
            };

            const chartData = Object.entries(categoryCounts).map(([name, value]) => ({
              name,
              value,
              percentage: totalProducts > 0 ? (value / totalProducts) * 100 : 0,
              color: categoryColors[name] || '#6B7280'
            })).sort((a, b) => b.value - a.value);

            // Generate circular arc donut segments
            let accumulatedAngle = -Math.PI / 2; // start from 12 o'clock
            const cx = 120;
            const cy = 120;

            const slices = chartData.map((slice) => {
              const fraction = totalProducts > 0 ? slice.value / totalProducts : 0;
              const angleWidth = fraction * Math.PI * 2;
              const startAngle = accumulatedAngle;
              const endAngle = accumulatedAngle + angleWidth;
              accumulatedAngle = endAngle;

              const midAngle = (startAngle + endAngle) / 2;
              const isHovered = hoveredSlice === slice.name;

              // Shift slightly outward on hovered focus
              const shift = isHovered ? 6 : 0;
              const shiftX = Math.cos(midAngle) * shift;
              const shiftY = Math.sin(midAngle) * shift;

              const sliceCx = cx + shiftX;
              const sliceCy = cy + shiftY;

              // Radius boundaries
              const rout = isHovered ? 98 : 90;
              const rin = 58;

              // Vector coordinates points
              const x_out_start = sliceCx + rout * Math.cos(startAngle);
              const y_out_start = sliceCy + rout * Math.sin(startAngle);
              const x_out_end = sliceCx + rout * Math.cos(endAngle);
              const y_out_end = sliceCy + rout * Math.sin(endAngle);

              const x_in_end = sliceCx + rin * Math.cos(endAngle);
              const y_in_end = sliceCy + rin * Math.sin(endAngle);
              const x_in_start = sliceCx + rin * Math.cos(startAngle);
              const y_in_start = sliceCy + rin * Math.sin(startAngle);

              const largeArc = angleWidth > Math.PI ? 1 : 0;

              // Generate Path D coordinate coordinates
              let pathD = "";
              if (fraction >= 0.99) {
                // Perfect single circle fallback to prevent SVG coordinates break
                pathD = `
                  M ${sliceCx} ${sliceCy - rout}
                  A ${rout} ${rout} 0 1 1 ${sliceCx - 0.01} ${sliceCy - rout}
                  M ${sliceCx} ${sliceCy - rin}
                  A ${rin} ${rin} 0 1 0 ${sliceCx - 0.01} ${sliceCy - rin}
                  Z
                `;
              } else {
                pathD = `
                  M ${x_out_start} ${y_out_start}
                  A ${rout} ${rout} 0 ${largeArc} 1 ${x_out_end} ${y_out_end}
                  L ${x_in_end} ${y_in_end}
                  A ${rin} ${rin} 0 ${largeArc} 0 ${x_in_start} ${y_in_start}
                  Z
                `;
              }

              return {
                name: slice.name,
                value: slice.value,
                percentage: slice.percentage,
                color: slice.color,
                pathD,
                isHovered
              };
            });

            return (
              <div className="space-y-8">
                
                {/* Visual Category Distribution Dashboard Widget */}
                <div className="bg-[#121316] border border-neutral-850 rounded-2xl p-6 shadow-xl">
                  <div className="pb-4 border-b border-neutral-900 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-mono uppercase font-black text-amber-500 tracking-wider">
                        📈 Catalog Category Distribution
                      </h3>
                      <p className="text-[10px] text-zinc-500 font-mono mt-1 leading-normal">
                        Visualizing live inventory balance and pricing segments of CockroachKart.
                      </p>
                    </div>
                    {totalProducts > 0 && (
                      <span className="text-[10px] font-mono text-zinc-400 bg-black/40 border border-neutral-850 px-3 py-1.5 rounded-lg shrink-0">
                        Total items represented: <strong className="text-amber-400 font-bold">{totalProducts} products</strong>
                      </span>
                    )}
                  </div>

                  {totalProducts === 0 ? (
                    <div className="text-center py-10 font-mono text-zinc-500 text-xs">
                      No inventory on file. Insert products below to display catalog metrics.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                      
                      {/* Left: Responsive Interactive SVG Wheel */}
                      <div className="md:col-span-5 flex justify-center relative">
                        <div className="relative h-[240px] w-[240px]">
                          <svg viewBox="0 0 240 240" className="w-full h-full">
                            <g className="transition-all duration-300">
                              {slices.map((slice) => (
                                <path
                                  key={slice.name}
                                  d={slice.pathD}
                                  fill={slice.color}
                                  onMouseEnter={() => setHoveredSlice(slice.name)}
                                  onMouseLeave={() => setHoveredSlice(null)}
                                  className="transition-all duration-200 cursor-pointer hover:opacity-90"
                                  style={{
                                    filter: slice.isHovered ? 'drop-shadow(0 4px 12px rgba(245, 158, 11, 0.15))' : 'none'
                                  }}
                                />
                              ))}
                            </g>
                          </svg>

                          {/* Donut graphic Center text info */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center select-none font-mono px-6">
                            {hoveredSlice ? (() => {
                              const hoveredData = chartData.find(d => d.name === hoveredSlice);
                              return (
                                <>
                                  <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-extrabold truncate w-32">
                                    {hoveredSlice}
                                  </span>
                                  <span className="text-xl font-black mt-0.5 text-amber-500">
                                    {hoveredData?.value} {hoveredData?.value === 1 ? 'Item' : 'Items'}
                                  </span>
                                  <span className="text-[10px] text-zinc-400">
                                    {hoveredData?.percentage.toFixed(1)}% share
                                  </span>
                                </>
                              );
                            })() : (
                              <>
                                <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">
                                  Catalog Size
                                </span>
                                <span className="text-2xl font-black mt-0.5 text-white">
                                  {totalProducts}
                                </span>
                                <span className="text-[10px] text-amber-500">
                                  Products
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Legends with metrics progress bars */}
                      <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {chartData.map((category) => (
                          <div 
                            key={category.name}
                            onMouseEnter={() => setHoveredSlice(category.name)}
                            onMouseLeave={() => setHoveredSlice(null)}
                            className={`p-3 rounded-xl border border-neutral-850/50 bg-neutral-900/10 hover:bg-neutral-900/40 hover:border-amber-500/15 transition-all flex items-center justify-between gap-4 cursor-pointer ${
                              hoveredSlice === category.name ? 'border-amber-500/20 bg-neutral-900/45 scale-[1.01]' : ''
                            }`}
                          >
                            <div className="space-y-1.5 flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 text-[10px] font-mono leading-none">
                                <div className="flex items-center gap-2 font-bold text-white truncate max-w-[120px]">
                                  <span 
                                    className="h-2 w-2 rounded-full shrink-0" 
                                    style={{ backgroundColor: category.color }}
                                  />
                                  <span>{category.name}</span>
                                </div>
                                <div className="text-gray-400 font-bold shrink-0">
                                  {category.value} {category.value === 1 ? 'item' : 'items'} ({category.percentage.toFixed(1)}%)
                                </div>
                              </div>
                              
                              {/* Distribution progress bar */}
                              <div className="h-1.5 w-full bg-neutral-950 rounded-full overflow-hidden">
                                <div 
                                  className="h-full rounded-full transition-all duration-300"
                                  style={{ 
                                    backgroundColor: category.color,
                                    width: `${category.percentage}%` 
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  )}
                </div>

                {/* Live listings and product registration panel section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Panel: Live catalogue listings with delete functionality */}
                  <div className="lg:col-span-7 space-y-4">
                    <h2 className="text-sm font-mono uppercase font-black text-zinc-400 tracking-wider">
                      Live Catalogue Index ({products.length} Products)
                    </h2>

                    <div className="space-y-3 max-h-[1400px] overflow-y-auto pr-2">
                      {products.map((p) => (
                        <div 
                          key={p.id}
                          className="bg-[#121316] border border-neutral-850 rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-amber-500/10 transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-16 w-14 border border-neutral-800 rounded bg-black overflow-hidden shrink-0">
                              <img 
                                src={p.images?.[0]} 
                                alt={p.name} 
                                className="h-full w-full object-cover" 
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-semibold text-white truncate max-w-xs sm:max-w-md block" title={p.name}>{p.name}</span>
                                {p.tag && (
                                  <span className="text-[8px] bg-amber-500 text-black font-black font-mono px-1.5 rounded uppercase tracking-wide">
                                    {p.tag}
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-500">
                                <span>ID: <code className="text-amber-500">{p.id}</code></span>
                                <span>Category: <strong className="text-zinc-300">{p.category}</strong></span>
                                <span className="flex items-center gap-0.5 text-amber-400">★ {p.rating}</span>
                              </div>

                              <div className="flex items-center gap-3 font-mono text-xs pt-0.5">
                                <span className="text-zinc-400">Actual Price: <strong className="text-white font-black text-xs">₹{p.price}</strong></span>
                                <span className="text-zinc-650 line-through">Real original: ₹{p.originalPrice}</span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-2.5 rounded-xl bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 border border-rose-900/20 hover:border-rose-500/30 cursor-pointer transition-colors shrink-0"
                            title="Remove live product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

              {/* Right Panel: Add New Product Form */}
              <div className="lg:col-span-5 bg-[#121316] border border-neutral-850 rounded-2xl p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-mono uppercase font-black text-amber-500 tracking-wider">
                    ⚡ Insert Live Web Product
                  </h3>
                  <p className="text-[10px] text-zinc-500 font-mono mt-1 leading-normal">
                    Fills standard state lists immediately. Changes are saved locally and replicate instantly live across shop shelves!
                  </p>
                </div>

                {formSuccess && (
                  <div className="bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl font-mono text-xs text-center">
                    ✓ Product deployed live successfully to all client viewports.
                  </div>
                )}

                <form onSubmit={handleAddProduct} className="space-y-4 text-xs font-mono">
                  
                  {/* Name field */}
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase text-zinc-400 font-bold">Product Title Slogan:</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Survivor Heavy-Drape Carapace Tee"
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      className="w-full bg-[#1A1B1E] border border-neutral-850 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  {/* Pricing line (actual vs original) */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase text-zinc-400 font-bold">Actual Sale Price (₹):</label>
                      <input
                        type="number"
                        required
                        min={10}
                        max={10000}
                        placeholder="999"
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(Number(e.target.value))}
                        className="w-full bg-[#1A1B1E] border border-neutral-850 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none font-sans"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase text-zinc-400 font-bold">Real Original Price (₹):</label>
                      <input
                        type="number"
                        required
                        min={10}
                        max={10000}
                        placeholder="1499"
                        value={newProdOriginalPrice}
                        onChange={(e) => setNewProdOriginalPrice(Number(e.target.value))}
                        className="w-full bg-[#1A1B1E] border border-neutral-850 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none font-sans"
                      />
                    </div>
                  </div>

                  {/* Category and Rating */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase text-zinc-400 font-bold">Category Selector:</label>
                      <select
                        value={newProdCategory}
                        onChange={(e) => setNewProdCategory(e.target.value)}
                        className="w-full bg-[#1A1B1E] border border-neutral-850 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none cursor-pointer"
                      >
                        <option value="Graphic Tees">Graphic Tees</option>
                        <option value="Plain Tees">Plain Tees</option>
                        <option value="Oversized">Oversized</option>
                        <option value="Vintage">Vintage</option>
                        <option value="Sports">Sports</option>
                        <option value="Limited Edition">Limited Edition</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase text-zinc-400 font-bold">Launcher Tag:</label>
                      <select
                        value={newProdTag}
                        onChange={(e) => setNewProdTag(e.target.value as any)}
                        className="w-full bg-[#1A1B1E] border border-neutral-850 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none cursor-pointer"
                      >
                        <option value="New Arrival">New Arrival</option>
                        <option value="Best Seller">Best Seller</option>
                        <option value="Limited Edition">Limited Edition</option>
                        <option value="20% OFF">20% OFF</option>
                        <option value="Nuclear Proof">Nuclear Proof</option>
                      </select>
                    </div>
                  </div>

                  {/* Image URL mockup link fallback suggestions */}
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase text-zinc-400 font-bold">Fidelity Illustration Image URL:</label>
                    <input
                      type="text"
                      required
                      placeholder="Https://i.ibb.co/... (png/jpg)"
                      value={newProdImageUrl}
                      onChange={(e) => setNewProdImageUrl(e.target.value)}
                      className="w-full bg-[#1A1B1E] border border-neutral-850 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                    <div className="flex gap-2 pt-1 font-mono text-[9px] text-zinc-500">
                      <span>Quick fallback images:</span>
                      <button 
                        type="button" 
                        onClick={() => setNewProdImageUrl('https://i.ibb.co/6cHKvQCg/image.png')} 
                        className="text-amber-500 underline cursor-pointer"
                      >
                        Mascot White
                      </button>
                      <span>•</span>
                      <button 
                        type="button" 
                        onClick={() => setNewProdImageUrl('https://i.ibb.co/p6ttbHFp/1764c00a-8954-48db-b06c-d0d71246b7ea.png')} 
                        className="text-amber-500 underline cursor-pointer"
                      >
                        Campaign Black
                      </button>
                    </div>
                  </div>

                  {/* Rating selection */}
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase text-zinc-400 font-bold">Standard Merit Star Rating (max 5.0):</label>
                    <input
                      type="number"
                      step={0.1}
                      min={1}
                      max={5}
                      value={newProdRating}
                      onChange={(e) => setNewProdRating(Number(e.target.value))}
                      className="w-full bg-[#1A1B1E] border border-neutral-850 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none font-sans"
                    />
                  </div>

                  {/* Description Box */}
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase text-zinc-400 font-bold">Product Summary Details:</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Write an outstanding description of the fabrics, print resilience features, and vintage streetwear aesthetic appeal."
                      value={newProdDescription}
                      onChange={(e) => setNewProdDescription(e.target.value)}
                      className="w-full bg-[#1A1B1E] border border-neutral-850 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  {/* Size togglers list */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase text-zinc-400 font-bold">Sizes Available:</label>
                    <div className="flex gap-3">
                      {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                        <label key={sz} className="flex items-center gap-1.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={newProdSizes.includes(sz)}
                            onChange={() => toggleSizeCheckbox(sz)}
                            className="accent-amber-500"
                          />
                          <span>{sz}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Specs Lines editor */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-[10px] uppercase text-zinc-400 font-bold">Specification Bullet Points:</label>
                      <button
                        type="button"
                        onClick={addSpecLine}
                        className="text-[9px] text-amber-400 border border-amber-500/15 rounded bg-amber-500/5 px-2 py-0.5 hover:bg-amber-500/10 cursor-pointer"
                      >
                        + Add Spec Bullet
                      </button>
                    </div>
                    <div className="space-y-1.5">
                      {newProdSpecs.map((spec, sIdx) => (
                        <input
                          key={sIdx}
                          type="text"
                          placeholder={`Spec detail option line #${sIdx + 1}`}
                          value={spec}
                          onChange={(e) => updateSpecLine(sIdx, e.target.value)}
                          className="w-full bg-[#1A1B1E] border border-neutral-850 rounded-xl px-3 py-1.5 text-xs text-gray-300 focus:border-amber-400 focus:outline-none"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Extra Technical specs */}
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase text-zinc-400 font-bold">Material & Blend:</label>
                    <input
                      type="text"
                      value={newProdMaterial}
                      onChange={(e) => setNewProdMaterial(e.target.value)}
                      className="w-full bg-[#1A1B1E] border border-neutral-850 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase text-zinc-400 font-bold">Fit Silhouette:</label>
                    <input
                      type="text"
                      value={newProdFit}
                      onChange={(e) => setNewProdFit(e.target.value)}
                      className="w-full bg-[#1A1B1E] border border-neutral-850 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 font-bold text-black font-mono py-3 rounded-xl uppercase tracking-widest text-xs font-black cursor-pointer shadow-lg shadow-amber-500/10 active:scale-[0.98] transition-all"
                  >
                    Deploy New Product Live
                  </button>

                </form>
              </div>

            </div>
          </div>
        );
      })()}

          {/* DETAIL DIALOG MODAL SHEET FOR ORDERS */}
          <AnimatePresence>
            {selectedOrderDetail && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedOrderDetail(null)}
                  className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                <motion.div
                  initial={{ scale: 0.95, y: 15, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.95, y: 15, opacity: 0 }}
                  className="relative bg-[#121316] border border-amber-500/10 rounded-2xl p-6 md:p-8 max-w-2xl w-full text-xs font-mono max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl"
                >
                  
                  {/* Title and Close */}
                  <div className="flex justify-between items-center border-b border-neutral-850 pb-4">
                    <div>
                      <span className="block text-[10px] font-mono text-amber-500 uppercase font-black">EXHAUSTIVE DISPATCH RECORD SCHEMA</span>
                      <h3 className="text-sm font-bold text-white mt-0.5">Order Reference Key: {selectedOrderDetail.id}</h3>
                    </div>
                    <button
                      onClick={() => setSelectedOrderDetail(null)}
                      className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-white text-zinc-400 hover:text-white cursor-pointer transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Order Recipient Core Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-950/40 p-4 border border-neutral-850 rounded-xl">
                    <div className="space-y-1.5">
                      <span className="block text-[9px] uppercase text-zinc-500 font-bold">Recipient Customer details</span>
                      <p className="text-white text-xs font-bold leading-none">{selectedOrderDetail.address.name}</p>
                      <p className="text-zinc-400">Mobile Phone: <strong className="text-zinc-300">{selectedOrderDetail.address.phone}</strong></p>
                      <p className="text-zinc-500">Dispatch Date: {new Date(selectedOrderDetail.date).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="space-y-1.5">
                      <span className="block text-[9px] uppercase text-zinc-500 font-bold">Delivery Station Coordinates</span>
                      <p className="text-zinc-300 leading-relaxed font-sans text-[11px]">
                        {selectedOrderDetail.address.houseNo}, {selectedOrderDetail.address.street}<br />
                        {selectedOrderDetail.address.city}, {selectedOrderDetail.address.state} - {selectedOrderDetail.address.pincode}
                      </p>
                      {selectedOrderDetail.address.landmark && (
                        <p className="text-[10px] text-amber-500/90 leading-tight">Landmark: {selectedOrderDetail.address.landmark}</p>
                      )}
                    </div>
                  </div>

                  {/* Cart items list detailing images */}
                  <div className="space-y-2.5">
                    <span className="block text-[9px] uppercase text-zinc-500 font-bold">Ordered Products Registry ({selectedOrderDetail.items.length} items)</span>
                    <div className="divide-y divide-neutral-900 border-t border-b border-neutral-850">
                      {selectedOrderDetail.items.map((item, idx) => (
                        <div key={idx} className="py-3 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="h-14 w-12 border border-neutral-800 rounded bg-black shrink-0 overflow-hidden">
                              <img 
                                src={item.product?.images?.[0]} 
                                alt={item.product?.name} 
                                className="h-full w-full object-cover" 
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="block text-xs font-bold text-white leading-tight">{item.product?.name}</span>
                              <div className="flex gap-3 text-[10px] text-zinc-400">
                                <span>Size: <strong className="text-zinc-300">{item.selectedSize}</strong></span>
                                <span>Color: <strong className="text-zinc-300">{item.selectedColor}</strong></span>
                                <span>Quantity: <strong className="text-white font-bold font-sans">{item.quantity}</strong></span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right font-bold text-zinc-300 font-sans whitespace-nowrap">
                            ₹{item.product?.price} × {item.quantity}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Total Math Breakdown */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-neutral-850 pb-4">
                    <div className="space-y-1">
                      <span className="block text-[9px] uppercase text-zinc-500 font-bold">Transaction Ledger</span>
                      <div className="flex items-center gap-2.5">
                        <span className="text-zinc-400">Subtotal Amount: ₹{selectedOrderDetail.subtotal}</span>
                        <span className="text-zinc-600">|</span>
                        <span className="text-zinc-400 text-rose-400">Claims Saved: -₹{selectedOrderDetail.discount}</span>
                        <span className="text-zinc-600">|</span>
                        <span className="text-zinc-400">Dispatch Fee: ₹{selectedOrderDetail.deliveryCharges}</span>
                      </div>
                    </div>

                    <div className="text-right whitespace-nowrap">
                      <span className="block text-[9px] uppercase text-zinc-500 font-bold">Total billing</span>
                      <strong className="text-white text-base font-black font-sans">
                        ₹{selectedOrderDetail.totalAmount}
                      </strong>
                    </div>
                  </div>

                  {/* Status update tunnel inside modal */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 bg-[#1A1B1E] p-4 rounded-xl border border-neutral-850">
                    <div className="space-y-0.5">
                      <span className="block text-[9px] uppercase text-zinc-500 font-bold">Interactive status panel</span>
                      <p className="text-[10px] text-zinc-300">Set active shipping state for instant client-side update updates.</p>
                    </div>

                    <div className="flex gap-2.5">
                      {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map((stat) => (
                        <button
                          key={stat}
                          onClick={() => handleUpdateOrderStatus(selectedOrderDetail.id, stat as any)}
                          className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all cursor-pointer border ${
                            selectedOrderDetail.status === stat
                              ? 'bg-amber-500 text-black border-amber-500 hover:bg-amber-400 font-black'
                              : 'bg-neutral-900 text-zinc-400 border-neutral-800 hover:text-white'
                          }`}
                        >
                          {stat}
                        </button>
                      ))}
                    </div>
                  </div>

                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </div>
      )}

    </div>
  );
}
