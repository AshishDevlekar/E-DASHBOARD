import React from "react";
import { Link } from "react-router-dom";


const Footer = () => {
  return (
    <div className="footer">
  <div className="footer-content">
    <div className="footer-left">
      <h3>E-Comm Dashboard</h3>
      <p>Manage your products, orders, and customers efficiently.</p>
    </div>

    <div className="footer-right">
      <div className="footer-col">
        <h4>Quick Links</h4>
        <ul>
          <li><Link to ='/products'>Products</Link></li>
          <li><Link to ='/profile'>Profile</Link></li>
          <li><Link to ='/userdetail'>User Detail</Link></li>
        </ul>
      </div>
      <div className="footer-col">
        <h4>Support</h4>
        <ul>
          <li><Link to ='/about'>About Us</Link></li>
          <li><Link to ='/contact'>Contact Us</Link></li>
          <li><Link to ='/privacy'>Privacy Policy</Link></li>
          <li><Link to ='/termsofservice'>Terms of Service</Link></li>
          
        </ul>
      </div>
    </div>
  </div>

  <div className="footer-bottom">
    © 2025 E-Comm Dashboard. All rights reserved.
  </div>
</div>

  );
};

export default Footer;
