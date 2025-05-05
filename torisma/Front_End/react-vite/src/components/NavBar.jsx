import React from 'react'
import '../styles/NavBar.css';
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
          <button className="link-button" onClick={() => console.log('Mon expérience clicked')}>Mon expérience</button>
          <Link to="/whyalgeria" className="link-button">Why Algeria</Link>
          <Link to="/profile" className="link-button">Profile</Link>
          <Link to="/voiture" className="link-button">Voiture</Link>
          <Link to="/localisation" className="link-button">Localisation</Link>
        </div>
        
            <div className="header-actions">
              <button className="icon-button">
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </button>
              
              <Link to="/connect" className="login-button">
            Se connecter 

        </Link>
              
            </div>
          </header>
  )};
  
  
export default Navbar ;