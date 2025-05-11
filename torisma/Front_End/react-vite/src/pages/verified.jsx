import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "../styles/verification-form.css"
import NavBar3 from "../components/navbar3"
import Footer from "../components/footer"

export default function Verified() {
  const { uidb64, token } = useParams()
  const navigate = useNavigate()
  const [message, setMessage] = useState("Vérification en cours...")
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!uidb64 || !token) {
      setError("Lien de vérification invalide")
      return
    }

    // Add padding if needed
    let paddedUidb64 = uidb64
    const padding = uidb64.length % 4
    if (padding) {
      paddedUidb64 += '='.repeat(4 - padding)
    }

    // Make sure to encode the parameters properly
    const encodedUidb64 = encodeURIComponent(paddedUidb64)
    const encodedToken = encodeURIComponent(token)

    // Call the backend API endpoint
    fetch(`http://127.0.0.1:8000/api/users/auth/verify-email/${encodedUidb64}/${encodedToken}/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Verification failed')
        }
        return res.json()
      })
      .then(data => {
        setMessage(data.message || "Email vérifié avec succès. Vous pouvez maintenant vous connecter.")
        // Redirect to login after successful verification
        setTimeout(() => navigate('/connect'), 3000)
      })
      .catch((err) => {
        console.error('Verification error:', err)
        setError("Lien de vérification invalide ou expiré.")
      })
  }, [uidb64, token, navigate])

  return (
    <>
      <NavBar3 />
      <div className="verification-container visible">
        <h1 className="verification-title">Vérification de l'adresse e-mail</h1>
        {error ? (
          <p className="verification-error">{error}</p>
        ) : (
          <p className="verification-description">{message}</p>
        )}
      </div>
      <Footer />
    </>
  )
}
