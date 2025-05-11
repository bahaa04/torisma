import React from 'react'
import '../styles/navbar.css';
import { Link } from 'react-router-dom';
import Logo from "../components/logo";


const NavBar = () => {
    return(
        <header>
         <Link to="/" className='no-underline'> 
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
            </Link>
             
            <div className="nav-links">
        
          <Link to="/whyTourisma" className="link-button">Pourquoi TourismA</Link>
          
        
        </div>
        
            <div className="header-actions">
              <Link to="/connect" className="login-button">
            Se connecter 

        </Link>
              
            </div>
          </header>
  )};
  
  
export default NavBar ;