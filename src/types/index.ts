export type Category =
  | 'Ice Cream'
  | 'Fruit Milk Tea'
  | 'Fresh Fruit Tea'
  | 'Milkshakes'
  | 'Smoothies'
  | 'Ice Cream & Sundaes'
  | 'Snacks & Extras';

export type SweetnessLevel = '0%' | '25%' | '50%' | '75%' | '100%';
export type IceLevel = 'No Ice' | 'Less Ice' | 'Regular Ice' | 'Extra Ice';

export interface Topping {
  id: string;
  name: string;
  price: number;
}

export interface SizeOption {
  name: 'Regular (500ml)' | 'Large (700ml)';
  priceDelta: number;
}

export interface Product {
  id: string;
  name: string;
  chineseName?: string;
  category: Category;
  description: string;
  basePrice: number;
  image: string;
  tag?: string;
  isVerified?: boolean;
  verifiedSource?: string;
  demoLabel?: string;
  available: boolean;
  featured?: boolean;
  hasDrinkOptions: boolean; // if true, allows sweetness and ice
  availableSizes?: SizeOption[];
  availableToppings?: Topping[];
  productType?: 'Cone' | 'Cup' | 'Drink' | 'Other';
  prepareOnArrival?: boolean;
  customDessertOptions?: {
    flavors?: string[];
    servingTypes?: string[];
  };
}

export interface Branch {
  id: string;
  name: string;
  area: string;
  address: string;
  mallUnit?: string;
  hours: string;
  isVerified: boolean;
  status: 'Open' | 'Demo' | 'Coming Soon';
  estimatedPrepMins: string;
  phone: string;
  googleMapsUrl?: string;
}

export interface CartItemCustomization {
  size?: 'Regular (500ml)' | 'Large (700ml)';
  sweetness?: SweetnessLevel;
  ice?: IceLevel;
  toppings: Topping[];
  flavor?: string;
  servingType?: string;
  productType?: 'Cone' | 'Cup';
  notes?: string;
}

export interface CartItem {
  id: string; // unique cart line id
  productId: string;
  product: Product;
  customization: CartItemCustomization;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type OrderStatus = 'received' | 'confirmed' | 'preparing' | 'ready' | 'collected' | 'cancelled';
export type IceCreamPrepStatus = 'awaiting_arrival' | 'preparing' | 'ready' | 'collected';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  category: Category;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customization: CartItemCustomization;
  isIceCream?: boolean;
  iceCreamProductType?: 'Cone' | 'Cup';
  iceCreamFlavor?: string;
  iceCreamPrepStatus?: IceCreamPrepStatus;
  prepareOnArrival?: boolean;
}

export interface Order {
  id: string; // e.g. BC-8492
  createdAt: string;
  customerName: string;
  customerPhone: string;
  branchId: string;
  branchName: string;
  branchAddress: string;
  items: OrderItem[];
  subtotal: number;
  serviceCharge: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'Card (Demo)' | 'Bank Transfer (Demo)' | 'Pay at Store (Demo)';
  paymentStatus: 'Paid' | 'Pay on Pickup';
  estimatedPickupTime: string;
  pickupCode: string;
  timeline: {
    receivedAt: string;
    confirmedAt?: string;
    preparingAt?: string;
    readyAt?: string;
    collectedAt?: string;
    cancelledAt?: string;
  };
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  phone: string; // normalised: last 10 digits
}
