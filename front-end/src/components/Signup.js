import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [Name, setName] = useState("");
  const [Password, setPassword] = useState("");
  const [Email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem('user');
    if (auth) {
      navigate('/');
    }
  }, [navigate]);

  const collectData = async () => {
  const url = "http://localhost:5000/register";

  let result = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ name: Name, email: Email, password: Password }),
    headers: {
      'Content-Type': 'application/json'
    },
  });

  result = await result.json();

  if (result) {
    alert("Registration successful! Please login to continue.");
    navigate('/login'); // ✅ Redirect to login page
  } else {
    alert("Registration failed");
  }
};

  return (
    <div className='page-center'>
      <div className='register'>
        <h1>Register</h1>
        <input
          className='inputBox'
          type='text'
          value={Name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Enter Name'
        />
        <input
          className='inputBox'
          type='email'
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Enter Email'
        />
        <input
          className='inputBox'
          type='password'
          value={Password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Enter Password'
        />
        <button onClick={collectData} className='registerButton' type='button'>
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Signup;
