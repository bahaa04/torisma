import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css';

export default function AuthNavBar({ userProfile }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const profileImage = userProfile?.profile_image || '/default-avatar.png';

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/">
          <img src="/logo2.png" alt="Logo" className="logo" />
        </Link>
      </div>
      <div className="nav-links">
        <Link to="/destinations">Destinations</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <div className="profile-container" onClick={() => setShowDropdown(!showDropdown)}>
          <img 
            src={profileImage}
            alt="Profile" 
            className="profile-image"
          />
          {showDropdown && (
            <div className="profile-dropdown">
              <Link to="/profile">Profile</Link>
              <Link to="/settings">Settings</Link>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
