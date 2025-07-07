import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [company, setCompany] = useState('');
  const [image, setImage] = useState('');
  const [rating, setRating] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const navigate = useNavigate();
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    getProductDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getProductDetails = async () => {
    try {
      const res = await fetch(`${API_BASE}/product/${params.id}`);
      if (!res.ok) throw new Error("Failed to fetch product");
      const result = await res.json();

      setName(result.name || '');
      setPrice(result.price || '');
      setCategory(result.category || '');
      setCompany(result.company || '');
      setImage(result.image || '');
      setRating(result.rating || '');
      setDescription(result.description || '');
    } catch (err) {
      console.error("❌ Error fetching product:", err);
      alert("Failed to load product details");
    }
  };

  const updateProduct = async () => {
    const token = localStorage.getItem("token"); // ✅ FIXED here

    if (!name || !price || !category || !company) {
      alert("⚠️ Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/product/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `bearer ${token}`
        },
        body: JSON.stringify({
          name,
          price,
          category,
          company,
          image,
          rating,
          description
        })
      });

      const result = await response.json();
      if (response.ok) {
        alert("✅ Product updated successfully");
        navigate('/');
      } else {
        alert("❌ Failed to update product");
        console.error(result);
      }
    } catch (err) {
      console.error("❌ Update error:", err);
      alert("An error occurred during update.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='addproduct'>
      <h1>Update Product</h1>

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
        step='0.1'
        placeholder='Enter Rating (e.g. 4.5)'
        value={rating}
        onChange={(e) => setRating(e.target.value)}
      />
      <textarea
        placeholder='Enter Product Description'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        onClick={updateProduct}
        className='appButton'
        disabled={loading}
      >
        {loading ? 'Updating...' : 'Update Product'}
      </button>
    </div>
  );
};

export default UpdateProduct;
