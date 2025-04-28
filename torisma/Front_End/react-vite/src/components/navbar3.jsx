import React from 'react' ;
import { Link } from "react-router-dom";
import "../styles/connect.css";
import Logo from "../components/logo";





const NavBar3 = () => {

return(


    <div className="header">
    <div className="logo-container">
        <Logo/>
        <h1 className="logoText"><span className="highlight">T</span>ourism<span className="highlight">A</span></h1>
    </div>


</div>


);

};

export default NavBar3;