import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentMethod = () => {
  const navigate = useNavigate();

  const chooseMethod = (method) => {
    navigate(`/payment/${method}`);
  };

  return (
    <div className="payment-options">
      <h2>Select Payment Method</h2>
      <button onClick={() => chooseMethod('card')}>💳 Card Payment</button>
      <button onClick={() => chooseMethod('gpay')}>📱 GPay / UPI</button>
    </div>
  );
};

export default PaymentMethod;
