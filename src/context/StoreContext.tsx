'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Product, 
  Branch, 
  CartItem, 
  CartItemCustomization, 
  Order, 
  OrderStatus 
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
  cancelOrder: (orderId: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
  resetDemoData: () => void;

  // Toast / feedback message
  notification: string | null;
  showNotification: (msg: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEY_PRODUCTS = 'bc_products_v1';
const STORAGE_KEY_ORDERS = 'bc_orders_v1';
const STORAGE_KEY_CART = 'bc_cart_v1';
const STORAGE_KEY_BRANCH = 'bc_selected_branch_v1';

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
        setProducts(JSON.parse(storedProducts));
      }

      const storedOrders = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      }

      const storedCart = localStorage.getItem(STORAGE_KEY_CART);
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }

      const storedBranchId = localStorage.getItem(STORAGE_KEY_BRANCH);
      if (storedBranchId) {
        const found = INITIAL_BRANCHES.find(b => b.id === storedBranchId);
        if (found) setSelectedBranchState(found);
      }
    } catch (e) {
      console.warn('Failed to hydrate state from localStorage', e);
    }
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
    let unitPrice = product.basePrice;
    if (customization.size === 'Large (700ml)') {
      unitPrice += 600;
    }
    if (customization.toppings && customization.toppings.length > 0) {
      const toppingsPrice = customization.toppings.reduce((acc, t) => acc + t.price, 0);
      unitPrice += toppingsPrice;
    }

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
    showNotification(`Added ${quantity}× ${product.name} to express cart!`);
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

    const orderItems = cart.map((c) => ({
      productId: c.productId,
      productName: c.product.name,
      productImage: c.product.image,
      category: c.product.category,
      quantity: c.quantity,
      unitPrice: c.unitPrice,
      totalPrice: c.totalPrice,
      customization: c.customization,
    }));

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
    showNotification(`Express order ${orderId} placed successfully!`);
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

          return {
            ...order,
            status,
            timeline: updatedTimeline,
          };
        }
        return order;
      })
    );
    showNotification(`Order ${orderId} updated to: ${status.toUpperCase()}`);
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
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        orders,
        createOrder,
        updateOrderStatus,
        cancelOrder,
        getOrderById,
        resetDemoData,
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
