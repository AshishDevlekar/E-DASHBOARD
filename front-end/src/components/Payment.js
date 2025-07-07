import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Payment = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();

  const handlePayment = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
      alert("❌ You must be logged in to make a payment.");
      return;
    }

    const purchases = cartItems.map(item => ({
      userId: user._id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      status: "in progress",
      createdAt: new Date()
    }));

    try {
      for (const purchase of purchases) {
        await fetch(`${API_BASE}/purchase`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(purchase)
        });
      }

      // ✅ Clear backend cart
      await fetch(`${API_BASE}/cart/clear/${user._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // ✅ Clear frontend cart state
      clearCart();

      alert("💳 Payment Successful!");
      navigate('/profile');
    } catch (err) {
      console.error("Payment error:", err);
      alert("❌ Payment failed. Please try again.");
    }
  };

  return (
    <div className="payment">
      <h2>Checkout</h2>
      <button onClick={handlePayment}>Confirm Payment</button>
    </div>
  );
};

export default Payment;
