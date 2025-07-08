import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [skipInitialFetch, setSkipInitialFetch] = useState(false);
  const [isClearing, setIsClearing] = useState(false); // New state to track clearing
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    console.log("🛒 cartItems updated:", cartItems);
  }, [cartItems]);

  useEffect(() => {
    console.log("🔄 CartContext fetch effect triggered");
    console.log("Skip initial fetch:", skipInitialFetch);
    console.log("Is clearing:", isClearing);
    
    if (skipInitialFetch || isClearing) {
      console.log("⏸️ Skipping fetch due to skipInitialFetch flag or clearing state");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (user && token) {
      console.log("📡 Fetching cart for user:", user._id);
      fetch(`${API_BASE}/cart/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          console.log("📦 Received cart data:", data);
          if (Array.isArray(data)) {
            const patched = data.map(item => ({
              ...item,
              quantity: item.quantity || 1,
            }));
            setCartItems(patched);
          }
        })
        .catch(error => {
          console.error('Error fetching cart:', error);
        });
    }
  }, [API_BASE, skipInitialFetch, isClearing]);

  const addToCart = (newItem) => {
    setCartItems(prev => {
      const exists = prev.find(item => item.productId === newItem.productId);
      if (exists) {
        return prev.map(item =>
          item.productId === newItem.productId
            ? { ...item, quantity: item.quantity + (newItem.quantity || 1) }
            : item
        );
      } else {
        return [...prev, { ...newItem, quantity: newItem.quantity || 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.productId !== id));
  };

  const updateCartItems = (newItems) => {
    setCartItems(newItems);
  };

  // Updated clearCart function
  const clearCart = async () => {
    console.log("🧹 Clearing cart...");
    setIsClearing(true);
    setCartItems([]);

    // Optional: Add server verification
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    
    if (user && token) {
      try {
        // Verify cart is cleared on server
        const response = await fetch(`${API_BASE}/cart/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.ok) {
          const serverCart = await response.json();
          console.log("🔍 Server cart after clearing:", serverCart);
          
          // Only reset clearing state if server confirms empty cart
          if (!Array.isArray(serverCart) || serverCart.length === 0) {
            setIsClearing(false);
            console.log("✅ Cart cleared and verified on server");
          } else {
            console.warn("⚠️ Server still has cart items, retrying...");
            // Retry clearing or handle the inconsistency
            setTimeout(() => setIsClearing(false), 2000);
          }
        }
      } catch (error) {
        console.error("❌ Error verifying cart clearing:", error);
        // Fallback: reset after timeout
        setTimeout(() => setIsClearing(false), 2000);
      }
    } else {
      // No user/token, just reset the clearing state
      setTimeout(() => setIsClearing(false), 1000);
    }
  };

  const cartCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  }, [cartItems]);

  const contextValue = useMemo(() => ({
    cartItems,
    setCartItems: updateCartItems,
    addToCart,
    removeFromCart,
    clearCart,
    cartCount,
    isClearing, // Expose clearing state
  }), [cartItems, cartCount, isClearing]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;