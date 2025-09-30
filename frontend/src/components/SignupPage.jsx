// frontend/src/components/SignupPage.jsx
import React, { useState } from 'react';
import './Auth.css';
import { AUTH_API_URL } from '../config.js';

function SignupPage({ onBackClick, onSignupSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`${AUTH_API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Signup failed.');
      }
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => { onSignupSuccess(); }, 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h1>Sign_up</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input type="email" className="auth-input" placeholder="Enter your email" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" className="auth-input" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p style={{color: 'red', marginTop: '10px'}}>{error}</p>}
        {success && <p style={{color: 'lime', marginTop: '10px'}}>{success}</p>}
        <button type="submit" className="signup-auth-button">Create Account</button>
      </form>
      <button onClick={onBackClick} className="back-btn">&#x25C0; Back to Home</button>
    </div>
  );
}
export default SignupPage;