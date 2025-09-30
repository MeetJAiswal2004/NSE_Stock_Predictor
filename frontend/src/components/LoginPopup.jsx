// frontend/src/components/LoginPopup.jsx
import React from 'react';
import './LoginPopup.css';

function LoginPopup({ onLoginClick, onSignupClick, onClose }) {
  return (
    <div className="popup-overlay">
      <div className="popup-container content-animated">
        <h2>Authentication Required</h2>
        <p>Please login or create an account to use the prediction feature.</p>
        <div className="popup-buttons">
          <button onClick={onLoginClick} className="popup-login-btn">Login</button>
          <button onClick={onSignupClick} className="popup-signup-btn">Signup</button>
        </div>
        <button onClick={onClose} className="popup-close-btn">&times;</button>
      </div>
    </div>
  );
}
export default LoginPopup;