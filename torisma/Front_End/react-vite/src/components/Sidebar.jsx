import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css'; // Import the CSS file
import '../App.css'; // Import the CSS file

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/connect');
  };

  return (
    <div className="sidebar">
      <NavLink to="/moi" className={({ isActive }) =>
        isActive ? "sidebar-item active" : "sidebar-item"
      }>
        Information personal
      </NavLink>
      <NavLink to="/voiture-liste" className={({ isActive }) =>
        isActive ? "sidebar-item active" : "sidebar-item"
      }>
        Voitures
      </NavLink>
      <NavLink to="/maison-liste" className={({ isActive }) =>
        isActive ? "sidebar-item active" : "sidebar-item"
      }>
        Maisons
      </NavLink>
      <NavLink 
        to="/" 
        onClick={handleLogout}
        className={({ isActive }) =>
          isActive ? "sidebar-item active disconnect" : "sidebar-item disconnect"
        }
      >
        Déconnecter
      </NavLink>
    </div>
  );
}

export default Sidebar;

