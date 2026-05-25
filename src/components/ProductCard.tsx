import React, { useState, MouseEvent } from 'react';
import { motion } from 'motion/react';
import { Heart, Eye, ShoppingCart, Star } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: string | number;
  product: Product;
  onWishlistToggle: (id: string) => void;
  isWishlisted: boolean;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
}

export default function ProductCard({
  product,
  onWishlistToggle,
  isWishlisted,
  onViewDetails,
  onAddToCart
}: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [isHovered, setIsHovered] = useState(false);
  const [adding, setAdding] = useState(false);

  const discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleAddToCartClick = (e: MouseEvent) => {
    e.stopPropagation();
    setAdding(true);
    onAddToCart(product, selectedSize, product.colors[0]?.name || 'Standard');
    setTimeout(() => setAdding(false), 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-neutral-800 bg-[#141414] transition-all duration-300 hover:border-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/[0.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Upper tag indicators & actions */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#1A1A1A]">
        
        {/* Product Image with Zoom Hover */}
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
          referrerPolicy="no-referrer"
        />

        {/* Backdrop shade on hover */}
        <div className="absolute inset-0 bg-[#000]/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Tag / Badge */}
        {product.tag && (
          <span className={`absolute left-3 top-3 rounded px-2.5 py-0.5 text-[9px] font-bold font-mono tracking-wider uppercase shadow-md ${
            product.tag === 'Best Seller' ? 'bg-amber-500 text-black' :
            product.tag === 'Limited Edition' ? 'bg-[#8B6914] text-white' :
            product.tag === 'Nuclear Proof' ? 'bg-purple-600 text-white animate-pulse' :
            'bg-rose-500 text-white'
          }`}>
            {product.tag}
          </span>
        )}

        {/* Premium Discount Flag */}
        {discountPercentage > 0 && (
          <span className="absolute left-3 top-9 rounded bg-emerald-500 px-2 py-0.5 text-[9px] font-extrabold font-mono text-black uppercase shadow-md">
            {discountPercentage}% OFF
          </span>
        )}

        {/* Favorite & QuickView Floating Buttons */}
        <div className="absolute right-3 top-3 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300 ease-out">
          <button
            onClick={() => onWishlistToggle(product.id)}
            className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900/90 text-gray-400 backdrop-blur-md transition-all hover:bg-neutral-800 hover:text-rose-500 shadow-md ${
              isWishlisted ? 'text-rose-500 border-rose-500/20 bg-rose-500/5' : ''
            }`}
            title="Add to Wishlist"
          >
            <Heart className={`h-4.5 w-4.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
          
          <button
            onClick={() => onViewDetails(product)}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900/90 text-gray-400 backdrop-blur-md transition-all hover:bg-neutral-800 hover:text-amber-400 shadow-md"
            title="Quick View Details"
          >
            <Eye className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Hover size overlay trigger at card bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Select Survival Size</span>
            <div className="flex flex-wrap gap-1">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(size);
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono transition-colors ${
                    selectedSize === size
                      ? 'bg-amber-500 text-black'
                      : 'bg-[#1C1C1E] border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Meta Content Section */}
      <div className="flex flex-1 flex-col p-4 space-y-2">
        
        {/* Category & Star rating */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold tracking-widest text-amber-500/60 uppercase">
            {product.category}
          </span>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-[10px] font-mono font-bold text-white">{product.rating}</span>
            <span className="text-[9px] text-neutral-500 font-mono">({product.reviewCount})</span>
          </div>
        </div>

        {/* Action Title */}
        <h3 
          onClick={() => onViewDetails(product)}
          className="text-sm font-semibold tracking-tight text-white line-clamp-1 cursor-pointer group-hover:text-amber-400 transition-colors"
        >
          {product.name}
        </h3>

        {/* Product Prices */}
        <div className="flex items-baseline gap-2.5">
          <span className="text-base font-black font-mono text-amber-400">₹{product.price}</span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-neutral-600 line-through font-mono font-medium">
              ₹{product.originalPrice}
            </span>
          )}
        </div>

        {/* Card Footer Actions */}
        <div className="pt-2">
          <button
            onClick={handleAddToCartClick}
            disabled={adding}
            className={`w-full cursor-pointer rounded-lg py-1.5 px-3 text-xs font-mono font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
              adding
                ? 'bg-emerald-500 text-black'
                : 'bg-amber-500 hover:bg-amber-600 text-black active:scale-[0.98]'
            }`}
          >
            {adding ? (
              <>👍 Survival Pack Secured</>
            ) : (
              <>
                <ShoppingCart className="h-3.5 w-3.5 stroke-[2.5]" />
                Add To Cart
              </>
            )}
          </button>
        </div>

      </div>
    </motion.div>
  );
}
