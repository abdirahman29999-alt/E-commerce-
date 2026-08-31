import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem, Product, DeliveryZone, Promotion } from '../types';
import { api } from '../services/api';

interface CartContextType {
  cart: CartItem[];
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  appliedPromo: Promotion | null;
  selectedZone: DeliveryZone | null;
  deliveryFee: number;
  total: number;
  isCartDrawerOpen: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  setSelectedZone: (zone: DeliveryZone | null) => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'djiaccess_cart_items_v1';
const PROMO_STORAGE_KEY = 'djiaccess_cart_promo_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [appliedPromo, setAppliedPromo] = useState<Promotion | null>(() => {
    try {
      const stored = localStorage.getItem(PROMO_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to store cart', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      if (appliedPromo) {
        localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(appliedPromo));
      } else {
        localStorage.removeItem(PROMO_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to store promo', e);
    }
  }, [appliedPromo]);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Calculate discount
  let discountAmount = 0;
  if (appliedPromo && subtotal >= appliedPromo.minOrderAmount) {
    if (appliedPromo.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * appliedPromo.discountValue) / 100);
    } else {
      discountAmount = appliedPromo.discountValue;
    }
  }

  const deliveryFee = selectedZone ? selectedZone.price : 800; // Default 800 FDJ for Djibouti-ville
  const total = Math.max(0, subtotal - discountAmount + deliveryFee);

  const addToCart = (product: Product, quantity = 1) => {
    if (product.stock <= 0) return;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = Math.min(product.stock, updated[existingIndex].quantity + quantity);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty
        };
        return updated;
      } else {
        return [...prev, { product, quantity: Math.min(product.stock, quantity) }];
      }
    });
    setIsCartDrawerOpen(true);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const maxStock = item.product.stock;
          return {
            ...item,
            quantity: Math.min(quantity, maxStock)
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api.validateCoupon(code, subtotal);
      if (res.valid) {
        setAppliedPromo(res.promo);
        return {
          success: true,
          message: `Code "${res.promo.code}" appliqué (-${res.discountAmount.toLocaleString('fr-FR')} FDJ) !`
        };
      }
      return { success: false, message: 'Code promo invalide.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Impossible d\'appliquer ce code.' };
    }
  };

  const removeCoupon = () => {
    setAppliedPromo(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        subtotal,
        discountAmount,
        appliedPromo,
        selectedZone,
        deliveryFee,
        total,
        isCartDrawerOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        openCartDrawer: () => setIsCartDrawerOpen(true),
        closeCartDrawer: () => setIsCartDrawerOpen(false),
        setSelectedZone,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
