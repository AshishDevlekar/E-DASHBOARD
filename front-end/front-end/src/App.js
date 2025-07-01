import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';

// Components
import Nav from './components/Nav';
import Footer from './components/Footer';
import Signup from './components/Signup';
import Login from './components/Login';
import PrivateComponent from './components/PrivateComponent';
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

// Fonts/Icons
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user and dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const storedUser = localStorage.getItem('user');

    setDarkMode(savedDarkMode);
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <div className={darkMode ? 'App dark' : 'App'}>
      <Nav darkMode={darkMode} setDarkMode={setDarkMode} />

      <main>
        <Routes>
          <Route element={<PrivateComponent />}>
            <Route path='/' element={<ProductList />} />
            {user?.role === 'admin' && (
              <>
                <Route path='/add' element={<AddProduct />} />
                <Route path='/update/:id' element={<UpdateProduct />} />
              </>
            )}
            <Route path='/profile' element={<PurchaseHistory />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/payment' element={<Payment />} />
            <Route path='/userdetail' element={<UserDetail />} />
          </Route>

          {/* Public Routes */}
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login setUser={setUser} />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/privacy' element={<PrivacyPolicy />} />
          <Route path='/termsofservice' element={<TermsOfService />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
