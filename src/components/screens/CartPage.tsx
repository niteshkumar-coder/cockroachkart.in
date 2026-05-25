import React, { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Trash2, ArrowRight, ArrowLeft, Percent, ShieldCheck, RefreshCw } from 'lucide-react';
import { Product, ScreenType, CartItem } from '../../types';

interface CartPageProps {
  cart: CartItem[];
  setScreen: (screen: ScreenType) => void;
  updateCartQty: (itemId: string, qty: number) => void;
  removeCartItem: (itemId: string) => void;
  clearCart: () => void;
  couponApplied: boolean;
  setCouponApplied: (applied: boolean) => void;
}

export default function CartPage({
  cart,
  setScreen,
  updateCartQty,
  removeCartItem,
  clearCart,
  couponApplied,
  setCouponApplied
}: CartPageProps) {
  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState('');
  const [couponError, setCouponError] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const discountAmount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const deliveryCharge = subtotal > 499 ? 0 : 49;
  const totalAmount = subtotal - discountAmount + deliveryCharge;

  const handleApplyCoupon = (e: FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'SURVIVAL10') {
      setCouponApplied(true);
      setCouponError(false);
      setCouponMsg('Success: SURVIVAL10 promo code applied! 10% has been deducted.');
    } else {
      setCouponError(true);
      setCouponMsg('Invalid coupon. Try SURVIVAL10 for 10% off.');
    }
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(false);
    setCouponCode('');
    setCouponMsg('Coupon removed.');
    setCouponError(false);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        
        {/* Navigation Indicator */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-900">
          <div>
            <h1 className="text-2xl font-extrabold uppercase font-sans tracking-tight">Your Survival Basket</h1>
            <p className="text-xs text-neutral-500 font-mono mt-1">Ready to deploy items to active addresses</p>
          </div>
          <button 
            onClick={() => setScreen('shop')}
            className="text-xs font-mono text-amber-400 hover:underline flex items-center gap-1.5 uppercase cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Continue Shopping
          </button>
        </div>

        {cart.length === 0 ? (
          /* Empty Cart State */
          <div className="border border-neutral-800 rounded-3xl p-16 text-center space-y-6 bg-gradient-to-b from-[#141414]/50 to-transparent">
            <span className="text-6xl select-none leading-none block">🪳💧</span>
            <div className="space-y-2">
              <h3 className="text-lg font-bold font-mono tracking-wider uppercase text-amber-400">Empty Carapace Basket</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">You have no t-shirts registered in your active basket. Browse our collection to begin survival layering.</p>
            </div>
            <button
              onClick={() => setScreen('shop')}
              className="rounded-xl cursor-pointer bg-amber-500 hover:bg-amber-600 transition-colors text-black font-mono font-black text-xs uppercase px-8 py-3 tracking-wider shadow-lg shadow-amber-500/10"
            >
              Start Shopping Stream
            </button>
          </div>
        ) : (
          /* Full Cart Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column - List of Cart Items */}
            <div className="lg:col-span-8 space-y-4">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-neutral-800 rounded-xl bg-[#141414] hover:border-neutral-750 transition-all shadow"
                  >
                    <div className="flex gap-4 items-center">
                      {/* Product Thumbnail */}
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-lg border border-neutral-800"
                        referrerPolicy="no-referrer"
                      />
                      {/* Metainfo */}
                      <div>
                        <h4 className="text-sm font-semibold text-white tracking-tight">{item.product.name}</h4>
                        <p className="text-[10px] text-amber-500 font-mono tracking-widest uppercase mt-0.5">{item.product.category}</p>
                        
                        <div className="flex items-center gap-3 mt-1.5 font-mono text-[10px]">
                          <span className="bg-neutral-900 border border-neutral-800 text-gray-400 px-2 py-0.5 rounded uppercase">Size: <strong className="text-white">{item.selectedSize}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity Selector, subtotal and remove actions */}
                    <div className="flex items-center justify-between sm:justify-start gap-6 border-t sm:border-t-0 border-neutral-900 pt-3 sm:pt-0">
                      
                      {/* Selector */}
                      <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-lg">
                        <button
                          onClick={() => updateCartQty(item.id, Math.max(1, item.quantity - 1))}
                          className="h-8 w-8 text-xs font-mono hover:text-white text-gray-500 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQty(item.id, Math.min(10, item.quantity + 1))}
                          className="h-8 w-8 text-xs font-mono hover:text-white text-gray-500 cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      {/* Prices */}
                      <div className="text-right font-mono text-sm">
                        <span className="block font-black text-amber-400">₹{item.product.price * item.quantity}</span>
                        {item.quantity > 1 && (
                          <span className="text-[9px] text-gray-600 block">₹{item.product.price} each</span>
                        )}
                      </div>

                      {/* Trash Button */}
                      <button
                        onClick={() => removeCartItem(item.id)}
                        className="p-1 px-2 text-neutral-500 hover:text-rose-500 transition-colors rounded hover:bg-[#1C1C1E] cursor-pointer"
                        title="Remove specimen module"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>

                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Clear button */}
              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => { setScreen('shop'); }}
                  className="rounded px-3 py-1 font-mono text-[10px] font-bold uppercase text-[#8B6914] bg-amber-500/5 border border-amber-500/10 hover:bg-amber-500/10"
                >
                  ◀ Add More SPECIMENS
                </button>
                <button
                  onClick={clearCart}
                  className="rounded px-3 py-1 font-mono text-[10px] font-bold uppercase text-gray-500 border border-neutral-900 hover:border-neutral-800 hover:text-white cursor-pointer"
                >
                  Clear Entire Basket
                </button>
              </div>
            </div>

            {/* Right Column - Order Summary Billing Panel (Sticky) */}
            <div className="lg:col-span-4 bg-[#141414] border border-neutral-800 rounded-2xl p-6 space-y-6 lg:sticky lg:top-24">
              <h3 className="text-xs font-mono uppercase font-black text-amber-400 border-b border-neutral-900 pb-3">
                DEPLOY SUMMARY
              </h3>

              {/* Promo input code forms */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <label className="block text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">PROMOTIONAL CODE</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. SURVIVAL10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.replace(/\s+/g, ''))}
                    className="flex-1 bg-[#1C1C1E] border border-neutral-800 rounded-lg text-xs px-3 py-1.5 font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 uppercase"
                    disabled={couponApplied}
                  />
                  {couponApplied ? (
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="rounded-lg bg-neutral-800 border border-neutral-750 font-mono text-[10px] font-bold uppercase px-4 cursor-pointer text-rose-500"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="rounded-lg bg-amber-500 hover:bg-amber-600 transition-colors font-mono text-[10px] uppercase text-black font-bold px-4 cursor-pointer"
                    >
                      Apply
                    </button>
                  )}
                </div>

                {couponMsg && (
                  <div className={`text-[10px] font-mono mt-1 ${couponError ? 'text-rose-500' : 'text-emerald-400'}`}>
                    {couponMsg}
                  </div>
                )}
              </form>

              {/* Sub billing list */}
              <div className="space-y-3 pt-3 border-t border-neutral-950 font-mono text-xs">
                
                <div className="flex justify-between text-neutral-400">
                  <span>Gross subtotal</span>
                  <span className="text-white font-bold">₹{subtotal}</span>
                </div>

                {couponApplied && (
                  <div className="flex justify-between text-emerald-400">
                    <span className="flex items-center gap-1">
                      <Percent className="h-3 w-3" /> Coupon (10% OFF)
                    </span>
                    <span>- ₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-400">
                  <span>Dispatch courier charge</span>
                  {deliveryCharge === 0 ? (
                    <span className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Free Delivery</span>
                  ) : (
                    <span className="text-white">₹{deliveryCharge}</span>
                  )}
                </div>

                {deliveryCharge > 0 && (
                  <div className="text-[10px] text-gray-500 text-right -mt-2">
                    Free dispatch on values &gt; ₹499
                  </div>
                )}

                <div className="border-t border-neutral-900 pt-3 flex justify-between text-sm">
                  <span className="font-extrabold text-white">ORDER NET VALUE</span>
                  <span className="font-black text-amber-400 text-base">₹{totalAmount}</span>
                </div>

              </div>

              {/* Checkout redirect CTA */}
              <button
                onClick={() => setScreen('address')}
                className="w-full cursor-pointer rounded-xl bg-amber-500 hover:bg-amber-600 transition-colors py-3 text-xs font-mono font-black uppercase text-black flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10"
              >
                Assemble Address Sheet <ArrowRight className="h-3.5 w-3.5" />
              </button>

              {/* Security badges */}
              <div className="border-t border-neutral-900 pt-4 text-[10px] text-gray-500 flex flex-col gap-1.5 font-mono">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-amber-500" />
                  SSL ENCRYPTED HIGH-LINE BACKEND TUNNEL
                </span>
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="h-4 w-4 text-amber-500" />
                  7-DAY HASLE-FREE SURVIVAL SWAP INTEGRITY
                </span>
              </div>

            </div>

          </div>
        )
        }

      </div>
    </div>
  );
}
