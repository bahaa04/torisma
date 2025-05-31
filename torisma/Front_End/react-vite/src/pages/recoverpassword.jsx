"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import "../styles/recoverpassword.css";
import NavBar1 from "../components/navbar1";
import Footer from "../components/footer";

export default function PasswordReset() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Email validation
    if (!email || !validateEmail(email)) {
      setError("Veuillez entrer une adresse e-mail valide.")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/password/forgot/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/connect');
        }, 2000);
      } else {
        setError(data.error || "Une erreur s'est produite. Veuillez réessayer.");
      }
      
    } catch (err) {
      console.error("Error during API call:", err);
      setError("Le serveur ne répond pas. Veuillez réessayer plus tard.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
    <NavBar1/>
    <hr style={{border:"none" , height:"0.5px",backgroundColor:"#e0e0e0"}}  />

    <div className="container2">
      <div className="reset-card">
        {!isSuccess ? (
          <div className="form-container2 fade-in">
            <h1 className="title slide-down">Réinitialiser le mot de passe</h1>
            <p className="description2 fade-in-delay">
              Entrez votre adresse e-mail pour réinitialiser votre mot de passe.
            </p>

            <form onSubmit={handleSubmit} className="reset-form">
              <div className="input-group slide-up">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="email-input"
                  disabled={isSubmitting}
                />
                {error && <p className="error-message">{error}</p>}
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="submit-button slide-up-delay"
              >
                {isSubmitting ? (
                  <div className="spinner-container">
                    <div className="spinner"></div>
                  </div>
                ) : (
                  "Continuer"
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="success-container fade-in">
            <div className="success-icon">
              <svg
                className="checkmark"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="success-title">E-mail envoyé</h2>
            <p className="success-description">
              Veuillez vérifier votre boîte de réception pour les instructions de réinitialisation.
            </p>
          </div>
        )}
      </div>
    </div>
    <Footer/>
    </>
  )
}