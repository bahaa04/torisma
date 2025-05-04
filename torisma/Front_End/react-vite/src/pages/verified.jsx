import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "../styles/verification-form.css"
import NavBar3 from "../components/navbar3"
import Footer from "../components/footer"

export default function Verified() {
  const { uidb64, token } = useParams()
  const navigate = useNavigate()
  const [message, setMessage] = useState("Vérification en cours...")

  useEffect(() => {
    if (!uidb64 || !token) {
      navigate('/')
      return
    }

    fetch(`http://127.0.0.1:8000/api/users/auth/verify-email/${uidb64}/${token}/`)
      .then(res => {
        if (!res.ok) throw new Error('Verification failed')
        return res.json()
      })
      .then(data => {
        setMessage(data.message)
        // Optionally redirect to login after successful verification
        // setTimeout(() => navigate('/connect'), 3000)
      })
      .catch(() => {
        setMessage("Lien de vérification invalide.")
      })
  }, [uidb64, token, navigate])

  return (
    <>
      <NavBar3 />
      <div className="verification-container visible">
        <h1 className="verification-title">Vérification de l'adresse e-mail</h1>
        <p className="verification-description">{message}</p>
      </div>
      <Footer />
    </>
  )
}
