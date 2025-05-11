import React from "react";
import { Link } from "react-router-dom";
import Logo from "./logo";

const NavbarC = ({ profileImage }) => {
  return (
    <>
      <header>
        <Link to="/" className="logo-link">
          <div className="logo-container">
            <Logo />
            <h1 className="logoText">
              <span className="highlight">T</span>ourism
              <span className="highlight">A</span>
            </h1>
          </div>
        </Link>

        <div className="header-actions">
          <Link to="/moi" className="profile-pic">
            <img
              src={profileImage || "/default-profile.jpg"} // Use profileImage or fallback to default
              alt="Profile"
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          </Link>
        </div>
      </header>
      <hr
        style={{
          border: "none",
          height: "0.5px",
          backgroundColor: "#e0e0e0",
        }}
      />
    </>
  );
};

export default NavbarC;