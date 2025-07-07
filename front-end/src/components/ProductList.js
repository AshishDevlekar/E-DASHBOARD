import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const API_BASE = process.env.REACT_APP_API_URL;

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token not found");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/all-products`, {
        headers: {
          authorization: `bearer ${token}`
        }
      });

      const result = await response.json();
      setProducts(result);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const deleteProduct = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const response = await fetch(`${API_BASE}/product/${id}`, {
        method: 'DELETE',
        headers: {
          authorization: `bearer ${token}`
        }
      });

      const result = await response.json();
      if (result) getProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const searchHandle = async (e) => {
    const key = e.target.value.trim();
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token not found");
      return;
    }

    if (key) {
      try {
        const response = await fetch(`${API_BASE}/search/${key}`, {
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
    let user = null;
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        user = JSON.parse(storedUser);
      }
    } catch (err) {
      console.error("Invalid user format");
      alert("User session invalid. Please log in again.");
      return;
    }

    const token = localStorage.getItem("token");

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

    try {
      const response = await fetch(`${API_BASE}/add-to-cart`, {
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
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  const storedUser = localStorage.getItem("user");
  const isAdmin = storedUser && JSON.parse(storedUser).role === "admin";

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
              isAdmin={isAdmin}
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
