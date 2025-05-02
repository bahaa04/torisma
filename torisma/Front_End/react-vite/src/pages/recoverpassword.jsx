"use client"

import React, { useState } from "react"
import "../styles/recoverpassword.css";
import NavBar3 from "../components/navbar3";
import Footer from "../components/footer";
import {Link} from "react-router-dom";

export default function PasswordReset() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Veuillez entrer une adresse e-mail valide.")
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsSuccess(true)
    } catch (err) {
      setError("Une erreur s'est produite. Veuillez réessayer.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (

    <>
    <NavBar3/>
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
                  placeholder="m_touchit@estin.dz"
                  className="email-input"
                  disabled={isSubmitting}
                />
                {error && <p className="error-message">{error}</p>}
              </div>


<Link to="/verification">
              <button type="submit" disabled={isSubmitting} className="submit-button slide-up-delay">
                {isSubmitting ? (
                  <div className="spinner-container">
                    <div className="spinner"></div>
                  </div>
                ) : (
                  "Continuer"
                )}
              </button>
</Link>


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

            {/* <button onClick={() => setIsSuccess(false)} className="back-button"> */}
              {/* Retour */}
            {/* </button> */}
          </div>
        )}
      </div>
    </div>
    <Footer/>
    </>
  )
}
