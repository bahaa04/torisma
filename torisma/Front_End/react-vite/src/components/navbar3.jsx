import React from 'react';
import { Link } from 'react-router-dom'; 
import Logo from "./logo";

const NavBar3 = () => {
    return(
    <div className="header">
      <Link to="/" className="logo-link">
        <div className="logo-container">
          <Logo/>
          <h1 className="logoText"><span className="highlight">T</span>ourism<span className="highlight">A</span></h1>
        </div>
      </Link>


   
     
      
    </div>
  );
};
  
export default NavBar3;