// frontend/src/components/LoginPage.jsx (Updated)

import React, { useState } from 'react';
import './Auth.css';
import { AUTH_API_URL } from '../config.js';

function LoginPage({ onBackClick, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`${AUTH_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed.');
      }
      // --- YAHAN BADLAV HUA HAI ---
      onLoginSuccess(username, data.terms_accepted);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h1>Login</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input type="email" className="auth-input" placeholder="Enter your email" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" className="auth-input" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p style={{color: 'red', marginTop: '10px'}}>{error}</p>}
        <button type="submit" className="login-auth-button">Login</button>
      </form>
      <button onClick={onBackClick} className="back-btn">&#x25C0; Back to Home</button>
    </div>
  );
}
export default LoginPage;

