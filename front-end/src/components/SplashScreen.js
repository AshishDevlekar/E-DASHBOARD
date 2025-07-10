import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assests/logo.png"; // ✅ Import the image

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/register"); // or "/login"
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      <img src={logo} alt="Logo" className="splash-logo" />
      <h1 className="splash-title">E-Comm</h1>
    </div>
  );
};

export default SplashScreen;
