"use client"

import React, { useEffect, useState } from "react"
import "../styles/verification-form.css"
import NavBar1 from "../components/navbar1"
import Footer from "../components/footer";
export default function VerificationForm({ email }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true)
    }, 100)
  }, [])

  return (
    <>
      <NavBar1 />
      <div className={`verification-container ${isVisible ? "visible" : ""}`}>
        <h1 className="verification-title">Vérification de votre adresse e-mail</h1>
        <p className="verification-description">
          Un e-mail de vérification a été envoyé à votre adresse{email ? ` (${email})` : ""}.<br />
          Veuillez consulter votre boîte de réception et suivre le lien pour valider votre adresse e-mail.<br />
        </p>
      </div>
      <Footer />
    </>
  )
}
