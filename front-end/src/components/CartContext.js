import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  useEffect(() => {
    console.log("🛒 cartItems updated:", cartItems);
  }, [cartItems]);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = JSON.parse(localStorage.getItem("token"));

    if (user && token) {
      fetch(`http://localhost:5000/cart/${user._id}`, {
        headers: { authorization: `bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
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
  }, []);

  const addToCart = (newItem) => {
    setCartItems(prev => {
      const exists = prev.find(item => item.productId === newItem.productId);
      if (exists) {
        return prev.map(item =>
          item.productId === newItem.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...newItem, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.productId !== id));
  };

  const updateCartItems = (newItems) => {
    setCartItems(newItems);
  };

  const cartCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  }, [cartItems]);

  const contextValue = useMemo(() => ({
    cartItems,
    setCartItems: updateCartItems,
    addToCart,
    removeFromCart,
    cartCount,
  }), [cartItems, cartCount]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
