import React from 'react';
import { Link } from 'react-router-dom'; 
import Logo from "../components/logo";


const Navbar = () => {
    return(
        <header>
            <div className="logo-container">
              <Logo/>
     
              <div className="logo-text">
          <span>T</span>
          <span>o</span>
          <span>u</span>
          <span>r</span>
          <span>i</span>
          <span>s</span>
          <span>m</span>
          <span className="highlighted">A</span>
        </div>
        
        
            </div>
             
            <div className="nav-links">
          <a href="#" >Mon expérience</a>
          
            <a href="#"> Pourquoi l'Algérie </a> 
          
        </div>
        
            <div className="header-actions">
              <button className="globe-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </button>
        
              <Link to="/connect" className="login-button">
            Connect
        </Link>
              
            </div>
          </header>
  )};
  
  export default Navbar;