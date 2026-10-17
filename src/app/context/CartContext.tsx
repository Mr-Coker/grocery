"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Product } from "../components/grocery/ProductCard";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  deleteItem: (productId: string) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  totalItems: number;
  subtotal: number;
  savings: number;
  deliveryFee: number;
  total: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "freshmart_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // 1. Load cart from localStorage on initial client mount
  useEffect(() => {
    try {
      const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsed = JSON.parse(savedCart) as CartItem[];
        if (Array.isArray(parsed)) {
          // Wrap in queueMicrotask or functional updater to satisfy the linter
          // and prevent synchronous cascading renders during the initial effect pass
          queueMicrotask(() => {
            setItems(parsed);
          });
        }
      }
    } catch (e) {
      console.error("Failed to load cart from storage", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);


  // 2. Persist cart to localStorage whenever items change
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.error("Failed to save cart to storage", e);
      }
    }
  }, [items, isInitialized]);

  // Add 1 item or increment existing
  const addItem = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product._id === product._id);
      if (existing) {
        return prev.map((i) =>
          i.product._id === product._id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  // Decrement 1 item or remove if 0
  const removeItem = (productId: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product._id === productId);
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        return prev.filter((i) => i.product._id !== productId);
      }
      return prev.map((i) =>
        i.product._id === productId
          ? { ...i, quantity: i.quantity - 1 }
          : i
      );
    });
  };

  // Remove completely
  const deleteItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product._id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemQuantity = (productId: string) => {
    const item = items.find((i) => i.product._id === productId);
    return item ? item.quantity : 0;
  };

  // Calculated totals
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const originalTotal = items.reduce((sum, item) => {
    const orig = item.product.originalPrice ?? item.product.price;
    return sum + orig * item.quantity;
  }, 0);

  const savings = Math.max(0, originalTotal - subtotal);

  // Free delivery over $30, otherwise $2.99
  const deliveryFee = subtotal > 30 || subtotal === 0 ? 0 : 2.99;

  const total = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        deleteItem,
        clearCart,
        getItemQuantity,
        totalItems,
        subtotal,
        savings,
        deliveryFee,
        total,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to consume the cart
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
