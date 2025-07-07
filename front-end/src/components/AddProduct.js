import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [company, setCompany] = useState('');
  const [image, setImage] = useState('');
  const [rating, setRating] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Use fallback if environment variable is missing
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const addProduct = async () => {
    if (!name || !price || !category || !company) {
      setError("⚠️ Please fill in all required fields (name, price, category, company).");
      return;
    }

    setError("");
    setLoading(true);

    const userId = JSON.parse(localStorage.getItem('user'))?._id;
    const token = localStorage.getItem("token"); // token is stored as string

    try {
      const response = await fetch(`${API_BASE}/add-product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `bearer ${token}`
        },
        body: JSON.stringify({
          name,
          price: Number(price), // Convert price to number
          category,
          company,
          image,
          rating: rating ? Number(rating) : undefined,
          description,
          userId
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Product added successfully!");
        navigate('/');
      } else {
        setError(data.error || "❌ Failed to add product.");
      }
    } catch (err) {
      console.error("Add product error:", err);
      setError("🚫 Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='addproduct'>
      <h1>Add Product</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <input
        type='text'
        placeholder='Enter Product Name'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type='number'
        placeholder='Enter Product Price'
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        min="0"
      />
      <input
        type='text'
        placeholder='Enter Product Category'
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <input
        type='text'
        placeholder='Enter Product Company'
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />
      <input
        type='text'
        placeholder='Enter Image URL'
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <input
        type='number'
        placeholder='Enter Rating (e.g. 4.7)'
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        min="0"
        max="5"
        step="0.1"
      />
      <textarea
        placeholder='Enter Description'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
      />
      <button onClick={addProduct} disabled={loading}>
        {loading ? "Adding..." : "Add Product"}
      </button>
    </div>
  );
};

export default AddProduct;
