"use client"

import React, { useEffect, useState } from "react"
import "../styles/verification-form.css"
import NavBar3 from "../components/navbar3"
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
      <NavBar3 />
      <div className={`verification-container ${isVisible ? "visible" : ""}`}>
        <h1 className="verification-title">Vérification de votre adresse e-mail</h1>
        <p className="verification-description">
          Un e-mail de vérification a été envoyé à votre adresse{email ? ` (${email})` : ""}.<br />
          Veuillez consulter votre boîte de réception et suivre les instructions pour valider votre adresse e-mail.<br />
          Si vous ne trouvez pas l'e-mail, vérifiez également votre dossier de courriers indésirables.
        </p>
      </div>
      <Footer />
    </>
  )
}
