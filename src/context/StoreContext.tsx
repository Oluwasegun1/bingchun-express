'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Product, 
  Branch, 
  CartItem, 
  CartItemCustomization, 
  Order, 
  OrderStatus,
  IceCreamPrepStatus,
  User
} from '@/types';
import { INITIAL_PRODUCTS } from '@/data/menu';
import { INITIAL_BRANCHES } from '@/data/branches';
import { INITIAL_ORDERS } from '@/data/orders';
import { generateOrderId, generatePickupCode } from '@/lib/utils';

interface StoreContextType {
  // Branches
  branches: Branch[];
  selectedBranch: Branch;
  setSelectedBranch: (branch: Branch) => void;
  isBranchModalOpen: boolean;
  setIsBranchModalOpen: (open: boolean) => void;

  // Products
  products: Product[];
  selectedProduct: Product | null;
  setSelectedProduct: (prod: Product | null) => void;
  updateProduct: (updated: Product) => void;
  addProduct: (newProd: Product) => void;
  toggleProductAvailability: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, customization: CartItemCustomization, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartItemQty: (cartItemId: string, delta: number) => void;
  updateCartItem: (cartItemId: string, customization: CartItemCustomization, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Orders
  orders: Order[];
  createOrder: (orderParams: {
    customerName: string;
    customerPhone: string;
    paymentMethod: 'Card (Demo)' | 'Bank Transfer (Demo)' | 'Pay at Store (Demo)';
    notes?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateIceCreamStatus: (orderId: string, itemIdx: number, status: IceCreamPrepStatus) => void;
  cancelOrder: (orderId: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
  resetDemoData: () => void;

  // Simulated authentication (demo only)
  hydrated: boolean;
  user: User | null;
  signIn: (phone: string, name?: string) => User;
  signOut: () => void;

  // Favourites
  favourites: string[];
  toggleFavourite: (productId: string) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Toast / feedback message
  notification: string | null;
  showNotification: (msg: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEY_PRODUCTS = 'bc_products_v4';
const STORAGE_KEY_ORDERS = 'bc_orders_v3';
const STORAGE_KEY_CART = 'bc_cart_v2';
const STORAGE_KEY_BRANCH = 'bc_selected_branch_v2';
const STORAGE_KEY_USER = 'bc_user_v2';
const STORAGE_KEY_FAVS = 'bc_favs_v2';

/** Normalise a Nigerian phone number to its last 10 digits. */
export function normalisePhone(raw: string): string {
  return raw.replace(/\D/g, '').slice(-10);
}

function priceFor(product: Product, c: CartItemCustomization): number {
  let unit = product.basePrice;
  if (c.size === 'Large (700ml)') unit += 600;
  if (c.toppings?.length) unit += c.toppings.reduce((a, t) => a + t.price, 0);
  return unit;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [branches] = useState<Branch[]>(INITIAL_BRANCHES);
  const [selectedBranch, setSelectedBranchState] = useState<Branch>(INITIAL_BRANCHES[0]);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [notification, setNotification] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [favourites, setFavourites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  // Hydrate from localStorage on client mount
  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (storedProducts) {
        const parsed: Product[] = JSON.parse(storedProducts);
        // Ensure new catalog items (e.g. Cone and Cup Ice Cream) are merged in
        const missing = INITIAL_PRODUCTS.filter((initP) => !parsed.some((p) => p.id === initP.id));
        if (missing.length > 0) {
          setProducts([...missing, ...parsed]);
        } else {
          setProducts(parsed);
        }
      }

      const storedOrders = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (storedOrders) {
        const parsedOrders: Order[] = JSON.parse(storedOrders);
        const missingOrders = INITIAL_ORDERS.filter((initO) => !parsedOrders.some((o) => o.id === initO.id));
        if (missingOrders.length > 0) {
          setOrders([...parsedOrders, ...missingOrders]);
        } else {
          setOrders(parsedOrders);
        }
      }

      const storedCart = localStorage.getItem(STORAGE_KEY_CART);
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }

      const storedUser = localStorage.getItem(STORAGE_KEY_USER);
      if (storedUser) setUser(JSON.parse(storedUser));

      const storedFavs = localStorage.getItem(STORAGE_KEY_FAVS);
      if (storedFavs) setFavourites(JSON.parse(storedFavs));

      const storedBranchId = localStorage.getItem(STORAGE_KEY_BRANCH);
      if (storedBranchId) {
        const found = INITIAL_BRANCHES.find(b => b.id === storedBranchId);
        if (found) setSelectedBranchState(found);
      }
    } catch (e) {
      console.warn('Failed to hydrate state from localStorage', e);
    }
    setHydrated(true);
  }, []);

  // Sync products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [products]);

  // Sync orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [orders]);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [cart]);

  // Keep demo state in sync across browser tabs (e.g. staff dashboard in one tab, customer tracking in another).
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (!e.newValue) return;
      try {
        if (e.key === STORAGE_KEY_ORDERS) setOrders(JSON.parse(e.newValue));
        if (e.key === STORAGE_KEY_PRODUCTS) setProducts(JSON.parse(e.newValue));
      } catch {}
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FAVS, JSON.stringify(favourites));
    } catch {}
  }, [favourites]);

  const signIn = (phone: string, name?: string): User => {
    const normalised = normalisePhone(phone);
    const existing = orders.find((o) => normalisePhone(o.customerPhone) === normalised);
    const next: User = {
      id: `u-${normalised}`,
      name: (name && name.trim()) || existing?.customerName || 'Bing Chun Guest',
      phone: normalised,
    };
    setUser(next);
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(next));
    } catch {}
    showNotification(`Signed in as ${next.name}`);
    return next;
  };

  const signOut = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY_USER);
    } catch {}
    showNotification('You have been signed out');
  };

  const toggleFavourite = (productId: string) => {
    setFavourites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const setSelectedBranch = (b: Branch) => {
    setSelectedBranchState(b);
    try {
      localStorage.setItem(STORAGE_KEY_BRANCH, b.id);
    } catch {}
    showNotification(`Pickup branch set to: ${b.name}`);
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showNotification(`Updated "${updated.name}"`);
  };

  const addProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
    showNotification(`Added new demo product "${newProd.name}"`);
  };

  const toggleProductAvailability = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const next = !p.available;
          showNotification(`"${p.name}" marked ${next ? 'In Stock' : 'Out of Stock'}`);
          return { ...p, available: next };
        }
        return p;
      })
    );
  };

  // Cart operations
  const addToCart = (product: Product, customization: CartItemCustomization, quantity = 1) => {
    const unitPrice = priceFor(product, customization);

    const lineId = `${product.id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newItem: CartItem = {
      id: lineId,
      productId: product.id,
      product,
      customization,
      quantity,
      unitPrice,
      totalPrice: unitPrice * quantity,
    };

    setCart((prev) => [...prev, newItem]);
    showNotification(`${quantity}× ${product.name} added to your bag`);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateCartItemQty = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              totalPrice: item.unitPrice * newQty,
            };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const updateCartItem = (cartItemId: string, customization: CartItemCustomization, quantity: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id !== cartItemId) return item;
        const unitPrice = priceFor(item.product, customization);
        return { ...item, customization, quantity, unitPrice, totalPrice: unitPrice * quantity };
      })
    );
    showNotification('Drink updated');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Orders operations
  const createOrder = ({
    customerName,
    customerPhone,
    paymentMethod,
    notes,
  }: {
    customerName: string;
    customerPhone: string;
    paymentMethod: 'Card (Demo)' | 'Bank Transfer (Demo)' | 'Pay at Store (Demo)';
    notes?: string;
  }): Order => {
    const orderId = generateOrderId();
    const pickupCode = generatePickupCode();
    const now = new Date().toISOString();

    const orderItems = cart.map((c) => {
      const isIceCream = c.product.category === 'Ice Cream' || c.product.prepareOnArrival || c.product.name.toLowerCase().includes('ice cream');
      const iceCreamProductType = (c.customization.productType || (c.product.name.toLowerCase().includes('cone') ? 'Cone' : 'Cup')) as 'Cone' | 'Cup';
      const iceCreamFlavor = c.customization.flavor || 'Vanilla';

      return {
        productId: c.productId,
        productName: c.product.name,
        productImage: c.product.image,
        category: c.product.category,
        quantity: c.quantity,
        unitPrice: c.unitPrice,
        totalPrice: c.totalPrice,
        customization: c.customization,
        isIceCream,
        prepareOnArrival: isIceCream,
        iceCreamProductType: isIceCream ? iceCreamProductType : undefined,
        iceCreamFlavor: isIceCream ? iceCreamFlavor : undefined,
        iceCreamPrepStatus: isIceCream ? ('awaiting_arrival' as IceCreamPrepStatus) : undefined,
      };
    });

    const newOrder: Order = {
      id: orderId,
      createdAt: now,
      customerName,
      customerPhone,
      branchId: selectedBranch.id,
      branchName: selectedBranch.name,
      branchAddress: selectedBranch.address,
      items: orderItems,
      subtotal: cartTotal,
      serviceCharge: 0,
      total: cartTotal,
      status: 'received',
      paymentMethod,
      paymentStatus: paymentMethod === 'Pay at Store (Demo)' ? 'Pay on Pickup' : 'Paid',
      estimatedPickupTime: selectedBranch.estimatedPrepMins,
      pickupCode,
      timeline: {
        receivedAt: now,
      },
      notes,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    showNotification(`Order ${orderId} placed (demo)`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const now = new Date().toISOString();
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updatedTimeline = { ...order.timeline };
          if (status === 'confirmed') updatedTimeline.confirmedAt = now;
          if (status === 'preparing') updatedTimeline.preparingAt = now;
          if (status === 'ready') updatedTimeline.readyAt = now;
          if (status === 'collected') updatedTimeline.collectedAt = now;
          if (status === 'cancelled') updatedTimeline.cancelledAt = now;

          // If entire order is marked collected, also mark any ice cream items as collected
          const updatedItems = status === 'collected'
            ? order.items.map((it) => (it.isIceCream ? { ...it, iceCreamPrepStatus: 'collected' as IceCreamPrepStatus } : it))
            : order.items;

          return {
            ...order,
            status,
            timeline: updatedTimeline,
            items: updatedItems,
          };
        }
        return order;
      })
    );
    showNotification(`Order ${orderId} updated to: ${status.toUpperCase()}`);
  };

  const updateIceCreamStatus = (orderId: string, itemIdx: number, status: IceCreamPrepStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const nextItems = order.items.map((it, idx) => {
            if (idx === itemIdx) {
              return {
                ...it,
                iceCreamPrepStatus: status,
              };
            }
            return it;
          });

          // Check if all ice cream items are collected and order was ready
          const allIceCreamCollected = nextItems
            .filter((it) => it.isIceCream)
            .every((it) => it.iceCreamPrepStatus === 'collected');

          let nextStatus = order.status;
          if (allIceCreamCollected && order.status === 'ready' && status === 'collected') {
            nextStatus = 'collected';
          }

          return {
            ...order,
            items: nextItems,
            status: nextStatus,
          };
        }
        return order;
      })
    );

    const labels: Record<IceCreamPrepStatus, string> = {
      awaiting_arrival: 'Awaiting Arrival',
      preparing: 'Preparing / Scooping',
      ready: 'Scooped & Ready',
      collected: 'Collected',
    };
    showNotification(`Order ${orderId} ice cream updated to: ${labels[status]}`);
  };

  const cancelOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'cancelled');
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find((o) => o.id.toLowerCase() === orderId.toLowerCase());
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY_PRODUCTS);
    localStorage.removeItem(STORAGE_KEY_ORDERS);
    localStorage.removeItem(STORAGE_KEY_CART);
    localStorage.removeItem(STORAGE_KEY_BRANCH);
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setCart([]);
    setSelectedBranchState(INITIAL_BRANCHES[0]);
    showNotification('Demo data reset to verified default catalog & sample queue.');
  };

  return (
    <StoreContext.Provider
      value={{
        branches,
        selectedBranch,
        setSelectedBranch,
        isBranchModalOpen,
        setIsBranchModalOpen,
        products,
        selectedProduct,
        setSelectedProduct,
        updateProduct,
        addProduct,
        toggleProductAvailability,
        cart,
        addToCart,
        removeFromCart,
        updateCartItemQty,
        updateCartItem,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        orders,
        createOrder,
        updateOrderStatus,
        updateIceCreamStatus,
        cancelOrder,
        getOrderById,
        resetDemoData,
        hydrated,
        user,
        signIn,
        signOut,
        favourites,
        toggleFavourite,
        searchQuery,
        setSearchQuery,
        notification,
        showNotification,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
