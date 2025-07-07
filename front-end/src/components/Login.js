import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("⚠️ Email and Password are required.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (result.auth) {
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.auth); // token is already a string
        setUser(result.user);
        navigate('/');
      } else {
        setError('Incorrect email or password');
      }

    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='page-center'>
      <div className='login'>
        <h1>Login</h1>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <input
          type='email'
          className='inputBox1'
          placeholder='Enter Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <input
          type='password'
          className='inputBox1'
          placeholder='Enter Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <button
          onClick={handleLogin}
          className='loginButton'
          type='button'
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default Login;
