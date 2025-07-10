import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const auth = localStorage.getItem('user');
    if (auth) navigate('/');
  }, [navigate]);

  const collectData = async () => {
    if (!name || !email || !password) {
      setError("⚠️ All fields are required.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const result = await response.json();

      if (response.ok && result.auth) {
        alert("✅ Registration successful! Please log in.");
        navigate('/login');
      } else {
        setError(result.result || result.error || "❌ Registration failed. Try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("🚫 Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='page-center'>
      <div className='welcome-section'>
        <h2>Welcome to E-Comm</h2>
        <p>
          Manage your products, track your orders, and deliver the best shopping experience.
          Join us to simplify your business operations.
        </p>
      </div>

      <div className='register'>
        <h1>Register</h1>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <input
          className='inputBox'
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Enter Name'
          autoComplete='name'
        />
        <input
          className='inputBox'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Enter Email'
          autoComplete='email'
        />
        <input
          className='inputBox'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Enter Password'
          autoComplete='new-password'
        />
        <button
          onClick={collectData}
          className='registerButton'
          type='button'
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        <p style={{ marginTop: '1rem' }}>
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
