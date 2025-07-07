import React, { useState } from 'react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Payment = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const handlePayment = async () => {
    const cardRegex = /^\d{16}$/;
    const cvvRegex = /^\d{3}$/;
    const nameRegex = /^[A-Za-z\s]+$/;

    if (!name || !cardNumber || !cvv) {
      alert("⚠️ Please fill in all payment fields.");
      return;
    }

    if (!cardRegex.test(cardNumber)) {
      alert("⚠️ Card number must be exactly 16 digits.");
      return;
    }

    if (!cvvRegex.test(cvv)) {
      alert("⚠️ CVV must be exactly 3 digits.");
      return;
    }

    if (!nameRegex.test(name)) {
      alert("⚠️ Name should only contain letters and spaces.");
      return;
    }

    let user = null;
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        user = JSON.parse(storedUser);
      }
    } catch (err) {
      alert("❌ Invalid user data. Please log in again.");
      return;
    }

    const token = localStorage.getItem("token");
    const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    try {
      // Save each purchase
      for (const item of cartItems) {
        const response = await fetch(`${API_BASE}/purchase`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            userId: user._id,
            productId: item.productId || item._id,
            productName: item.name,
            price: item.price,
            quantity: item.quantity || 1,
          })
        });

        if (!response.ok) {
          throw new Error(`Failed to save purchase for ${item.name}`);
        }
      }

      // Clear backend cart with error handling
      const clearResponse = await fetch(`${API_BASE}/cart/clear/${user._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!clearResponse.ok) {
        throw new Error('Failed to clear cart on server');
      }

      console.log("✅ Backend cart cleared successfully");

      // Clear local cart state
      clearCart();
      
      // Wait for state to update before navigation
      await new Promise(resolve => setTimeout(resolve, 500));

      alert("💳 Payment Successful!");
      navigate('/profile');
    } catch (err) {
      console.error("❌ Payment error:", err);
      alert(`❌ Payment failed: ${err.message}`);
    }
  };  

  return (
    <div className="payment-page">
      <h2 style={{ textAlign: 'center' }}>Payment Details</h2>
      <p style={{ textAlign: 'center', fontWeight: 'bold' }}>
        Total Amount: ₹{totalAmount}
      </p>
      <form className="payment-form" onSubmit={(e) => e.preventDefault()}>
        <label>Name on Card</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
        />

        <label>Card Number</label>
        <input
          type="text"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          placeholder="1234 5678 9012 3456"
          maxLength={16}
        />

        <label>CVV</label>
        <input
          type="password"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          placeholder="123"
          maxLength={3}
        />

        <button className="pay-button" onClick={handlePayment}>
          Pay Now
        </button>
      </form>
    </div>
  );
};

export default Payment;