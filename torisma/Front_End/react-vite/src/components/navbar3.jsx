import React from 'react';
import "../styles/connect.css";
import Logo from "../components/logo";

const NavBar3 = () => {
  const handleLogoClick = () => {
    window.location.href = '/';
  };

  return (
    <div className="header">
      <div 
        className="logo-container" 
        onClick={handleLogoClick}
        style={{ cursor: 'pointer' }}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleLogoClick();
          }
        }}
      >
        <Logo/>
        <h1 className="logoText">
          <span className="highlight">T</span>ourism<span className="highlight">A</span>
        </h1>
      </div>
    </div>
  );
};

export default NavBar3;