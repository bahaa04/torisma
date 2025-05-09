import React from 'react'
import '../styles/NavBar.css';
import { Link } from 'react-router-dom';
import Logo from "../components/logo";


const Navbar = () => {
    return(
        <header>
            <Link to="/" className="logo-link">
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
                <Link to="/whyToursimA" className="link-button">Pourquoi TourismA</Link>
                <Link to="/whyalgeria" className="link-button">Pourquoi l'Algérie</Link>
            </div>
        
            <div className="header-actions">
                <Link to="/connect" className="login-button">
                    Connect
                </Link>
            </div>
        </header>
    );
};
  
export default Navbar;