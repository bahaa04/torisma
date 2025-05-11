import React from 'react';
import { Link } from 'react-router-dom';
import Logo from "./logo";

const NavBar2 = () => {
  return (
    <header>
      <Link to="/" className="logo-link">
        <div className="logo-container">
          <Logo/>
          <div className="logo-text">
            <span className="highlighted">T</span>
            <span>o</span>
            <span>u</span>
            <span>r</span>
            <span>i</span>
            <span>s</span>
            <span>m</span>
            <span className="highlighted">A</span>
          </div>
        </div>
      </Link>
      
      <div className="nav-links">
        <a href="/whyTourisma">Pourquoi TourismA</a>
        <a href="/whyAlgeria">Pourquoi l'Algérie</a>
      </div>
    
      <div className="header-actions">
        <Link to="/signup" className="login-button">
          Register
        </Link>
      </div>
    </header>
  );
};

export default NavBar2;