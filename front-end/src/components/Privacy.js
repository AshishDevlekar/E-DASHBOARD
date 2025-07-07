// src/components/PrivacyPolicy.js
import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Privacy Policy</h1>
      <p>
        At <strong>E-comm</strong>, we are committed to protecting your privacy and ensuring your personal information is handled securely and responsibly.
      </p>

      <h3>Information We Collect</h3>
      <p>
        We may collect personal details such as name, email address, phone number, and payment information when you make a purchase or create an account.
      </p>

      <h3>How We Use Your Information</h3>
      <ul>
        <li>To process and fulfill orders</li>
        <li>To improve our services and website</li>
        <li>To send important updates and promotional offers (only if you opt-in)</li>
      </ul>

      <h3>Data Security</h3>
      <p>
        Your data is stored securely and is never sold or shared with third parties without your consent, except as required by law.
      </p>

      <h3>Your Rights</h3>
      <p>
        You have the right to access, update, or delete your personal information. You can manage your data through your profile settings or contact our support team.
      </p>

      <p>
        If you have any questions about our privacy practices, feel free to contact us at <strong>privacy@ecomm.com</strong>.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
