import React from 'react';
import qr from '../assets/gpay-qr.png'; // Your UPI QR code image
import { useNavigate } from 'react-router-dom';

const GPayPayment = () => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    alert("✅ UPI Payment Confirmed");
    navigate('/profile');
  };

  return (
    <div className="gpay-page">
      <h2>Scan to Pay via GPay</h2>
      <img src={qr} alt="Scan QR to Pay" style={{ width: 200 }} />
      <p>Scan the QR using GPay or any UPI app</p>
      <button onClick={handleConfirm}>I've Paid</button>
    </div>
  );
};

export default GPayPayment;
