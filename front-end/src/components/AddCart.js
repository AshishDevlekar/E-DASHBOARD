import React, { useEffect } from 'react';
import "../App.css";
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom'; 

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Cart = () => {
  const { cartItems, setCartItems } = useCart();
  const navigate = useNavigate(); 

  useEffect(() => {
    getCartItems();
  }, []);

  const getCartItems = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token"); // <-- FIX: no JSON.parse here

    const response = await fetch(`${API_BASE}/cart/${user._id}`, {
      headers: {
        authorization: `bearer ${token}`
      }
    });

    const result = await response.json();
    if (Array.isArray(result)) {
      const patched = result.map(item => ({
        ...item,
        quantity: item.quantity || 1 
      }));
      setCartItems(patched);  
    } else {
      console.error("Cart fetch failed", result);
      setCartItems([]);
    }
  };

  const removeFromCart = async (productId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token"); // <-- FIX: no JSON.parse here

    const response = await fetch(`${API_BASE}/cart/${user._id}/${productId}`, {
      method: "DELETE",
      headers: {
        authorization: `bearer ${token}`
      }
    });

    const result = await response.json();
    if (response.ok) {
      alert("Item removed from cart ❌");
      getCartItems();
    } else {
      console.error("Remove failed:", result);
    }
  };

  const handleProceedToPay = () => {
    alert("Proceeding to payment...");
    navigate('/payment'); 
  };

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>S. No</th>
                <th>Product Name</th>
                <th>Price (₹)</th>
                <th>Quantity</th>
                <th>Total (₹)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price * item.quantity}</td>
                  <td>
                    <button onClick={() => removeFromCart(item.productId)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="proceed-btn-container">
            <button className="proceed-btn" onClick={handleProceedToPay}>
              Proceed to Pay
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
