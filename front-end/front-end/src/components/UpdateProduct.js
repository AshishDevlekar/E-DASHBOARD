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

  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getProductDetails();
  }, []);

  const getProductDetails = async () => {
    let result = await fetch(`http://localhost:5000/product/${params.id}`);
    result = await result.json();

    setName(result.name);
    setPrice(result.price);
    setCategory(result.category);
    setCompany(result.company);
    setImage(result.image || '');
    setRating(result.rating || '');
    setDescription(result.description || '');
  };

  const updateProduct = async () => {
    const token = JSON.parse(localStorage.getItem("token"));
    const result = await fetch(`http://localhost:5000/product/${params.id}`, {
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

    const data = await result.json();
    console.log(data);
    navigate('/');
  };

  return (
    <div className='addproduct'>
      <h1>Update Product</h1>

      <input type='text' placeholder='Enter Product Name' value={name} onChange={(e) => setName(e.target.value)} />
      <input type='text' placeholder='Enter Product Price' value={price} onChange={(e) => setPrice(e.target.value)} />
      <input type='text' placeholder='Enter Product Category' value={category} onChange={(e) => setCategory(e.target.value)} />
      <input type='text' placeholder='Enter Product Company' value={company} onChange={(e) => setCompany(e.target.value)} />
      <input type='text' placeholder='Enter Image URL' value={image} onChange={(e) => setImage(e.target.value)} />
      <input type='text' placeholder='Enter Rating (e.g. 4.5)' value={rating} onChange={(e) => setRating(e.target.value)} />
      <textarea placeholder='Enter Product Description' value={description} onChange={(e) => setDescription(e.target.value)} />

      <button onClick={updateProduct} className='appButton'>Update Product</button>
    </div>
  );
};

export default UpdateProduct;
