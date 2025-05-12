"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom";  // Add this import
import "../styles/recoverpassword.css";
import NavBar1 from "../components/navbar1";
import Footer from "../components/footer";

export default function PasswordReset() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate();  // Add this line

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
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

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsSuccess(true)
      navigate('/recmsg')  // Add navigation after success
    } catch (err) {
      setError("Une erreur s'est produite. Veuillez réessayer.")
    } finally {
      setIsSubmitting(false)
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
