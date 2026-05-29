import React, { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ChevronRight, Check, MapPin, Plus, CreditCard, Landmark, Truck, Lock, Sparkles, Copy, Calendar } from 'lucide-react';
import { Product, ScreenType, CartItem, SavedAddress, Order } from '../../types';

interface CheckoutFlowProps {
  currentStep: 'address' | 'payment' | 'confirmation';
  setScreen: (screen: ScreenType) => void;
  cart: CartItem[];
  clearCart: () => void;
  addresses: SavedAddress[];
  onAddAddress: (addr: SavedAddress) => void;
  couponApplied: boolean;
  onOrderPlaced: (order: Order) => void;
  latestPlacedOrder: Order | null;
}

export default function CheckoutFlow({
  currentStep,
  setScreen,
  cart,
  clearCart,
  addresses,
  onAddAddress,
  couponApplied,
  onOrderPlaced,
  latestPlacedOrder
}: CheckoutFlowProps) {
  // Address selection state
  const [selectedAddrId, setSelectedAddrId] = useState(addresses[0]?.id || '');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [addressError, setAddressError] = useState('');

  // Sync selected address if list updates or list was empty and first address was added
  React.useEffect(() => {
    if (addresses.length > 0 && (!selectedAddrId || !addresses.some(a => a.id === selectedAddrId))) {
      setSelectedAddrId(addresses[0].id);
      setAddressError('');
    }
  }, [addresses, selectedAddrId]);

  // Address Form fields
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newHouse, setNewHouse] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('Maharashtra');
  const [newPincode, setNewPincode] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [newType, setNewType] = useState<'Home' | 'Work' | 'Other'>('Home');

  // Payment State (Exclusive Cash on Delivery restriction)
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod' | 'netbanking'>('cod');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Confirmation Helpers
  const [copiedTracking, setCopiedTracking] = useState(false);

  // Math totals calculation
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const discountAmount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const deliveryCharge = subtotal > 499 ? 0 : 49;
  const totalAmount = subtotal - discountAmount + deliveryCharge;

  // Handle navigating from address phase to payment phase
  const handleProceedToPaymentCheck = () => {
    const matchedAddress = addresses.find(a => a.id === selectedAddrId);
    if (addresses.length === 0 || !matchedAddress) {
      setAddressError("⚠️ Please fill out and deploy a shipping address, then select it before proceeding.");
      setShowNewAddressForm(true);
      return;
    }
    setAddressError('');
    setScreen('payment');
  };

  // Address submission
  const handleAddNewAddress = (e: FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone || !newHouse || !newStreet || !newCity || !newPincode) return;
    
    const newAddr: SavedAddress = {
      id: `addr-${Date.now()}`,
      name: newName,
      phone: newPhone,
      houseNo: newHouse,
      street: newStreet,
      city: newCity,
      state: newState,
      pincode: newPincode,
      landmark: newLandmark,
      type: newType,
      isDefault: false
    };

    onAddAddress(newAddr);
    setSelectedAddrId(newAddr.id);
    setShowNewAddressForm(false);
    setAddressError('');
    
    // Reset Form
    setNewName('');
    setNewPhone('');
    setNewHouse('');
    setNewStreet('');
    setNewCity('');
    setNewPincode('');
    setNewLandmark('');
  };

  // Order dispatcher
  const handlePlaceOrder = () => {
    const matchedAddress = addresses.find(a => a.id === selectedAddrId) || addresses[0];
    
    // Generate order metrics
    const orderNo = `CK-${Date.now().toString().slice(-8).toUpperCase()}`;
    const estDelivery = new Date();
    estDelivery.setDate(estDelivery.getDate() + 4);

    const completeOrder: Order = {
      id: orderNo,
      date: new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      items: [...cart],
      subtotal,
      discount: discountAmount,
      deliveryCharges: deliveryCharge,
      totalAmount,
      status: 'Processing',
      address: matchedAddress,
      paymentMethod: paymentMethod.toUpperCase(),
      estimatedDelivery: estDelivery.toLocaleDateString('en-IN', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      })
    };

    onOrderPlaced(completeOrder);
    clearCart(); // Empties shopping state
    setScreen('confirmation');
  };

  const handleCopyTracking = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 1500);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        
        {/* Step Indicator Headers */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10 select-none pb-6 border-b border-neutral-900 overflow-x-auto">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="h-6 w-6 rounded-full bg-neutral-800 text-xs text-amber-400 border border-amber-500/10 flex items-center justify-center font-mono font-bold">1</span>
            <span className="text-xs font-mono font-bold text-gray-400">Cart Basket</span>
          </div>
          <ChevronRight className="h-4 w-4 text-neutral-800" />
          
          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`h-6 w-6 rounded-full text-xs font-mono font-bold flex items-center justify-center ${
              currentStep === 'address' ? 'bg-amber-500 text-black' : 'bg-neutral-800 text-amber-400'
            }`}>2</span>
            <span className={`text-xs font-mono font-bold ${currentStep === 'address' ? 'text-amber-400' : 'text-gray-450'}`}>Addresses</span>
          </div>
          <ChevronRight className="h-4 w-4 text-neutral-800" />

          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`h-6 w-6 rounded-full text-xs font-mono font-bold flex items-center justify-center ${
              currentStep === 'payment' ? 'bg-amber-500 text-black' : 'bg-neutral-800 text-amber-400'
            }`}>3</span>
            <span className={`text-xs font-mono font-bold ${currentStep === 'payment' ? 'text-amber-400' : 'text-gray-450'}`}>Payment</span>
          </div>
          <ChevronRight className="h-4 w-4 text-neutral-800" />

          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`h-6 w-6 rounded-full text-xs font-mono font-bold flex items-center justify-center ${
              currentStep === 'confirmation' ? 'bg-amber-500 text-black' : 'bg-neutral-800 text-amber-400'
            }`}>4</span>
            <span className={`text-xs font-mono font-bold ${currentStep === 'confirmation' ? 'text-amber-400' : 'text-gray-450'}`}>Confirmation</span>
          </div>
        </div>

        {/* --- STEP 1: ADDRESS DISPATCH SHEET --- */}
        {currentStep === 'address' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: List Addresses and New forms */}
            <div className="lg:col-span-8 space-y-6">
              <h2 className="text-lg font-black uppercase font-mono text-amber-400 border-b border-neutral-900 pb-2">
                SHIPPING DEPLOY LOCATION
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.length === 0 ? (
                  <div className="col-span-1 md:col-span-2 border border-dashed border-neutral-800 rounded-xl p-8 text-center text-xs font-mono text-neutral-500 space-y-2">
                    <div className="text-2xl animate-pulse">⚓</div>
                    <div className="font-bold text-neutral-400">NO SHIELD LOCATION DEPLOYED</div>
                    <p className="text-[10px] text-gray-500 font-sans max-w-sm mx-auto leading-relaxed">
                      You have not registered any delivery coordinates. Please fill out and submit the address form below to proceed.
                    </p>
                  </div>
                ) : (
                  addresses.map((addr) => {
                    const isChecked = selectedAddrId === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddrId(addr.id)}
                        className={`relative rounded-xl border p-4 cursor-pointer select-none transition-all flex flex-col justify-between ${
                          isChecked 
                            ? 'border-amber-400 bg-amber-500/[0.02] shadow-lg shadow-amber-500/[0.01]' 
                            : 'border-neutral-850 bg-[#141414] hover:border-neutral-750'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="rounded bg-neutral-900 border border-neutral-800 px-2 py-0.5 text-[8.5px] font-mono tracking-wider uppercase text-amber-400 font-bold">
                              {addr.type}
                            </span>
                            <input
                              type="radio"
                              name="delivery_address"
                              checked={isChecked}
                              onChange={() => setSelectedAddrId(addr.id)}
                              className="accent-amber-500 h-3.5 w-3.5 cursor-pointer bg-neutral-900 border-neutral-800"
                            />
                          </div>

                          <div className="text-sm font-semibold text-white">{addr.name}</div>
                          <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                            {addr.houseNo}, {addr.street}, {addr.city} - <strong className="text-white font-mono">{addr.pincode}</strong>, {addr.state}
                          </p>
                          <p className="text-[10px] text-gray-500 font-mono">Phone: {addr.phone}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Add form toggles */}
              {!showNewAddressForm ? (
                <button
                  onClick={() => setShowNewAddressForm(true)}
                  className="rounded-xl border border-dashed border-neutral-800 hover:border-amber-500/30 p-5 w-full flex items-center justify-center gap-2 text-xs font-mono font-bold text-gray-400 hover:text-amber-400 transition-colors uppercase cursor-pointer"
                >
                  <Plus className="h-4.5 w-4.5" /> Deploy New Address Form
                </button>
              ) : (
                <form onSubmit={handleAddNewAddress} className="bg-[#141414] border border-neutral-850 p-6 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center border-b border-neutral-900 pb-2">
                    <span className="text-xs font-mono font-bold text-amber-400 uppercase">Input Custom Location</span>
                    <button 
                      type="button" 
                      onClick={() => setShowNewAddressForm(false)}
                      className="text-[10px] font-mono text-gray-500 hover:text-white uppercase font-bold"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-neutral-500 uppercase font-bold mb-1">Full Name</label>
                      <input
                        type="text" required value={newName} onChange={(e) => setNewName(e.target.value)}
                        placeholder="xxxxxxxx"
                        className="w-full rounded-lg bg-[#1C1C1E] border border-neutral-800 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-neutral-500 uppercase font-bold mb-1">Phone Number</label>
                      <input
                        type="tel" required value={newPhone} onChange={(e) => setNewPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 91283XXXXX"
                        className="w-full rounded-lg bg-[#1C1C1E] border border-neutral-800 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <label className="block text-[10px] font-mono text-neutral-500 uppercase font-bold mb-1">Pincode</label>
                      <input
                        type="text" required value={newPincode} maxLength={6} onChange={(e) => setNewPincode(e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 400001"
                        className="w-full rounded-lg bg-[#1C1C1E] border border-neutral-800 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none font-mono"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-[10px] font-mono text-neutral-500 uppercase font-bold mb-1">City</label>
                      <input
                        type="text" required value={newCity} onChange={(e) => setNewCity(e.target.value)}
                        placeholder="Mumbai"
                        className="w-full rounded-lg bg-[#1C1C1E] border border-neutral-800 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-[10px] font-mono text-neutral-500 uppercase font-bold mb-1">State</label>
                      <select
                        value={newState} onChange={(e) => setNewState(e.target.value)}
                        className="w-full rounded-lg bg-[#1C1C1E] border border-neutral-800 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                      >
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Bihar">Bihar</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-neutral-500 uppercase font-bold mb-1">Flat / House Number</label>
                      <input
                        type="text" required value={newHouse} onChange={(e) => setNewHouse(e.target.value)}
                        placeholder="Block No. 4, Room 405"
                        className="w-full rounded-lg bg-[#1C1C1E] border border-neutral-800 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-neutral-500 uppercase font-bold mb-1">Street / Area Address</label>
                      <input
                        type="text" required value={newStreet} onChange={(e) => setNewStreet(e.target.value)}
                        placeholder="BKC, Golden wing lane"
                        className="w-full rounded-lg bg-[#1C1C1E] border border-neutral-800 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-neutral-500 uppercase font-bold mb-1">Landmark (Optional)</label>
                      <input
                        type="text" value={newLandmark} onChange={(e) => setNewLandmark(e.target.value)}
                        placeholder="Behind Survival Dome"
                        className="w-full rounded-lg bg-[#1C1C1E] border border-neutral-800 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-neutral-500 uppercase font-bold mb-1">Location Label</label>
                      <div className="flex gap-2">
                        {(['Home', 'Work', 'Other'] as const).map((type) => (
                          <button
                            key={type} type="button" onClick={() => setNewType(type)}
                            className={`flex-1 rounded-lg py-2 border text-xs font-mono font-bold transition-all ${
                              newType === type 
                                ? 'bg-amber-400 text-black border-amber-400' 
                                : 'bg-[#1C1C1E] border-neutral-800 text-neutral-400'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full cursor-pointer bg-amber-500 hover:bg-amber-600 transition-colors rounded-lg py-2.5 text-xs font-mono uppercase font-black text-black"
                  >
                    Assemble Location Address
                  </button>
                </form>
              )}
            </div>

            {/* Right Column: Mini bill summaries with actions to Payment screen */}
            <div className="lg:col-span-4 bg-[#141414] border border-neutral-850 rounded-2xl p-6 space-y-6">
              <h3 className="text-xs font-mono uppercase font-black text-amber-400 border-b border-neutral-900 pb-2">Summary</h3>
              
              <div className="space-y-4 max-h-40 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-2 text-xs font-mono">
                    <img src={item.product.images[0]} alt="" className="h-8 w-8 object-cover rounded border border-neutral-900" referrerPolicy="no-referrer" />
                    <div className="flex-1 min-w-0">
                      <div className="text-white truncate font-semibold">{item.product.name}</div>
                      <div className="text-[10px] text-gray-500">Qty: {item.quantity} | Size: {item.selectedSize}</div>
                    </div>
                    <span className="text-amber-500 font-bold py-1">₹{item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-neutral-900 pt-4 text-xs font-mono space-y-2.5">
                <div className="flex justify-between text-neutral-400">
                  <span>Gross values</span>
                  <span>₹{subtotal}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Voucher Applied</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-400">
                  <span>Courier charge</span>
                  <span>{deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge}`}</span>
                </div>
                <div className="border-t border-neutral-900 pt-3 flex justify-between text-sm font-bold">
                  <span className="text-white">NET AMOUNTS</span>
                  <span className="text-amber-400">₹{totalAmount}</span>
                </div>
              </div>

              {addressError && (
                <div className="text-[10px] bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono rounded-lg p-3 text-center leading-relaxed">
                  {addressError}
                </div>
              )}

              <button
                onClick={handleProceedToPaymentCheck}
                className="w-full cursor-pointer rounded-xl bg-amber-500 hover:bg-amber-600 transition-colors py-3 text-xs font-mono font-black text-black uppercase tracking-wider text-center"
              >
                Proceed to Payment Check
              </button>
            </div>

          </div>
        )}

        {/* --- STEP 2: SECURED PAYMENT PORTAL --- */}
        {currentStep === 'payment' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left payment selectors */}
            <div className="lg:col-span-8 space-y-6">
              <h2 className="text-lg font-black uppercase font-mono text-amber-400 border-b border-neutral-900 pb-2">
                CHOOSE PAYMENT PROTOCOL
              </h2>

              <div className="space-y-4">
                
                {/* 1. Cash on Delivery (Exclusive Authorized Survival Protocol) */}
                <div className="rounded-xl border p-6 bg-gradient-to-r from-amber-500/5 to-transparent border-amber-500/30 shadow-lg shadow-amber-500/[0.02]">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="p-2 sm:p-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl shrink-0">
                        <Truck className="h-6 w-6 stroke-[2]" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm sm:text-base font-bold text-white uppercase font-mono tracking-wide">Cash on Delivery (COD)</span>
                          <span className="text-[8px] sm:text-[9px] bg-amber-500 text-black px-1.5 py-0.5 rounded font-black font-mono">EXCLUSIVE PAYMENT</span>
                        </div>
                        <span className="block text-xs text-zinc-400">Enjoy seamless, pressure-safe verification. Pay with cash, card, or any UPI app of your choice upon verified parcel arrival.</span>
                        <p className="text-[10px] text-amber-500/80 font-mono mt-1">✓ No advance transaction risks. Pay right at your doorstep.</p>
                      </div>
                    </div>
                    <div className="h-5 w-5 rounded-full border-2 border-amber-500 flex items-center justify-center p-0.5 mt-1 shrink-0">
                      <div className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Summary */}
            <div className="lg:col-span-4 bg-[#141414] border border-neutral-850 rounded-2xl p-6 space-y-6">
              <h3 className="text-xs font-mono uppercase font-black text-amber-400 border-b border-neutral-900 pb-2">Summary billing</h3>
              
              <div className="space-y-2.5 font-mono text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Gross values</span>
                  <span>₹{subtotal}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount vouchers</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-400">
                  <span>Courier logistics</span>
                  <span>{deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge}`}</span>
                </div>
                <div className="border-t border-neutral-900 pt-3 flex justify-between text-sm font-bold">
                  <span className="text-white font-extrabold uppercase">Net pay values</span>
                  <span className="text-amber-400 text-base font-black">₹{totalAmount}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full cursor-pointer rounded-xl bg-amber-500 hover:bg-amber-600 transition-colors py-3 text-xs font-mono font-black text-black uppercase tracking-wider text-center flex items-center justify-center gap-2"
              >
                <Lock className="h-4.5 w-4.5 stroke-[2.5]" /> Deploy Final Order
              </button>
            </div>

          </div>
        )}

        {/* --- STEP 3: ORDER CONFIRMED GRAPHICS --- */}
        {currentStep === 'confirmation' && latestPlacedOrder && (
          <div className="max-w-2xl mx-auto border border-amber-500/15 rounded-3xl bg-[#141414] p-8 sm:p-12 text-center relative overflow-hidden space-y-8 shadow-2xl">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 select-none opacity-[0.02] pointer-events-none h-80 w-80">
              <img 
                src="https://i.ibb.co/LhkQwD3z/Gemini-Generated-Image-noyty8noyty8noyt-1-removebg-preview.png" 
                alt="" 
                className="h-full w-full object-contain filter invert opacity-50" 
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Simulated micro confetti gold circles */}
            <div className="relative inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Check className="h-8 w-8 stroke-[3.5] animate-scale" />
            </div>

            <div className="space-y-2">
              <span className="text-xs text-amber-400 font-mono tracking-widest uppercase bg-amber-450/[0.03] border border-amber-500/15 px-3 py-1 rounded">DEPLOYS COMPELTED SUCCESSFUL</span>
              <h1 className="text-3xl font-extrabold tracking-tight font-sans text-white">YOUR ORDER IS UNSTOPPABLE!</h1>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">We swarmed your order into the active scheduling pipeline. Your items will easily weather any travel storms en-route.</p>
            </div>

            {/* Metainfo block details */}
            <div className="bg-neutral-950 border border-neutral-900 p-5 rounded-2xl grid grid-cols-2 gap-4 text-left text-xs font-mono">
              <div className="space-y-1">
                <span className="block text-[9px] text-gray-400 uppercase tracking-wider">Deploy Code ID</span>
                <span className="text-white font-bold flex items-center gap-1">
                  {latestPlacedOrder.id}
                  <button 
                    onClick={() => handleCopyTracking(latestPlacedOrder.id)}
                    className="text-gray-500 hover:text-white transition-colors"
                    title="Copy Tracking ID"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </span>
                {copiedTracking && <span className="text-[8px] text-emerald-400 font-semibold uppercase block">Copied success</span>}
              </div>
              <div className="space-y-1">
                <span className="block text-[9px] text-gray-400 uppercase tracking-wider">Scheduled Delivery</span>
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  {latestPlacedOrder.estimatedDelivery}
                </span>
              </div>
              <div className="col-span-2 space-y-1 pt-2 border-t border-neutral-900">
                <span className="block text-[9px] text-gray-400 uppercase tracking-wider font-semibold">Deploy Location Address</span>
                <p className="text-xs text-neutral-500 leading-relaxed font-sans">
                  {latestPlacedOrder.address.houseNo}, {latestPlacedOrder.address.street}, {latestPlacedOrder.address.city}, {latestPlacedOrder.address.state}
                </p>
              </div>
            </div>

            {/* Direct navigation buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setScreen('shop')}
                className="w-full cursor-pointer rounded-xl border border-neutral-805 bg-[#141414] hover:bg-neutral-900 transition-colors py-3 text-xs font-mono font-bold uppercase text-white"
              >
                Crawl More Catalog
              </button>
              <button
                onClick={() => setScreen('dashboard')}
                className="w-full cursor-pointer rounded-xl bg-amber-500 hover:bg-amber-600 transition-colors py-3 text-xs font-mono font-black uppercase text-black"
              >
                Deploy Scurry Tracker
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
