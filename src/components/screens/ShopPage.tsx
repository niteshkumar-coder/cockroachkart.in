import { useState } from 'react';
import { motion } from 'motion/react';
import { Filter, Star, X, Grid, List, RefreshCw } from 'lucide-react';
import { Product, ScreenType, FilterState } from '../../types';
import ProductCard from '../ProductCard';

interface ShopPageProps {
  products: Product[];
  setScreen: (screen: ScreenType) => void;
  setSelectedProduct: (prod: Product) => void;
  onWishlistToggle: (id: string) => void;
  wishlist: string[];
  onAddToCart: (product: Product, size: string, color: string) => void;
  searchFilter: string;
}

export default function ShopPage({
  products,
  setScreen,
  setSelectedProduct,
  onWishlistToggle,
  wishlist,
  onAddToCart,
  searchFilter
}: ShopPageProps) {
  // Filters State
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceLimit, setPriceLimit] = useState<number>(2999);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'low-to-high' | 'high-to-low' | 'newest' | 'popularity'>('popularity');

  // Categories list
  const categories = ["Graphic Tees", "Plain Tees", "Oversized", "Vintage", "Sports", "Limited Edition"];
  
  // Available Sizes
  const sizes = ["S", "M", "L", "XL", "XXL"];

  // Toggle helpers
  const handleCategoryToggle = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleSizeToggle = (sz: string) => {
    setSelectedSizes(prev => 
      prev.includes(sz) ? prev.filter(s => s !== sz) : [...prev, sz]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setPriceLimit(2999);
    setMinRating(null);
    setSortBy('popularity');
  };

  // Filter application logic
  const filteredProducts = products.filter(product => {
    // Search match
    if (searchFilter && !product.name.toLowerCase().includes(searchFilter.toLowerCase())) {
      return false;
    }
    // Category match
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
      return false;
    }
    // Size match
    if (selectedSizes.length > 0) {
      const hasSize = product.sizes.some(s => selectedSizes.includes(s));
      if (!hasSize) return false;
    }
    // Price match
    if (product.price > priceLimit) {
      return false;
    }
    // Rating match
    if (minRating !== null && product.rating < minRating) {
      return false;
    }
    return true;
  });

  // Sorting logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'low-to-high') return a.price - b.price;
    if (sortBy === 'high-to-low') return b.price - a.price;
    if (sortBy === 'newest') return a.tag === 'New Arrival' ? -1 : 1;
    // popularity default
    return b.rating - a.rating;
  });

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-900 pb-5 mb-8">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white font-sans">
              THE SURVIVAL <span className="text-amber-400">STORE</span>
            </h1>
            <p className="text-xs text-neutral-500 font-mono mt-1">
              Showing {sortedProducts.length} of {products.length} indestructible garments
              {searchFilter && ` matching "${searchFilter}"`}
            </p>
          </div>

          {/* Sorters and helpers */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-400 font-mono font-bold uppercase shrink-0">Sort By</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#141414] border border-neutral-800 rounded-lg text-xs font-mono py-1.5 px-3 text-white focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="popularity">★ Best Value (Popularity)</option>
              <option value="low-to-high">₹ Price: Low to High</option>
              <option value="high-to-low">₹ Price: High to Low</option>
              <option value="newest">✦ Fresh Arriving batches</option>
            </select>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar Filter Section */}
          <div className="space-y-6 lg:col-span-1 border border-neutral-900/60 bg-[#141414]/50 p-6 rounded-2xl h-fit">
            <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
              <span className="text-xs font-mono font-black uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                <Filter className="h-4.5 w-4.5 stroke-[2.5]" />
                Filters
              </span>
              <button 
                onClick={handleClearFilters}
                className="text-[10px] font-mono font-bold text-gray-500 hover:text-white flex items-center gap-1 uppercase transition-colors cursor-pointer"
              >
                <X className="h-3 w-3" /> Clear All
              </button>
            </div>

            {/* Categories filter box */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold font-mono uppercase text-white tracking-wider">Classification Catalog</h3>
              <div className="flex flex-col gap-2">
                {categories.map((cat) => {
                  const active = selectedCategories.includes(cat);
                  return (
                    <label key={cat} className="flex items-center gap-2.5 text-xs text-neutral-400 cursor-pointer hover:text-white select-none">
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() => handleCategoryToggle(cat)}
                        className="accent-amber-500 rounded h-3.5 w-3.5 cursor-pointer bg-neutral-900 border-neutral-800"
                      />
                      <span className={active ? "text-amber-400 font-semibold" : ""}>{cat}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Price Slider filter box */}
            <div className="space-y-3 border-t border-neutral-900/60 pt-4">
              <div className="flex justify-between items-center text-xs font-mono text-neutral-400">
                <span className="font-bold uppercase tracking-wider">Capped Price</span>
                <span className="text-amber-400 font-semibold text-xs font-mono">₹{priceLimit}</span>
              </div>
              <input
                type="range"
                min={499}
                max={2999}
                step={50}
                value={priceLimit}
                onChange={(e) => setPriceLimit(Number(e.target.value))}
                className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-gray-600">
                <span>₹499</span>
                <span>₹2999</span>
              </div>
            </div>

            {/* Sizes filter swatches */}
            <div className="space-y-3 border-t border-neutral-900/60 pt-4">
              <h3 className="text-xs font-bold font-mono uppercase text-white tracking-wider">Tactical Size Spec</h3>
              <div className="flex flex-wrap gap-1.5">
                {sizes.map((sz) => {
                  const active = selectedSizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      onClick={() => handleSizeToggle(sz)}
                      className={`px-3 py-1 text-xs font-mono font-bold rounded-lg transition-colors cursor-pointer ${
                        active
                          ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/10'
                          : 'bg-[#1C1C1E] border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ratings filter blocks */}
            <div className="space-y-3 border-t border-neutral-900/60 pt-4">
              <h3 className="text-xs font-bold font-mono uppercase text-white tracking-wider">Durability Rating</h3>
              <div className="flex flex-col gap-2">
                {[4.7, 4.5, 4.0].map((star) => (
                  <button
                    key={star}
                    onClick={() => setMinRating(minRating === star ? null : star)}
                    className={`flex items-center gap-2 text-xs text-left cursor-pointer transition-colors ${
                      minRating === star ? 'text-amber-400 font-semibold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          className={`h-3 w-3 ${
                            s <= Math.floor(star) ? 'fill-amber-400 text-amber-400' : 'text-neutral-700'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="font-mono text-[10px] uppercase">{star}★ & Above</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Product Grid Display */}
          <div className="lg:col-span-3 space-y-8">
            {sortedProducts.length === 0 ? (
              <div className="border border-dashed border-amber-500/20 rounded-2xl p-16 text-center space-y-4 bg-amber-500/[0.01]">
                <div className="text-5xl select-none">🪳💧</div>
                <h3 className="font-bold font-mono text-sm uppercase tracking-wider text-amber-400">Empty Hive!</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">No surviving apparel modules matched the requested attributes. Adjust filters or search terms to try again.</p>
                <button
                  onClick={handleClearFilters}
                  className="rounded-lg bg-amber-500 hover:bg-amber-600 transition-colors px-4 py-2 text-xs font-mono text-black font-bold uppercase tracking-wider cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onWishlistToggle={onWishlistToggle}
                    isWishlisted={wishlist.includes(prod.id)}
                    onViewDetails={setSelectedProduct}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
