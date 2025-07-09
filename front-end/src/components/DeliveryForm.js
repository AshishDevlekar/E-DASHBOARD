import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DeliveryForm = () => {
  const [form, setForm] = useState({ name: '', mobile: '', address: '', pincode: '', city: '', state: '' });
  const navigate = useNavigate();

  const handleSubmit = () => {
    localStorage.setItem('deliveryDetails', JSON.stringify(form));
    navigate('/payment-method');
  };

  return (
    <div className="form-page">
      <h2>Delivery Address</h2>
      {Object.keys(form).map(field => (
        <input
          key={field}
          type="text"
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={form[field]}
          onChange={e => setForm({ ...form, [field]: e.target.value })}
        />
      ))}
      <button onClick={handleSubmit}>Continue to Payment</button>
    </div>
  );
};

export default DeliveryForm;
