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
  const navigate = useNavigate();

  const API_BASE = process.env.REACT_APP_API_URL;

  const addProduct = async () => {
    const userId = JSON.parse(localStorage.getItem('user'))?._id;

    const result = await fetch(`${API_BASE}/add-product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `bearer ${JSON.parse(localStorage.getItem("token"))}`
      },
      body: JSON.stringify({
        name,
        price,
        category,
        company,
        image,
        rating,
        description,
        userId
      })
    });

    const data = await result.json();
    console.log(data);

    if (result.ok) {
      alert("Product added ✅");
      navigate('/');
    } else {
      alert("Something went wrong ❌");
    }
  };

  return (
    <div className='addproduct'>
      <h1>Add Product</h1>
      <input type='text' placeholder='Enter Product Name' value={name} onChange={(e) => setName(e.target.value)} />
      <input type='text' placeholder='Enter Product Price' value={price} onChange={(e) => setPrice(e.target.value)} />
      <input type='text' placeholder='Enter Product Category' value={category} onChange={(e) => setCategory(e.target.value)} />
      <input type='text' placeholder='Enter Product Company' value={company} onChange={(e) => setCompany(e.target.value)} />
      <input type='text' placeholder='Enter Image URL' value={image} onChange={(e) => setImage(e.target.value)} />
      <input type='text' placeholder='Enter Rating (e.g. 4.7)' value={rating} onChange={(e) => setRating(e.target.value)} />
      <textarea placeholder='Enter Description' value={description} onChange={(e) => setDescription(e.target.value)} />
      <button onClick={addProduct}>Add Product</button>
    </div>
  );
};

export default AddProduct;
