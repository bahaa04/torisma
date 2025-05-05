// src/pages/Connect.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/connect.css';
import Footer from '../components/footer';
import NavBar2 from '../components/navbar2';

// Helper to set and get the “auth” token in localStorage
export function setAuthToken(token) {
  localStorage.setItem('auth', token);
}

export function getAuthToken() {
  return localStorage.getItem('auth');
}

export default function Connect() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: identifier.trim(),
          password: password,
        }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      // Store token without 'Bearer' prefix
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      localStorage.setItem('user_role', data.role || 'user');

      navigate('/auth/home');
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <NavBar2 />
      <main>
        <div className="left-section" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <div className="content fade-in" style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
            <p className="tagline">Discover the beauty of Algeria and beyond.</p>
            <p className="description">
            Trouvez des destinations époustouflantes, louez des voitures et des maisons en toute simplicité et commencez votre aventure dès aujourd'hui, le tout au même endroit
            </p>
            <div className="cta">
              <Link to="/register"><button className="join-btn">Join Now!</button></Link>
            </div>
            <div className="illustration">
              <img src="/boy.png" alt="Tourism illustration" className="illustration-img" />
            </div>
          </div>
        </div>

        <div className="right-section slide-in">
          <div className="login-container">
            <h2>Sign in</h2>
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="form-control"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="form-group password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="password-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  className="toggle-visibility-button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="eye-icon"
                  >
                    {showPassword ? (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </>
                    ) : (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
              <div className="forgot-password">
                <Link to="/recoverpass">Recover Password</Link>
              </div>
              {error && <div className="error-message">{error}</div>}
              <button type="submit" className="signin-btn" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
