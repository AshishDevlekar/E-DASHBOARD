import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [Name, setName] = useState("");
  const [Password, setPassword] = useState("");
  const [Email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_BASE = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const auth = localStorage.getItem('user');
    if (auth) navigate('/');
  }, [navigate]);

  const collectData = async () => {
    if (!Name || !Email || !Password) {
      setError("⚠️ All fields are required.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: Name, email: Email, password: Password })
      });

      const result = await response.json();

      if (response.ok && result.auth) {
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("token", result.auth);
        alert("✅ Registration successful!");
        navigate('/');
      } else {
        setError(result.error || "❌ Registration failed. Try again.");
      }
    } catch (err) {
      console.error(err);
      setError("🚫 Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='page-center'>
      <div className='register'>
        <h1>Register</h1>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <input
          className='inputBox'
          type='text'
          value={Name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Enter Name'
          autoComplete='name'
        />
        <input
          className='inputBox'
          type='email'
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Enter Email'
          autoComplete='email'
        />
        <input
          className='inputBox'
          type='password'
          value={Password}
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
      </div>
    </div>
  );
};

export default Signup;
