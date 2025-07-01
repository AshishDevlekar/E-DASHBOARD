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

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getProductDetails();
  }, []);

  const getProductDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/product/${id}`);
      const result = await response.json();

      setName(result.name || '');
      setPrice(result.price || '');
      setCategory(result.category || '');
      setCompany(result.company || '');
      setImage(result.image || '');
      setRating(result.rating || '');
      setDescription(result.description || '');
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const updateProduct = async () => {
    const token = JSON.parse(localStorage.getItem("token"));

    if (!token) {
      alert("User not authenticated.");
      return;
    }

    const updatedProduct = {
      name,
      price,
      category,
      company,
      image,
      rating,
      description
    };

    try {
      const response = await fetch(`http://localhost:5000/product/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: `bearer ${token}`
        },
        body: JSON.stringify(updatedProduct)
      });

      const result = await response.json();

      if (response.ok) {
        alert("Product updated successfully ✅");
        navigate('/');
      } else {
        alert("Failed to update product ❌");
        console.error(result);
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert("An error occurred while updating.");
    }
  };

  return (
    <div className='page-center'>
      <div className='addproduct'>
        <h2>Update Product</h2>

        <input
          type='text'
          placeholder='Enter Product Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='inputBox'
        />

        <input
          type='text'
          placeholder='Enter Product Price (₹)'
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className='inputBox'
        />

        <input
          type='text'
          placeholder='Enter Product Category'
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className='inputBox'
        />

        <input
          type='text'
          placeholder='Enter Product Company'
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className='inputBox'
        />

        <input
          type='text'
          placeholder='Image URL (optional)'
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className='inputBox'
        />

        <input
          type='text'
          placeholder='Rating (e.g. 4.5)'
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className='inputBox'
        />

        <textarea
          placeholder='Product Description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className='inputBox'
          rows={4}
        />

        <button onClick={updateProduct} className='appButton'>
          Update Product
        </button>
      </div>
    </div>
  );
};

export default UpdateProduct;
