import React from 'react' ;
import { Link } from "react-router-dom";
import "../styles/connect.css";
import Logo from "../components/logo";

const NavBar2 = () => {
  return (
    <div className="header">
      <Link to="/" className="logo-link">
        <div className="logo-container">
          <Logo/>
          <h1 className="logoText"><span className="highlight">T</span>ourism<span className="highlight">A</span></h1>
        </div>
      </Link>

      <div className="transp">vous n'avez pas de compte ? </div>
      <hr/> <hr/><hr/><hr/>
      <Link to="/signup">
        <div className="register-btn">
          
          <button>Register</button>
        </div>
      </Link>
      
    </div>
  );
};

export default NavBar2;