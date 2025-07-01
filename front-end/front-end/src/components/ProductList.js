import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    const token = JSON.parse(localStorage.getItem("token"));

    if (!token) {
      console.error("Token not found");
      return;
    }

    let result = await fetch(`http://localhost:5000/all-products`, {
      headers: {
        authorization: `bearer ${token}`
      }
    });

    result = await result.json();
    setProducts(result);
  };

  const deleteProduct = async (id) => {
    let result = await fetch(`http://localhost:5000/all-product/${id}`, {
      method: 'DELETE'
    });

    result = await result.json();
    if (result) {
      getProducts();
    }
  };

  const searchHandle = async (e) => {
  let key = e.target.value.trim();
  const token = JSON.parse(localStorage.getItem("token"));
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    console.error("User or token not found in localStorage");
    return;
  }

  if (key) {
    try {
      const response = await fetch(`http://localhost:5000/search/${key}`, {
        headers: {
          authorization: `bearer ${token}`
        }
      });

      const result = await response.json();
      setProducts(result.length > 0 ? result : []);
    } catch (error) {
      console.error("Search fetch failed:", error);
    }
  } else {
    getProducts();
  }
};


  const handleAddToCart = async (item) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = JSON.parse(localStorage.getItem("token"));

    if (!user || !token) {
      alert("User not logged in");
      return;
    }

    const cartItem = {
      userId: user._id,
      productId: item._id,
      name: item.name,
      price: item.price,
      category: item.category,
      company: item.company
    };

    const response = await fetch("http://localhost:5000/add-to-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": `bearer ${token}`
      },
      body: JSON.stringify(cartItem)
    });

    const result = await response.json();

    if (response.ok) {
      alert(`${item.name} added to cart ✅`);
    } else {
      alert("Failed to add to cart ❌");
      console.error(result);
    }
  };

  return (
    <div className="product-list">
      <h3>Product List</h3>
      <input
        type="text"
        className="searchbox"
        placeholder="Search Product"
        onChange={searchHandle}
      />
      <div className="product-grid">
  {products.length > 0 ? (
    products.map((item, index) => (
      <ProductCard
        key={item._id}
        product={item}
        onAddToCart={() => handleAddToCart(item)}
        onDelete={() => deleteProduct(item._id)}
      />
    ))
  ) : (
    <h1>No Result Found</h1>
  )}
</div>
    </div>
  );
};

export default ProductList;
