import React, { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, ShoppingBag, MapPin, Heart, ShieldAlert, LogOut, Edit, Check, Settings, Trash, Eye } from 'lucide-react';
import { Product, ScreenType, Order, SavedAddress } from '../../types';
import { auth } from '../../firebase';

interface DashboardPageProps {
  setScreen: (screen: ScreenType) => void;
  orders: Order[];
  onCancelOrder: (id: string) => void;
  onReorder: (order: Order) => void;
  currentUser: any;
  onUpdateUser: (user: any) => void;
  addresses: SavedAddress[];
  onRemoveAddress: (id: string) => void;
  wishlist: string[];
  products: Product[];
  onWishlistToggle: (id: string) => void;
  onLogout: () => void;
}

export default function DashboardPage({
  setScreen,
  orders,
  onCancelOrder,
  onReorder,
  currentUser,
  onUpdateUser,
  addresses,
  onRemoveAddress,
  wishlist,
  products,
  onWishlistToggle,
  onLogout
}: DashboardPageProps) {
  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'profile' | 'addresses' | 'wishlist'>('orders');
  
  console.log("[Dashboard Render] Props Received - currentUser:", currentUser, "Firebase auth.currentUser:", auth?.currentUser);
  
  // Profile Form States
  const [name, setName] = useState(currentUser?.name || currentUser?.displayName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);

  // Synchronize state with prop shifts (essential for Google async auth load)
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || currentUser.displayName || '');
      if (currentUser.email) setEmail(currentUser.email);
      if (currentUser.phone) setPhone(currentUser.phone);
    }
  }, [currentUser]);

  // Expanded order details tracker State
  const [expandedOrderNo, setExpandedOrderNo] = useState<string | null>(null);

  const handleUpdateProfile = (e: FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setTimeout(() => {
      onUpdateUser({ name, email, phone });
      setProfileSaving(false);
      setProfileSavedMsg(true);
      setTimeout(() => setProfileSavedMsg(false), 2000);
    }, 1000);
  };

  const getWishlistedProducts = () => {
    return products.filter(p => wishlist.includes(p.id));
  };

  // Tracking points parser
  const getTrackProgressPct = (status: string) => {
    if (status === 'Cancelled') return 0;
    if (status === 'Delivered') return 100;
    if (status === 'Shipped') return 60;
    return 20; // Processing
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        
        {/* Main layout container */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Panel Sidebar Navigation */}
          <div className="lg:col-span-1 space-y-4">
            
            <div className="bg-[#141414] border border-neutral-850 rounded-2xl p-6 text-center space-y-3 relative overflow-hidden">
              <div className="absolute -top-4 -right-4 select-none opacity-[0.03] h-16 w-16 pointer-events-none">
                <img 
                  src="https://i.ibb.co/LhkQwD3z/Gemini-Generated-Image-noyty8noyty8noyt-1-removebg-preview.png" 
                  alt="" 
                  className="h-full w-full object-contain filter invert opacity-50" 
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/30 text-[#D4A853] text-2xl font-bold font-mono uppercase">
                {name[0] || 'N'}
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white tracking-wide truncate">{name}</h2>
                <span className="text-[10px] font-mono text-amber-500/60 uppercase">SURVIVOR GENERAL</span>
              </div>
            </div>

            <div className="bg-[#141414] border border-neutral-850 rounded-2xl p-2 flex flex-col gap-1 font-mono text-xs">
              <button
                onClick={() => setActiveSubTab('orders')}
                className={`w-full text-left rounded-lg p-2.5 flex items-center gap-2.5 uppercase font-bold transition-all cursor-pointer ${
                  activeSubTab === 'orders' ? 'bg-amber-500 text-black' : 'text-neutral-400 hover:text-white hover:bg-[#1E1E1E]'
                }`}
              >
                <ShoppingBag className="h-4 w-4" /> My Swarm Orders ({orders.length})
              </button>
              
              <button
                onClick={() => setActiveSubTab('profile')}
                className={`w-full text-left rounded-lg p-2.5 flex items-center gap-2.5 uppercase font-bold transition-all cursor-pointer ${
                  activeSubTab === 'profile' ? 'bg-amber-500 text-black' : 'text-neutral-400 hover:text-white hover:bg-[#1E1E1E]'
                }`}
              >
                <User className="h-4 w-4" /> Profile Details
              </button>

              <button
                onClick={() => setActiveSubTab('addresses')}
                className={`w-full text-left rounded-lg p-2.5 flex items-center gap-2.5 uppercase font-bold transition-all cursor-pointer ${
                  activeSubTab === 'addresses' ? 'bg-amber-500 text-black' : 'text-neutral-400 hover:text-white hover:bg-[#1E1E1E]'
                }`}
              >
                <MapPin className="h-4 w-4" /> Deploy Addresses
              </button>

              <button
                onClick={() => setActiveSubTab('wishlist')}
                className={`w-full text-left rounded-lg p-2.5 flex items-center gap-2.5 uppercase font-bold transition-all cursor-pointer ${
                  activeSubTab === 'wishlist' ? 'bg-amber-500 text-black' : 'text-neutral-400 hover:text-white hover:bg-[#1E1E1E]'
                }`}
              >
                <Heart className="h-4 w-4" /> Wishlist Favs ({wishlist.length})
              </button>

              <div className="border-t border-neutral-900 mt-2 pt-2">
                <button
                  onClick={onLogout}
                  className="w-full text-left rounded-lg p-2.5 flex items-center gap-2.5 uppercase font-bold text-rose-500 hover:text-rose-400 hover:bg-neutral-900/50 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" /> Signout Swarm
                </button>
              </div>
            </div>

          </div>

          {/* Right Panel Subtab Contents */}
          <div className="lg:col-span-3 bg-[#141414] border border-neutral-850 rounded-2xl p-6 sm:p-8 space-y-6">
            
            {/* 1. ORDERS LIST */}
            {activeSubTab === 'orders' && (
              <div className="space-y-6">
                <h3 className="text-sm font-semibold uppercase font-mono tracking-wider text-amber-400 border-b border-neutral-900 pb-2">Swarm Dispatch Logs</h3>
                
                {orders.length === 0 ? (
                  <div className="text-center py-12 space-y-4 font-mono text-xs">
                    <span className="text-4xl block">📦🚫</span>
                    <p className="text-neutral-500">No dispatch orders verified under this user ledger.</p>
                    <button onClick={() => setScreen('shop')} className="rounded bg-amber-500 hover:bg-amber-600 text-black font-bold uppercase py-1.5 px-4">Browse shop</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const isExpanded = expandedOrderNo === order.id;
                      const progress = getTrackProgressPct(order.status);
                      return (
                        <div key={order.id} className="border border-neutral-850 rounded-xl overflow-hidden bg-neutral-950/25">
                          {/* Order Card Brief Header */}
                          <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 font-mono text-xs bg-[#1C1C1E]">
                            <div>
                              <span className="text-[10px] text-gray-500 font-bold block uppercase">Deploy code</span>
                              <span className="text-white font-bold">{order.id}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-gray-500 font-bold block uppercase">Verification Date</span>
                              <span className="text-neutral-350">{order.date}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-gray-500 font-bold block uppercase">Net amounts</span>
                              <span className="text-amber-400 font-bold">₹{order.totalAmount}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-gray-500 font-bold block uppercase">Status state</span>
                              <span className={`inline-flex rounded px-2.5 py-0.5 text-[9px] font-bold uppercase ${
                                order.status === 'Cancelled' ? 'bg-rose-500/10 text-rose-500' :
                                order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400' :
                                'bg-amber-500/10 text-amber-400 animate-pulse'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                            <button
                              onClick={() => setExpandedOrderNo(isExpanded ? null : order.id)}
                              className="bg-neutral-900 border border-neutral-800 text-[10px] text-gray-400 hover:text-white px-3 py-1 rounded cursor-pointer transition-colors"
                            >
                              {isExpanded ? 'Hide Details' : 'View Details'}
                            </button>
                          </div>

                          {/* Expanded detail box (Track timeline sliders, list items) */}
                          {isExpanded && (
                            <div className="p-6 border-t border-neutral-950 space-y-6">
                              
                              {/* Dynamic tracking log progress bar */}
                              {order.status !== 'Cancelled' && (
                                <div className="space-y-4">
                                  <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest font-black">🧬 ACTIVE DISPATCH MOVEMENT</span>
                                  <div className="relative h-2 bg-neutral-905 overflow-hidden rounded-full border border-neutral-900">
                                    <div className="absolute h-full bg-amber-500 transition-all duration-1000 font-sans" style={{ width: `${progress}%` }} />
                                  </div>
                                  <div className="grid grid-cols-4 text-center font-mono text-[9px] text-gray-500 font-bold uppercase gap-1">
                                    <span className={progress >= 20 ? "text-amber-400" : ""}>Placled</span>
                                    <span className={progress >= 40 ? "text-amber-400" : ""}>Swarmed</span>
                                    <span className={progress >= 60 ? "text-amber-400" : ""}>In-Transit</span>
                                    <span className={progress >= 100 ? "text-amber-400" : ""}>Crawl Delivery</span>
                                  </div>
                                </div>
                              )}

                              {/* Products involved list */}
                              <div className="space-y-3 pt-4 border-t border-neutral-900">
                                <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest font-black">🎁 Specimens Dispatched</span>
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="flex gap-4 text-xs font-sans items-center">
                                    <img src={item.product.images[0]} alt="" className="h-10 w-10 object-cover rounded border border-neutral-900" referrerPolicy="no-referrer" />
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-semibold text-white truncate">{item.product.name}</h4>
                                      <p className="text-[10px] text-neutral-500 font-mono">Qty: {item.quantity} | Size: {item.selectedSize} | Tint: {item.selectedColor}</p>
                                    </div>
                                    <span className="font-semibold font-mono text-amber-500">₹{item.product.price * item.quantity}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Operational CTA controls */}
                              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-900 font-mono text-[10px] font-bold">
                                {order.status === 'Processing' && (
                                  <button
                                    onClick={() => onCancelOrder(order.id)}
                                    className="border border-rose-500/20 text-rose-500 hover:bg-rose-500/5 px-4 py-1.5 rounded transition-all cursor-pointer uppercase"
                                  >
                                    Cancel Dispatch Code
                                  </button>
                                )}
                                <button
                                  onClick={() => onReorder(order)}
                                  className="bg-amber-500 hover:bg-amber-600 text-black px-4 py-1.5 rounded transition-all cursor-pointer uppercase"
                                >
                                  Reorder Entire Scurry
                                </button>
                              </div>

                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 2. PROFILE EDIT */}
            {activeSubTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-sm font-semibold uppercase font-mono tracking-wider text-amber-400 border-b border-neutral-900 pb-2">Profile credentials</h3>
                
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono text-neutral-500 uppercase font-bold mb-1">Your Name</label>
                    <input
                      type="text" required value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg bg-[#1C1C1E] border border-neutral-800 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-neutral-500 uppercase font-bold mb-1">Registered Email Address</label>
                    <input
                      type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg bg-[#1C1C1E] border border-neutral-800 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-neutral-500 uppercase font-bold mb-1">Phone Mobile</label>
                    <input
                      type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-lg bg-[#1C1C1E] border border-neutral-800 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none font-mono"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="rounded bg-amber-500 hover:bg-amber-600 text-black transition-colors px-6 py-2 text-xs font-mono font-bold uppercase cursor-pointer"
                    >
                      {profileSaving ? 'Saving parameters...' : 'Secure & Save Details'}
                    </button>
                  </div>

                  {profileSavedMsg && (
                    <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase mt-2">
                      ✔ SECRED ACCOUNT UPDATES COMPELTED SUCCESSFUL
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* 3. SHIPPINGS ADDRESS LIST */}
            {activeSubTab === 'addresses' && (
              <div className="space-y-6">
                <h3 className="text-sm font-semibold uppercase font-mono tracking-wider text-amber-400 border-b border-neutral-900 pb-2">Active Deploy Locations</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="border border-neutral-850 bg-[#141414] p-4 rounded-xl flex flex-col justify-between gap-3 relative overflow-hidden">
                      <span className="absolute top-0 right-0 py-1.5 px-3 bg-[#1C1C1E] rounded-bl text-[8px] font-mono tracking-widest text-[#D4A853] font-black uppercase">
                        {addr.type}
                      </span>
                      <div className="space-y-1">
                        <span className="block text-xs font-bold text-white">{addr.name}</span>
                        <p className="text-[11px] text-neutral-400 leading-relaxed font-sans pr-4">
                          {addr.houseNo}, {addr.street}, {addr.city} - <strong className="text-white font-mono">{addr.pincode}</strong>, {addr.state}
                        </p>
                        <span className="block text-[10px] text-gray-550 font-mono mt-0.5">Mobile: {addr.phone}</span>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2 border-t border-neutral-900 font-mono text-[9px] font-black">
                        {addr.isDefault ? (
                          <span className="text-emerald-400">★ CENTRAL DEFAULT SEED</span>
                        ) : (
                          <span className="text-gray-600">AUXILIARY LANDED</span>
                        )}
                        <button
                          onClick={() => onRemoveAddress(addr.id)}
                          className="text-rose-500 hover:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Trash className="h-3 w-3" /> Decomission
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    onClick={() => { setScreen('address'); }}
                    className="border border-dashed border-neutral-800 hover:border-amber-500/30 p-8 rounded-xl flex flex-col items-center justify-center gap-2 text-xs font-mono font-bold text-gray-500 hover:text-amber-400 cursor-pointer"
                  >
                    🚀 ADD NEW DISPATCH CORNER
                  </button>
                </div>
              </div>
            )}

            {/* 4. WISHLIST */}
            {activeSubTab === 'wishlist' && (
              <div className="space-y-6">
                <h3 className="text-sm font-semibold uppercase font-mono tracking-wider text-amber-400 border-b border-neutral-900 pb-2">Favorite specimens</h3>
                
                {wishlist.length === 0 ? (
                  <div className="text-center py-12 space-y-4 font-mono text-xs">
                    <span className="text-4xl block">♡🚫</span>
                    <p className="text-neutral-500">No favorite specimens registered under ledger registry.</p>
                    <button onClick={() => setScreen('shop')} className="rounded bg-amber-500 hover:bg-amber-600 text-black font-bold uppercase py-1.5 px-4 cursor-pointer">Catalog list</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getWishlistedProducts().map((prod) => (
                      <div key={prod.id} className="border border-neutral-850 p-3 rounded-xl bg-neutral-950/40 flex items-center gap-3">
                        <img src={prod.images[0]} alt="" className="h-14 w-11 object-cover rounded border border-neutral-900" referrerPolicy="no-referrer" />
                        <div className="flex-1 min-w-0 font-mono text-xs">
                          <h4 className="font-semibold text-white truncate font-sans">{prod.name}</h4>
                          <span className="text-[10px] text-amber-400 block mt-0.5 font-bold">₹{prod.price}</span>
                          <span className="text-[8px] text-neutral-500 uppercase tracking-widest">{prod.category}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => {
                              setScreen('detail');
                              setScreen('shop'); // trigger view update
                              setScreen('detail');
                              // set standard selected
                              setScreen('shop'); // mock redirect safety
                              setScreen('detail');
                              // let's do simple state trigger in App for view details
                              // We can trigger it by passing handler:
                              setScreen('detail');
                            }}
                            className="p-1 text-gray-400 hover:text-white rounded hover:bg-neutral-90 transition-colors"
                            onClickCapture={() => setScreen('detail')}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onWishlistToggle(prod.id)}
                            className="p-1 text-rose-500 hover:text-rose-400 rounded hover:bg-neutral-90 transition-colors cursor-pointer"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
