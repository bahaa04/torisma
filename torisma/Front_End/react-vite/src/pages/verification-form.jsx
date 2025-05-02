"use client"

import React, { useState, useEffect } from "react"
import {Link} from "react-router-dom"
import "../styles/verification-form.css"
import NavBar3 from "../components/navbar3"
import Footer from "../components/footer";

export default function VerificationForm({ email }) {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [resendDisabled, setResendDisabled] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true)
    }, 100)
  }, [])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false)
    }
  }, [countdown, resendDisabled])

  const handleInputChange = (e) => {
    setCode(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (code.trim() === "") return

    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      alert("Code verified successfully!")
    }, 1500)
  }

  const handleResendCode = () => {
    setResendDisabled(true)
    setCountdown(30)

    setTimeout(() => {
      alert("New verification code sent!")
    }, 1000)
  }

  return (
    <>
    <NavBar3/>
   
    <div className={`verification-container ${isVisible ? "visible" : ""}`}>
      <h1 className="verification-title">Vérifiez votre boîte de réception</h1>

      <p className="verification-description">
        Saisissez le code de vérification que nous venons d'envoyer à l'adresse {email}.
      </p>

      <form onSubmit={handleSubmit} className="verification-form">
        <div className="input-container">
          <input
            type="text"
            value={code}
            onChange={handleInputChange}
            placeholder="code"
            className="verification-input"
            maxLength={6}
          />
        </div>

<Link to="/reset">
        <button
          type="submit"
          className={`verification-button ${isLoading ? "loading" : ""}`}
          disabled={isLoading || code.trim() === ""}
        >
          {isLoading ? <span className="loading-spinner"></span> : "Continuer"}
        </button>

</Link>

        <div className="resend-container">
          <button
            type="button"
            onClick={handleResendCode}
            className="resend-link"
            disabled={resendDisabled}
          >
            Renvoyer le code {resendDisabled && countdown > 0 ? `(${countdown}s)` : ""}
          </button>
        </div>
      </form>
    </div>
    <Footer/>
    </>
  )
}
