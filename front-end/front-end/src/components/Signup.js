import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_URL;

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem('user');
    if (auth) navigate('/');
  }, [navigate]);

  const collectData = async () => {
    if (!name || !email || !password) {
      alert("⚠️ Please fill in all fields");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await res.json();

      if (res.ok && result.auth) {
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("token", result.auth);
        alert("✅ Registration successful!");
        navigate('/');
      } else {
        alert("❌ Registration failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("❌ Something went wrong. Try again.");
    }
  };

  return (
    <div className='page-center'>
      <div className='register'>
        <h1>Register</h1>
        <input
          className='inputBox'
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Enter Name'
        />
        <input
          className='inputBox'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Enter Email'
        />
        <input
          className='inputBox'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Enter Password'
        />
        <button onClick={collectData} className='registerButton'>
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Signup;
