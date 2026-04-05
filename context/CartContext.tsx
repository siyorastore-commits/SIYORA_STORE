"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CartItem, CustomSize, Product } from "@/types";

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product, size: string, colorIdx: number, customSize?: CustomSize) => void;
  removeFromCart: (cartId: string) => void;
  updateQty: (cartId: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  const addToCart = useCallback((product: Product, size: string, colorIdx: number, customSize?: CustomSize) => {
    setCartItems((prev) => {
      // Custom sizes are always unique — never merge them
      if (!customSize) {
        const existing = prev.find(
          (i) => i.id === product.id && i.selectedSize === size && i.selectedColor === colorIdx && !i.customSize
        );
        if (existing) {
          return prev.map((i) =>
            i.cartId === existing.cartId ? { ...i, qty: i.qty + 1 } : i
          );
        }
      }
      return [
        ...prev,
        {
          ...product,
          qty: 1,
          selectedSize: size || "M",
          selectedColor: colorIdx || 0,
          cartId: `${product.id}-${size}-${colorIdx}-${Date.now()}`,
          ...(customSize ? { customSize } : {}),
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((cartId: string) => {
    setCartItems((prev) => prev.filter((i) => i.cartId !== cartId));
  }, []);

  const updateQty = useCallback((cartId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((i) => (i.cartId === cartId ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        isCartOpen,
        setCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
