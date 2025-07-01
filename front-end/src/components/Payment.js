import React, { useState } from 'react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';
import '../App.css'; 

const Payment = () => {
  const { cartItems, setCartItems } = useCart();
  const navigate = useNavigate();

  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
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

  const user = JSON.parse(localStorage.getItem("user"));
  const token = JSON.parse(localStorage.getItem("token"));

  try {
    const res = await fetch(`http://localhost:5000/cart/clear/${user._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res.ok) {
      alert("💳 Payment Successful!");
      setCartItems([]);
      navigate('/profile');
    } else {
      alert("❌ Failed to clear cart on server.");
    }
  } catch (err) {
    console.error("❌ Payment error:", err);
    alert("❌ Payment failed. Please try again.");
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
