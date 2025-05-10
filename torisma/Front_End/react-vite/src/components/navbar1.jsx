import React from 'react';
import { Link } from 'react-router-dom'; 
import Logo from "./logo";

const NavBar1 = () => {
    return(    
        <header>
           <Link to="/" className="logo-link">
        <div className="logo-container">
          <Logo/>
          <h1 className="logoText"><span className="highlight">T</span>ourism<span className="highlight">A</span></h1>
        </div>
      </Link>
             
            <div className="nav-links">
                <a href="/whyAlgeria"> Pourquoi l'Algérie </a> 
            </div>
        
            <div className="header-actions">
               
        
                <Link to="/connect" className="login-button">
                    se connecter
                </Link>
            </div>
        </header>
    );
};
  
export default NavBar1;