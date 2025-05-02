"use client"

import React, { useState } from "react"
import "../styles/resetpassword.css";
import Footer from "../components/footer";
import NavBar3 from "../components/navbar3";

export default function ResetPassword() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isValid, setIsValid] = useState(false)

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    validatePassword(newPassword, confirmPassword)
  }

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value
    setConfirmPassword(newConfirmPassword)
    validatePassword(password, newConfirmPassword)
  }

  const validatePassword = (pass, confirmPass) => {
    const isLengthValid = pass.length >= 12
    const doPasswordsMatch = pass === confirmPass

    setIsValid(isLengthValid && doPasswordsMatch && pass.length > 0)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isValid) {
      alert("Mot de passe réinitialisé avec succès!")
    }
  }

  return (
    <>
    <NavBar3/>
    <hr style={{border:"none" , height:"0.5px",backgroundColor:"#e0e0e0"}}  />
    <div className="password-reset-container">
      <div className="password-reset-card">
        <h1 className="password-reset-title">Réinitialiser votre mot de passe</h1>
        <p className="password-reset-subtitle">
          Saisissez un nouveau mot de passe ci-dessous pour modifier votre mot de passe
        </p>

        <form onSubmit={handleSubmit}>
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              className="password-input"
              placeholder="Nouveau mot de passe"
            />
         <button
  type="button"
  className="toggle-visibility-button"
  onClick={togglePasswordVisibility}
  aria-label={showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="eye-icon"
  >
    {showPassword ? (
      // Plain eye when password is visible
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      // Eye with slash when password is hidden
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
</button>
          </div>

          <div className="password-input-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="password-input"
              placeholder="Saisir de nouveau le mot de passe"
            />
           <button
  type="button"
  className="toggle-visibility-button"
  onClick={toggleConfirmPasswordVisibility}
  aria-label={showConfirmPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="eye-icon"
  >
    {showConfirmPassword ? (
      // Plain eye when password is visible
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      // Eye with slash when password is hidden
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
</button>

          </div>

          <div className="password-requirements">
            <p>Votre mot de passe doit contenir :</p>
            <ul>
              <li className={password.length >= 12 ? "requirement-met" : ""}>Au moins 12 caractères</li>
            </ul>
          </div>

          <button
            type="submit"
            className={`continue-button ${isValid ? "button-active" : "button-disabled"}`}
            disabled={!isValid}
          >
            Continuer
          </button>
        </form>
      </div>
    </div>
    <Footer/>
    </>
  )
}
