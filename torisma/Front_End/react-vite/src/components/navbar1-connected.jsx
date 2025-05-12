import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './logo';
import { User2, LogOut } from 'lucide-react';
import '../styles/navbar-connected.css';

const NavbarC = ({ userProfile }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear stored tokens
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // Redirect to login
    navigate('/connect');
  };

  return (

    <header className="navbar-connected">
   
        <Link to="/" className="logo-link">
        <div className="logo-container">
          <Logo />
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
    

      <nav className="nav-links">
        <Link to="/whyTourisma" className="nav-item">Pourquoi TourismA</Link>
        <Link to="/whyAlgeria" className="nav-item">Pourquoi l'Algérie</Link>
      </nav>

      <div className="profile-actions">
        <Link to="/moi" className="icon-button" title="Mon profil">
          <User2 className="icon" />
        </Link>
        <button onClick={handleLogout} className="icon-button" title="Se dése connecter">
          <LogOut className="icon logout-icon" />
        </button>
      </div>
    </header>
  );
};

export default NavbarC;
