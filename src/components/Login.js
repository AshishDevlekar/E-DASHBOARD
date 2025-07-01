import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const navigate = useNavigate();
  const API_BASE = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/');
    }
  }, [navigate]);

  const handlelogin = async () => {
    try {
      let result = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        body: JSON.stringify({ email: Email, password: Password }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      result = await result.json();

      if (result.auth) {
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', JSON.stringify(result.auth));
        setUser(result.user); // ✅ this will help restrict features like Add Product for admins only
        navigate('/');
      } else {
        alert('Please enter correct details');
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Try again.");
    }
  };

  return (
    <div className='page-center'>
      <div className='login'>
        <h1>Login</h1>
        <input
          type='text'
          className='inputBox1'
          placeholder='Enter Email'
          onChange={(e) => setEmail(e.target.value)}
          value={Email}
        />
        <input
          type='password'
          className='inputBox1'
          placeholder='Enter Password'
          onChange={(e) => setPassword(e.target.value)}
          value={Password}
        />
        <button onClick={handlelogin} className='loginButton' type='button'>
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
