import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Homepage from './components/screens/Homepage';
import ShopPage from './components/screens/ShopPage';
import ProductDetailPage from './components/screens/ProductDetailPage';
import CartPage from './components/screens/CartPage';
import CheckoutFlow from './components/screens/CheckoutFlow';
import DashboardPage from './components/screens/DashboardPage';
import AuthPage from './components/screens/AuthPage';
import StaticPages from './components/screens/StaticPages';
import AdminDashboardPage from './components/screens/AdminDashboardPage';

import { 
  Product, 
  CartItem, 
  SavedAddress, 
  Order, 
  ScreenType, 
  StaticPageType 
} from './types';

import { PRODUCTS, SAVED_ADDRESSES } from './data';

export default function App() {
  // Navigation Routing States
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [currentStaticTab, setCurrentStaticTab] = useState<StaticPageType>('about');
  
  // Selected Product Detail reference
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // E-commerce core transaction database states
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  
  // Default logged in user corresponding to User metadata (Nitesh Kumar)
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const stored = localStorage.getItem('cockroach_current_user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [couponApplied, setCouponApplied] = useState(false);
  const [latestPlacedOrder, setLatestPlacedOrder] = useState<Order | null>(null);

  // Dynamic Live Products Catalogue state
  const [products, setProducts] = useState<Product[]>(() => {
    const stored = localStorage.getItem('cockroach_products');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return PRODUCTS;
      }
    }
    return PRODUCTS;
  });
  
  // App search term filter
  const [searchFilter, setSearchFilter] = useState('');

  // Past purchases logs to populate dashboard beautifully right off the gate
  const [orders, setOrders] = useState<Order[]>([]);

  // Load user-dependent data dynamically on login or transition
  const syncUserData = () => {
    if (currentUser && currentUser.email) {
      const emailKey = currentUser.email.toLowerCase().trim();
      
      // Load Wishlist
      const storedWish = localStorage.getItem(`cockroach_wishlist_${emailKey}`);
      if (storedWish) {
        try { setWishlist(JSON.parse(storedWish)); } catch (e) { setWishlist([]); }
      } else {
        setWishlist([]);
      }

      // Load Addresses
      const storedAddr = localStorage.getItem(`cockroach_addresses_${emailKey}`);
      if (storedAddr) {
        try { setAddresses(JSON.parse(storedAddr)); } catch (e) { setAddresses([]); }
      } else {
        // Pre-populate survivor templates customized with user's verified details
        const personalizedTemplates = SAVED_ADDRESSES.map((addr, idx) => ({
          ...addr,
          id: `addr-${emailKey}-${idx}`,
          name: currentUser.name || "Default Buyer",
          phone: "Google Verified"
        }));
        setAddresses(personalizedTemplates);
        localStorage.setItem(`cockroach_addresses_${emailKey}`, JSON.stringify(personalizedTemplates));
      }

      // Load Orders
      const storedOrders = localStorage.getItem(`cockroach_orders_${emailKey}`);
      if (storedOrders) {
        try { setOrders(JSON.parse(storedOrders)); } catch (e) { setOrders([]); }
      } else {
        setOrders([]);
      }

      // Sync existing active cart items into user's account if any
      const storedCart = localStorage.getItem(`cockroach_cart_${emailKey}`);
      if (storedCart) {
        try {
          const parsed = JSON.parse(storedCart);
          if (parsed.length > 0) {
            setCart(parsed);
          } else if (cart.length > 0) {
            localStorage.setItem(`cockroach_cart_${emailKey}`, JSON.stringify(cart));
          }
        } catch (e) {
          if (cart.length > 0) {
            localStorage.setItem(`cockroach_cart_${emailKey}`, JSON.stringify(cart));
          }
        }
      } else {
        if (cart.length > 0) {
          localStorage.setItem(`cockroach_cart_${emailKey}`, JSON.stringify(cart));
        }
      }
    } else {
      // Clean view states in guest mode
      setWishlist([]);
      setAddresses([]);
      setOrders([]);
      setCart([]);
    }
  };

  useEffect(() => {
    syncUserData();
  }, [currentUser]);

  // Hook up real-time cross-tab and same-tab synchronization listeners
  useEffect(() => {
    const handleGlobalDataSync = () => {
      // 1. Refresh products list instantly
      const storedProducts = localStorage.getItem('cockroach_products');
      if (storedProducts) {
        try {
          setProducts(JSON.parse(storedProducts));
        } catch (e) {
          setProducts(PRODUCTS);
        }
      } else {
        setProducts(PRODUCTS);
      }

      // 2. Refresh user-dependent data like orders, address, wishlist
      syncUserData();
    };

    window.addEventListener('storage', handleGlobalDataSync);
    window.addEventListener('cockroach_db_sync', handleGlobalDataSync);

    return () => {
      window.removeEventListener('storage', handleGlobalDataSync);
      window.removeEventListener('cockroach_db_sync', handleGlobalDataSync);
    };
  }, [currentUser]);

  // Handle setting product for detail screen explicitly
  const handleSetSelectedProductInDetail = (prod: Product) => {
    setSelectedProduct(prod);
    setCurrentScreen('detail');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Cart operations with automated user synchronization
  const handleAddToCart = (product: Product, size: string, color: string, qty: number = 1) => {
    const itemId = `${product.id}-${size}-${color}`;
    setCart(prevCart => {
      let nextCart;
      const existingIdx = prevCart.findIndex(item => item.id === itemId);
      if (existingIdx > -1) {
        nextCart = [...prevCart];
        nextCart[existingIdx] = {
          ...nextCart[existingIdx],
          quantity: Math.min(10, nextCart[existingIdx].quantity + qty)
        };
      } else {
        nextCart = [...prevCart, {
          id: itemId,
          product,
          selectedSize: size,
          selectedColor: color,
          quantity: qty
        }];
      }
      if (currentUser?.email) {
        const emailKey = currentUser.email.toLowerCase().trim();
        localStorage.setItem(`cockroach_cart_${emailKey}`, JSON.stringify(nextCart));
      }
      return nextCart;
    });
  };

  const updateCartQty = (itemId: string, qty: number) => {
    setCart(prevCart => {
      const nextCart = prevCart.map(item => item.id === itemId ? { ...item, quantity: qty } : item);
      if (currentUser?.email) {
        const emailKey = currentUser.email.toLowerCase().trim();
        localStorage.setItem(`cockroach_cart_${emailKey}`, JSON.stringify(nextCart));
      }
      return nextCart;
    });
  };

  const removeCartItem = (itemId: string) => {
    setCart(prevCart => {
      const nextCart = prevCart.filter(item => item.id !== itemId);
      if (currentUser?.email) {
        const emailKey = currentUser.email.toLowerCase().trim();
        localStorage.setItem(`cockroach_cart_${emailKey}`, JSON.stringify(nextCart));
      }
      return nextCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    if (currentUser?.email) {
      const emailKey = currentUser.email.toLowerCase().trim();
      localStorage.setItem(`cockroach_cart_${emailKey}`, JSON.stringify([]));
    }
  };

  // Wishlist operations with automated user synchronization
  const handleWishlistToggle = (id: string) => {
    setWishlist(prev => {
      const next = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      if (currentUser?.email) {
        const emailKey = currentUser.email.toLowerCase().trim();
        localStorage.setItem(`cockroach_wishlist_${emailKey}`, JSON.stringify(next));
      }
      return next;
    });
  };

  // Addresses operations with automated user synchronization
  const handleAddAddress = (addr: SavedAddress) => {
    setAddresses(prev => {
      const next = [addr, ...prev];
      if (currentUser?.email) {
        const emailKey = currentUser.email.toLowerCase().trim();
        localStorage.setItem(`cockroach_addresses_${emailKey}`, JSON.stringify(next));
      }
      return next;
    });
  };

  const handleRemoveAddress = (id: string) => {
    setAddresses(prev => {
      const next = prev.filter(a => a.id !== id);
      if (currentUser?.email) {
        const emailKey = currentUser.email.toLowerCase().trim();
        localStorage.setItem(`cockroach_addresses_${emailKey}`, JSON.stringify(next));
      }
      return next;
    });
  };

  // Order management triggers with automated user synchronization
  const handleOrderPlaced = (newOrder: Order) => {
    setOrders(prev => {
      const next = [newOrder, ...prev];
      if (currentUser?.email) {
        const emailKey = currentUser.email.toLowerCase().trim();
        localStorage.setItem(`cockroach_orders_${emailKey}`, JSON.stringify(next));
      }
      return next;
    });
    setLatestPlacedOrder(newOrder);
  };

  const handleCancelOrder = (id: string) => {
    setOrders(prev => {
      const next = prev.map(o => o.id === id ? { ...o, status: 'Cancelled' } : o);
      if (currentUser?.email) {
        const emailKey = currentUser.email.toLowerCase().trim();
        localStorage.setItem(`cockroach_orders_${emailKey}`, JSON.stringify(next));
      }
      return next;
    });
  };

  const handleReorder = (pastOrder: Order) => {
    // Re-pack past order elements straight inside active cart
    pastOrder.items.forEach(item => {
      handleAddToCart(item.product, item.selectedSize, item.selectedColor, item.quantity);
    });
    setCurrentScreen('cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Authentication controllers
  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);
    localStorage.setItem('cockroach_current_user', JSON.stringify(user));
    if (cart.length > 0) {
      setCurrentScreen('address');
    } else {
      setCurrentScreen('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('cockroach_current_user');
    setWishlist([]);
    setAddresses([]);
    setOrders([]);
    setCart([]);
    setCurrentScreen('home');
  };

  // Redirection guard: if a guest tries to view dashboard or checkout, guide them to authenticate
  useEffect(() => {
    if (!currentUser && (currentScreen === 'address' || currentScreen === 'payment' || currentScreen === 'dashboard')) {
      setCurrentScreen('auth');
    }
  }, [currentUser, currentScreen]);

  return (
    <div className="flex min-h-screen flex-col bg-[#0D0D0D] font-sans antialiased text-white selection:bg-amber-500 selection:text-black">
      
      {/* Dynamic Unified Sticky Header */}
      <Header
        currentScreen={currentScreen}
        setScreen={setCurrentScreen}
        cart={cart}
        wishlist={wishlist}
        onSearch={setSearchFilter}
        currentUser={currentUser}
        setStaticTab={setCurrentStaticTab}
        products={products}
        setSelectedProduct={handleSetSelectedProductInDetail}
      />

      {/* Main viewport frame */}
      <main className="flex-grow">
        {currentScreen === 'home' && (
          <Homepage
            products={products}
            setScreen={setCurrentScreen}
            setSelectedProduct={handleSetSelectedProductInDetail}
            onWishlistToggle={handleWishlistToggle}
            wishlist={wishlist}
            onAddToCart={handleAddToCart}
          />
        )}

        {currentScreen === 'shop' && (
          <ShopPage
            products={products}
            setScreen={setCurrentScreen}
            setSelectedProduct={handleSetSelectedProductInDetail}
            onWishlistToggle={handleWishlistToggle}
            wishlist={wishlist}
            onAddToCart={handleAddToCart}
            searchFilter={searchFilter}
          />
        )}

        {currentScreen === 'detail' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            products={products}
            setScreen={setCurrentScreen}
            setSelectedProduct={handleSetSelectedProductInDetail}
            onAddToCart={handleAddToCart}
            onWishlistToggle={handleWishlistToggle}
            wishlist={wishlist}
          />
        )}

        {currentScreen === 'cart' && (
          <CartPage
            cart={cart}
            setScreen={setCurrentScreen}
            updateCartQty={updateCartQty}
            removeCartItem={removeCartItem}
            clearCart={clearCart}
            couponApplied={couponApplied}
            setCouponApplied={setCouponApplied}
          />
        )}

        {/* Address and payment screens mapped on the Unified Checkout Flow */}
        {(currentScreen === 'address' || currentScreen === 'payment' || currentScreen === 'confirmation') && (
          <CheckoutFlow
            currentStep={
              currentScreen === 'address' ? 'address' : 
              currentScreen === 'payment' ? 'payment' : 
              'confirmation'
            }
            setScreen={setCurrentScreen}
            cart={cart}
            clearCart={clearCart}
            addresses={addresses}
            onAddAddress={handleAddAddress}
            couponApplied={couponApplied}
            onOrderPlaced={handleOrderPlaced}
            latestPlacedOrder={latestPlacedOrder}
          />
        )}

        {currentScreen === 'dashboard' && (
          <DashboardPage
            setScreen={setCurrentScreen}
            orders={orders}
            onCancelOrder={handleCancelOrder}
            onReorder={handleReorder}
            currentUser={currentUser}
            onUpdateUser={setCurrentUser}
            addresses={addresses}
            onRemoveAddress={handleRemoveAddress}
            wishlist={wishlist}
            products={products}
            onWishlistToggle={handleWishlistToggle}
            onLogout={handleLogout}
          />
        )}

        {currentScreen === 'auth' && (
          <AuthPage
            setScreen={setCurrentScreen}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {currentScreen === 'static' && (
          <StaticPages
            currentTab={currentStaticTab}
            setTab={setCurrentStaticTab}
          />
        )}

        {currentScreen === 'admin' && (
          <AdminDashboardPage
            products={products}
            setProducts={setProducts}
            setScreen={setCurrentScreen}
          />
        )}
      </main>

      {/* Dynamic Unified Footer */}
      <Footer 
        setScreen={setCurrentScreen} 
        setStaticTab={setCurrentStaticTab} 
      />
      
    </div>
  );
}
