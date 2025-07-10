import './App.css';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Signup from './components/Signup';
import PrivateComponent from './components/PrivateComponent';
import Login from './components/Login';
import AddProduct from './components/AddProduct';
import ProductList from './components/ProductList';
import UpdateProduct from './components/UpdateProduct';
import Cart from './components/AddCart';
import Payment from './components/Payment';
import PurchaseHistory from './components/PurchasedHistory';
import UserDetail from './components/UserDetail';
import About from './components/About';
import Contact from './components/Contact';
import PrivacyPolicy from './components/Privacy';
import TermsOfService from './components/TermsofServices';
import SplashScreen from './components/SplashScreen'; // ✅ New

import '@fortawesome/fontawesome-free/css/all.min.css';

import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const saved = localStorage.getItem("darkMode") === "true";
    setDarkMode(saved);

    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <div className={darkMode ? 'App dark' : 'App'}>
      {/* Hide navbar on splash screen */}
      {location.pathname !== '/' && <Nav darkMode={darkMode} setDarkMode={setDarkMode} />}

      <main>
        <Routes>
          {/* ✅ Splash screen as first route */}
          <Route path="/" element={<SplashScreen />} />

          {/* Protected routes */}
          <Route element={<PrivateComponent />}>
            <Route path="/dashboard" element={<ProductList />} />
             <Route path="/products" element={<ProductList />} />
            {user?.role === 'admin' && (
              <>
                <Route path="/add" element={<AddProduct />} />
                <Route path="/update/:id" element={<UpdateProduct />} />
              </>
            )}
            <Route path="/profile" element={<PurchaseHistory />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/userdetail" element={<UserDetail />} />
          </Route>

          {/* Public routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/termsofservice" element={<TermsOfService />} />
        </Routes>
      </main>

      {/* Hide footer on splash screen */}
      {!['/login', '/signup', '/'].includes(location.pathname) && <Footer />}
    </div>
  );
}

export default App;
