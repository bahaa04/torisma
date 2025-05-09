import React from 'react';
import { Link } from 'react-router-dom';
import Logo from "./logo";

const NavbarC = () => {
    return(
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
                <a href="/whytourisma">Pourquoi TourismA</a>
                <a href="/whyalgeria">Pourquoi l'Algérie</a>
            </div>

            <div className="header-actions">
                <Link to="/moi" className="profile-button">
                    <img src="/profile.jpg" alt="Profile" style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} />
                </Link>
            </div>
        </header>
    );
};

export default NavbarC;