"use client";

import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
  // Lazy initialization from localStorage
  const [cart, setCart] = useState(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("chefkit_cart");
      if (savedCart) {
        try {
          return JSON.parse(savedCart);
        } catch (error) {
          console.error("Error loading cart:", error);
          return [];
        }
      }
    }
    return [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("chefkit_cart", JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (mealKit, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === mealKit.id);
      
      if (existingItem) {
        toast.success(`Updated ${mealKit.title} quantity in cart!`);
        return prevCart.map((item) =>
          item.id === mealKit.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        toast.success(`Added ${mealKit.title} to cart!`);
        return [...prevCart, { ...mealKit, quantity }];
      }
    });
  };

  const removeFromCart = (mealKitId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== mealKitId));
    toast.success("Item removed from cart");
  };

  const updateQuantity = (mealKitId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(mealKitId);
      return;
    }
    
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === mealKitId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    toast.success("Cart cleared");
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
