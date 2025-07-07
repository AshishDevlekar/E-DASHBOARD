import React, { useEffect, useState } from 'react';
import "../App.css";
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Cart = () => {
  const { cartItems, setCartItems } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getCartItems();
  }, []);

  const getCartItems = async () => {
    setLoading(true);
    setError('');
    
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!user || !token) {
        setError("Please login to view cart");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE}/cart/${user._id}`, {
        headers: {
          authorization: `bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setError("Failed to load cart items");
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    if (!productId) {
      alert("Error: Product ID is missing");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!user || !token) {
        alert("Please login to remove items");
        return;
      }

      console.log('Removing item:', {
        productId,
        userId: user._id,
        url: `${API_BASE}/cart/${productId}/${user._id}`
      });

      const response = await fetch(`${API_BASE}/cart/${productId}/${user._id}`, {
        method: "DELETE",
        headers: {
          authorization: `bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Delete response:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete response error:', errorText);
        throw new Error(`Failed to remove item: ${response.status}`);
      }

      const result = await response.json();
      console.log('Delete result:', result);
      
      alert("Item removed from cart ❌");
      getCartItems(); // Refresh cart
    } catch (error) {
      console.error("Remove failed:", error);
      alert("Failed to remove item from cart. Please try again.");
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE}/cart/update`, {
        method: "PUT",
        headers: {
          authorization: `bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId,
          userId: user._id,
          quantity: newQuantity
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to update quantity: ${response.status}`);
      }

      const result = await response.json();
      console.log('Update result:', result);
      
      getCartItems(); // Refresh cart
    } catch (error) {
      console.error("Update quantity failed:", error);
      alert("Failed to update quantity. Please try again.");
    }
  };

  const handleProceedToPay = () => {
    if (cartItems.length === 0) {
      alert("Cart is empty!");
      return;
    }
    
    alert("Proceeding to payment...");
    navigate('/payment');
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (loading) {
    return (
      <div className="cart-page">
        <h2>Your Cart</h2>
        <p>Loading cart items...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-page">
        <h2>Your Cart</h2>
        <p className="error">{error}</p>
        <button onClick={getCartItems}>Retry</button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>No items in cart</p>
          <button onClick={() => navigate('/products')}>Continue Shopping</button>
        </div>
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
                  <td>
                    <div className="quantity-controls">
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>₹{item.price * item.quantity}</td>
                  <td>
                    <button 
                      className="remove-btn"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-summary">
            <h3>Cart Summary</h3>
            <div className="summary-row">
              <span>Total Items: {cartItems.length}</span>
            </div>
            <div className="summary-row">
              <span>Total Quantity: {cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <div className="summary-row total">
              <strong>Total Amount: ₹{calculateTotal()}</strong>
            </div>
          </div>

          <div className="cart-actions">
            <button 
              className="continue-shopping-btn" 
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </button>
            <button 
              className="proceed-btn" 
              onClick={handleProceedToPay}
            >
              Proceed to Pay (₹{calculateTotal()})
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;