import React, { useState } from 'react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';

const AddToCart = ({ product }) => {
  const { setCartItems } = useCart();
  const navigate = useNavigate();
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
      alert("Please log in to add to cart.");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`  // note capital A
        },
        body: JSON.stringify({
          productId: product._id,
          userId: user._id,
          name: product.name,
          price: product.price,
          quantity: 1
        })
      });

      if (response.ok) {
        const cartRes = await fetch(`${API_BASE}/cart/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const updatedCart = await cartRes.json();

        const patched = Array.isArray(updatedCart)
          ? updatedCart.map(item => ({
              ...item,
              quantity: item.quantity || 1
            }))
          : [];

        setCartItems(patched);

        alert(`${product.name} added to cart ✅`);
      } else {
        alert("Failed to add to cart ❌");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      alert("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleAddToCart} disabled={loading}>
      {loading ? "Adding..." : "Add to Cart"}
    </button>
  );
};

export default AddToCart;
