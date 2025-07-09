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
  const [isProcessing, setIsProcessing] = useState(false);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const handlePayment = async () => {
    if (isProcessing) return;

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

    setIsProcessing(true);

    try {
      const response = await fetch(`${API_BASE}/purchase`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user._id,
          items: cartItems,
          total: totalAmount
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to complete purchase: ${errorText}`);
      }

      // Clear local cart state
      await clearCart();

      alert("💳 Payment Successful!");
      setTimeout(() => {
        navigate('/profile');
      }, 500);
    } catch (err) {
      console.error("❌ Payment error:", err);
      alert(`❌ Payment failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
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
          disabled={isProcessing}
        />

        <label>Card Number</label>
        <input
          type="text"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          placeholder="1234 5678 9012 3456"
          maxLength={16}
          disabled={isProcessing}
        />

        <label>CVV</label>
        <input
          type="password"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          placeholder="123"
          maxLength={3}
          disabled={isProcessing}
        />

        <button
          className="pay-button"
          onClick={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
};

export default Payment;
