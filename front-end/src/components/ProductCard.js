import React from 'react';
import '../App.css';

const ProductCard = ({ product, onAddToCart, onDelete }) => {
  const handleAddToCart = () => {
    if (!product.inStock) {
      alert("❌ This product is currently out of stock.");
      return;
    }
    onAddToCart(product);
  };

  // ✅ Check if user is admin
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user && user.role === "admin";

  return (
    <div className="product-card">
      <img
        src={product.image || "https://via.placeholder.com/200"}
        alt={product.name}
      />
      <h3>{product.name}</h3>
      <p><strong>₹{product.price}</strong></p>
      <p>{product.company}</p>
      <p>Category: {product.category}</p>
      {product.rating && <p>⭐ {product.rating}/5</p>}
      <p className="desc">{product.description || 'No description available.'}</p>
      <p style={{ color: product.inStock ? 'green' : 'red' }}>
        {product.inStock ? "✅ In Stock" : "❌ Out of Stock"}
      </p>
      <div className="card-actions">
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          Add to Cart
        </button>

        {/* ✅ Show delete button only for admin */}
        {isAdmin && (
          <button onClick={onDelete} className="delete-btn">
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
