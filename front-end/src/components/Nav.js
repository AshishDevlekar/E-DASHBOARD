import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assests/logo.png';
import { useCart } from './CartContext';

const Nav = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const { cartCount } = useCart();

  useEffect(() => {
    console.log('🛒 Nav cartCount updated:', cartCount);
  }, [cartCount]);

  let user = null;
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error('❌ Failed to parse user from localStorage:', error);
  }

  const isAdmin = user?.role === 'admin';

  const logout = () => {
    localStorage.clear();
    navigate('/signup');
  };

  return (
    <div className='nav-header'>
      <div className='nav-left'>
        <img alt='logo' className='logo' src={logo} />
        <button onClick={() => setDarkMode(!darkMode)} className='dark-mode-toggle'>
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>

      <div className='nav-right'>
        <ul className='nav-ul'>
          {user ? (
            <>
              <li><Link to="/">Products</Link></li>
              {isAdmin && (
                <li><Link to="/add">Add Product</Link></li>
              )}
              <li><Link to="/profile">Profile</Link></li>
              <li><Link onClick={logout} to="/signup">Log Out</Link></li>
              <li style={{ position: 'relative' }}>
                <Link to="/cart" title="Cart">
                  <i className="fas fa-shopping-cart" style={{ fontSize: "18px", color: "black" }}></i>
                  {cartCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-10px',
                      background: 'red',
                      color: 'white',
                      borderRadius: '50%',
                      padding: '2px 6px',
                      fontSize: '12px'
                    }}>
                      {cartCount}
                    </span>
                  )}
                </Link>
              </li>
            </>
          ) : (
            <>
              <li><Link to='/signup'>Sign Up</Link></li>
              <li><Link to='/login'>Login</Link></li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Nav;
