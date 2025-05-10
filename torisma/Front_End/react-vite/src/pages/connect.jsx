import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import "../styles/connect.css";
import Footer from "../components/footer";
import NavBar2 from "../components/navbar2";

const Connect = () => {
    const [isValid, setIsValid] = useState(true);
    const [signingIn, setSigningIn] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    useEffect(() => {
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
            
            @keyframes success {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const emailInput = form.querySelector('input[type="text"]');
        const passwordInput = form.querySelector('input[type="password"]');
        let formIsValid = true;

        if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
            formIsValid = false;
            emailInput.style.borderColor = '#ff6b6b';
            emailInput.style.animation = 'shake 0.5s';
            setError("Format d'email invalide");
            
            setTimeout(() => {
                emailInput.style.animation = '';
                setTimeout(() => {
                    emailInput.style.borderColor = '#e1e1e1';
                }, 2000);
            }, 500);
        }

        if (!passwordInput.value.trim()) {
            formIsValid = false;
            passwordInput.style.borderColor = '#ff6b6b';
            passwordInput.style.animation = 'shake 0.5s';
            
            setTimeout(() => {
                passwordInput.style.animation = '';
                setTimeout(() => {
                    passwordInput.style.borderColor = '#e1e1e1';
                }, 2000);
            }, 500);
        }

        setIsValid(formIsValid);
        
        if (formIsValid) {
            setSigningIn(true);
            setTimeout(() => {
                setSuccess(true);
            }, 1500);
        }
    };

    return ( 
        <>
            <div className="container">
                <NavBar2/>
                  <hr style={{ border: "none", height: "0.5px", backgroundColor: "#e0e0e0" }} />
                <main>
                    <div className="left-section" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%" }}>
                        <div className="content fade-in" style={{ width: "100%", maxWidth: 400, textAlign: "center" }}>
                            <p className="tagline">Discover the beauty of Algeria and beyond.</p>
                            <p className="description">Find stunning destinations, rent cars and homes with ease, and start your adventure today, all in one place</p>
                            <div className="cta">
                                <button className="join-btn">Join Now!</button>
                            </div>
                            <div className="illustration">
                                <img src="/boy.png" alt="Tourism illustration" className="illustration-img"/>
                            </div>
                        </div>
                    </div>

                    <div className="right-section slide-in">
                        <div className="login-container">
                            <h2>Sign in</h2>
                            <form className="login-form" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <input type="text" placeholder="Enter Email or Phone" className="form-control"/>
                                </div>
                                <div className="form-group">
                                    <input type="password" placeholder="Password" className="form-control"/>
                                </div>
                                <div className="terms-checkbox">
                                    <input type="checkbox" id="terms" required />
                                    <label htmlFor="terms">
                                        J'accepte les <Link to="/terms-&-conditions" className="terms-link">conditions générales</Link> du site
                                    </label>
                                </div>
                                {error && <p className="error-message">{error}</p>}
                                <div className="forgot-password">
                                    <Link to="/recoverpass">Recover Password</Link>
                                </div>
                                <button 
                                    type="submit" 
                                    className="signin-btn"
                                    style={{ 
                                        backgroundColor: success ? '#2ee59d' : signingIn ? '#25c285' : ''
                                    }}
                                >
                                    {success ? 'Success!' : signingIn ? 'Signing in...' : 'Sign in'}
                                </button>
                            </form>
                        </div>
                    </div>
                </main>
                <Footer/>
            </div>
        </>
    );
};

export default Connect;