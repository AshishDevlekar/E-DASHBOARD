import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

const API_BASE = process.env.REACT_APP_API_URL;

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

    try {
      const response = await fetch(`${API_BASE}/all-products`, {
        headers: {
          authorization: `bearer ${token}`,
        },
      });

      const result = await response.json();
      setProducts(result);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/all-product/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result) {
        getProducts();
      }
    } catch (error) {
      console.error("Delete failed:", error);
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
        const response = await fetch(`${API_BASE}/search/${key}`, {
          headers: {
            authorization: `bearer ${token}`,
          },
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
      company: item.company,
    };

    try {
      const response = await fetch(`${API_BASE}/add-to-cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${token}`,
        },
        body: JSON.stringify(cartItem),
      });

      const result = await response.json();

      if (response.ok) {
        alert(`${item.name} added to cart ✅`);
      } else {
        alert("Failed to add to cart ❌");
        console.error(result);
      }
    } catch (error) {
      console.error("Add to cart failed:", error);
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
          products.map((item) => (
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
