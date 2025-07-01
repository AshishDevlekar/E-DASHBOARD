import React from 'react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

const AddToCart = ({ product }) => {
  const { setCartItems } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = JSON.parse(localStorage.getItem("token"));

    if (!user || !token) {
      alert("Please log in to add to cart.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `bearer ${token}`
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
        const cartRes = await fetch(`${API_URL}/cart/${user._id}`, {
          headers: { authorization: `bearer ${token}` }
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
    }
  };

  return (
    <button onClick={handleAddToCart}>Add to Cart</button>
  );
};

export default AddToCart;
