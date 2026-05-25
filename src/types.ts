export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  category: string;
  sizes: string[];
  colors: { name: string; value: string }[];
  images: string[];
  tag?: 'Best Seller' | 'New Arrival' | 'Limited Edition' | '20% OFF' | 'Nuclear Proof';
  description: string;
  specs: string[];
  material: string;
  fit: string;
  care: string;
}

export interface CartItem {
  id: string; // Unique combination of product.id + size + color
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface SavedAddress {
  id: string;
  name: string;
  phone: string;
  houseNo: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  type: 'Home' | 'Work' | 'Other';
  isDefault: boolean;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryCharges: number;
  totalAmount: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  address: SavedAddress;
  paymentMethod: string;
  estimatedDelivery: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
}

export type ScreenType =
  | 'home'
  | 'shop'
  | 'detail'
  | 'cart'
  | 'address'
  | 'payment'
  | 'confirmation'
  | 'dashboard'
  | 'auth'
  | 'static'
  | 'admin';

export type StaticPageType = 'about' | 'contact' | 'faq' | 'size-guide' | 'returns';

export interface FilterState {
  searchQuery: string;
  categories: string[];
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
  minRating: number | null;
  sortBy: 'low-to-high' | 'high-to-low' | 'newest' | 'popularity';
}
