import React, { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShoppingCart, Heart, User, Menu, X, Sparkles, Filter, Percent } from 'lucide-react';
import { ScreenType, CartItem, Product } from '../types';

interface HeaderProps {
  currentScreen: ScreenType;
  setScreen: (screen: ScreenType) => void;
  cart: CartItem[];
  wishlist: string[];
  onSearch: (query: string) => void;
  currentUser: any;
  setStaticTab: (tab: any) => void;
  products: Product[];
  setSelectedProduct: (prod: Product) => void;
  authLoading?: boolean;
}

export default function Header({
  currentScreen,
  setScreen,
  cart,
  wishlist,
  onSearch,
  currentUser,
  setStaticTab,
  products,
  setSelectedProduct,
  authLoading = false
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [showQuickSearch, setShowQuickSearch] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(localSearch);
    setScreen('shop');
    setShowQuickSearch(false);
  };

  const filteredQuickResults = localSearch.trim()
    ? products.filter(p => p.name.toLowerCase().includes(localSearch.toLowerCase())).slice(0, 4)
    : [];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-amber-500/10 bg-[#0D0D0D]/95 backdrop-blur-md">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#8B6914] via-[#D4A853] to-[#8B6914] py-1 px-4 text-center text-xs font-semibold tracking-wider text-black flex items-center justify-center gap-2">
        <Sparkles className="h-3 w-3 animate-pulse" />
        <span>SURVIVAL FASHION: PREMIUM T-SHIRTS DESIGNED TO OUTLIVE APOCALYPSES & SEWERS</span>
        <span className="hidden md:inline">| USE CODE <span className="font-bold underline">SURVIVAL10</span> FOR 10% OFF</span>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo */}
          <div 
            onClick={() => { setScreen('home'); setMobileMenuOpen(false); }} 
            className="flex cursor-pointer items-center gap-2 select-none"
            id="header-logo-container"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 overflow-hidden group">
              <img 
                src="https://i.ibb.co/LhkQwD3z/Gemini-Generated-Image-noyty8noyty8noyt-1-removebg-preview.png" 
                alt="🪳" 
                className="h-8 w-8 object-contain group-hover:scale-110 transition-transform duration-300" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div>
              <span className="font-['Bebas_Neue'] text-2xl font-black tracking-widest text-white sm:text-3xl">
                COCKROACH<span className="text-amber-400">KART</span>
              </span>
              <span className="hidden sm:block text-[9px] text-amber-500/60 font-mono tracking-widest leading-none">THE UNSTOPPABLE APPAREL</span>
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-300">
            <button
              onClick={() => setScreen('home')}
              className={`hover:text-amber-400 transition-colors cursor-pointer py-2 ${currentScreen === 'home' ? 'text-amber-400 border-b-2 border-amber-400' : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => setScreen('shop')}
              className={`hover:text-amber-400 transition-colors cursor-pointer py-2 ${currentScreen === 'shop' ? 'text-amber-400 border-b-2 border-amber-400' : ''}`}
            >
              Shop All
            </button>
            <button
              onClick={() => { onSearch(''); setScreen('shop'); }}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Categories
            </button>
            <button
              onClick={() => { onSearch(''); setScreen('shop'); }}
              className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="h-3 w-3 text-amber-400" /> New Arrivals
            </button>
            <button
              onClick={() => {
                setStaticTab('about');
                setScreen('static');
              }}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              About Us
            </button>
          </nav>

          {/* Search Bar - Center Panel */}
          <div className="relative flex-1 max-w-md hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search survival gear, heavy tees..."
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  setShowQuickSearch(true);
                }}
                onFocus={() => {
                  setSearchFocused(true);
                  if (localSearch) setShowQuickSearch(true);
                }}
                onBlur={() => {
                  setSearchFocused(false);
                  // Allow clicking suggested items before hiding
                  setTimeout(() => setShowQuickSearch(false), 200);
                }}
                className={`w-full rounded-full bg-[#1A1A1A] py-1.5 pl-10 pr-4 text-xs text-white placeholder-gray-500 border focus:outline-none transition-all duration-300 ${
                  searchFocused ? 'border-amber-400 ring-1 ring-amber-400/25' : 'border-neutral-800'
                }`}
              />
              <Search className="absolute left-3.5 top-2 h-4 w-4 text-gray-500" />
              {localSearch && (
                <button 
                  type="button" 
                  onClick={() => { setLocalSearch(''); onSearch(''); }}
                  className="absolute right-3.5 top-2 text-gray-500 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </form>

            {/* Quick Search Dropdown */}
            <AnimatePresence>
              {showQuickSearch && localSearch.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 right-0 mt-2 rounded-xl bg-[#141414] border border-amber-500/20 p-2 shadow-2xl z-50 max-h-72 overflow-y-auto"
                >
                  <div className="text-[10px] font-mono text-amber-500/60 px-3 py-1 uppercase tracking-wider font-bold">
                    Suggested Survival Gear
                  </div>
                  {filteredQuickResults.length === 0 ? (
                    <div className="text-xs text-gray-500 py-3 text-center">No surviving items match matching your search query.</div>
                  ) : (
                    filteredQuickResults.map(prod => (
                      <div
                        key={prod.id}
                        onClick={() => {
                          setSelectedProduct(prod);
                          setScreen('detail');
                        }}
                        className="flex items-center gap-3 p-2 hover:bg-[#1C1C1E] rounded-lg cursor-pointer transition-colors"
                      >
                        <img 
                          src={prod.images[0]} 
                          alt={prod.name} 
                          className="h-10 w-10 object-cover rounded-md border border-neutral-800" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-white truncate">{prod.name}</h4>
                          <p className="text-[10px] text-amber-400 font-mono">₹{prod.price}</p>
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Icons Panel */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Wishlist Icon */}
            <button
              onClick={() => { onSearch(''); setScreen('shop'); }}
              className="relative p-2 text-gray-400 hover:text-amber-400 transition-colors cursor-pointer rounded-full hover:bg-neutral-900/50"
              title="View Wishlist"
              id="header-wishlist-button"
            >
              <motion.div
                key={wishlistCount}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.4, 0.9, 1.1, 1] }}
                transition={{ duration: 0.45 }}
                whileHover={{ scale: 1.25 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center justify-center"
              >
                <Heart className={`h-5 w-5 ${wishlistCount > 0 ? 'fill-amber-400 text-amber-400' : ''}`} />
              </motion.div>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-black ring-2 ring-[#0D0D0D]">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => setScreen('cart')}
              className="relative p-2 text-gray-400 hover:text-amber-400 transition-colors cursor-pointer rounded-full hover:bg-neutral-900/50"
              title="Shopping Cart"
              id="header-cart-button"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-amber-500 text-[9px] font-black text-black ring-2 ring-[#0D0D0D]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile / Dashboard Menu */}
            {currentUser ? (
              <button
                onClick={() => setScreen('dashboard')}
                className="p-1 px-3 text-amber-400 border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition-colors cursor-pointer rounded-full flex items-center gap-2 font-mono"
                title="Dashboard / Account"
                id="header-user-button"
              >
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt="Avatar" className="h-5 w-5 rounded-full border border-amber-400/30" referrerPolicy="no-referrer" />
                ) : (
                  <User className="h-4 w-4" />
                )}
                <span className="hidden sm:inline text-xs font-semibold tracking-wide truncate max-w-[90px]">
                  {currentUser.name ? currentUser.name.split(' ')[0] : 'Survivor'}
                </span>
              </button>
            ) : authLoading ? (
              <div className="flex items-center justify-center p-2 px-3 bg-neutral-900/40 rounded-full border border-neutral-800 h-8 min-w-[70px]">
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
              </div>
            ) : (
              <button
                onClick={() => setScreen('auth')}
                className="px-2.5 min-[380px]:px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold font-mono text-xs cursor-pointer flex items-center gap-1.5 min-[380px]:gap-2 shadow-[0_2px_10px_rgba(245,158,11,0.2)] active:scale-95 transition-all"
                title="Sign In with Google"
                id="header-user-button"
              >
                <svg className="h-3.5 w-3.5 fill-black shrink-0" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="hidden sm:inline">Sign In</span>
                <span className="hidden min-[380px]:inline sm:hidden">Login</span>
              </button>
            )}

            {/* Mobile Hamburger Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-amber-400 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden w-full border-t border-amber-500/10 bg-[#0E0E0E] px-4 py-4 space-y-4"
          >
            {/* Search - Mobile */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full rounded-lg bg-[#1A1A1A] py-2 pl-10 pr-4 text-xs text-white placeholder-gray-500 border border-neutral-800"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            </form>

            <div className="flex flex-col gap-3 font-medium text-sm">
              <button
                onClick={() => { setScreen('home'); setMobileMenuOpen(false); }}
                className="text-left py-2 hover:text-amber-400 border-b border-neutral-900"
              >
                Home
              </button>
              <button
                onClick={() => { setScreen('shop'); setMobileMenuOpen(false); }}
                className="text-left py-2 hover:text-amber-400 border-b border-neutral-900"
              >
                Shop All
              </button>
              <button
                onClick={() => { onSearch(''); setScreen('shop'); setMobileMenuOpen(false); }}
                className="text-left py-2 hover:text-amber-400 border-b border-neutral-900"
              >
                Categories
              </button>
              <button
                onClick={() => {
                  setStaticTab('about');
                  setScreen('static');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 hover:text-amber-400 border-b border-neutral-900"
              >
                About Brand Story
              </button>
              <button
                onClick={() => {
                  setStaticTab('contact');
                  setScreen('static');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 hover:text-amber-400 border-b border-neutral-900"
              >
                Contact Assistance
              </button>
              <button
                onClick={() => {
                  setStaticTab('faq');
                  setScreen('static');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 hover:text-amber-400 border-b border-neutral-900"
              >
                FAQs
              </button>

              {currentUser ? (
                <button
                  onClick={() => { setScreen('dashboard'); setMobileMenuOpen(false); }}
                  className="text-left py-2.5 text-amber-400 hover:text-amber-300 font-extrabold flex items-center gap-2 font-mono uppercase tracking-wider text-xs"
                >
                  {currentUser.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt="Avatar" className="h-5 w-5 rounded-full border border-amber-400/30" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="h-5 w-5 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[10px]">🪳</div>
                  )}
                  My Account: {currentUser.name ? currentUser.name.split(' ')[0] : 'Survivor'}
                </button>
              ) : (
                <button
                  onClick={() => { setScreen('auth'); setMobileMenuOpen(false); }}
                  className="text-left py-2.5 text-amber-500 hover:text-amber-400 font-extrabold font-mono uppercase tracking-wider text-xs"
                >
                  ⚡ Register & Sign In
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
