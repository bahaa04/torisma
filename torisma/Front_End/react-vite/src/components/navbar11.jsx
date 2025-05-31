import React from 'react';
import { Link } from 'react-router-dom'; 
import Logo from "./logo";

const NavBar11 = () => {
    return(
        <>
        <header>
              <Link to="/" className="logo-link">
        <div className="logo-container">
          <Logo/>
          <h1 className="logoText"><span className="highlight">T</span>ourism<span className="highlight">A</span></h1>
        </div>
      </Link>
             
            <div className="nav-links">
                  <Link to="/whyTourisma">
                Pourquoi TourismA
                </Link>
            <Link to="/whyAlgeria" >
                Pourquoi l'Algérie
            </Link>
            </div>
        
            <div className="header-actions">
                <Link to="/connect" className="login-button">
                    se connecter
                </Link>
            </div>
        </header>
         <hr style={{ border: "none", height: "0.5px", backgroundColor: "#e0e0e0" }} />
         </>
    );
};
  
export default NavBar11;