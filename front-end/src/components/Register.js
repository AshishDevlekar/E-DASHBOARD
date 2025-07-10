// src/components/Register.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="page-center">
      <div className="register-info">
        <h1>Welcome to E-Comm</h1>
        <p>
          Manage your products, track your orders, and deliver the best shopping experience.
          Join us to simplify your business operations.
        </p>
        <p>
          Ready to get started? <Link to="/signup">Sign Up here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
