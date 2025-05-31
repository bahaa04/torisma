import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "../styles/verification-form.css"
import NavBar1 from "../components/navbar1"
import Footer from "../components/footer"

function Verified() {
  const { uidb64, token } = useParams()
  const navigate = useNavigate()
  const [message, setMessage] = useState("Vérification en cours...")
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log('uidb64:', uidb64); // Debug
    console.log('token:', token);   // Debug

    if (!uidb64 || !token) {
      setError("Lien de vérification invalide");
      return;
    }

    fetch(`http://127.0.0.1:8000/api/users/auth/verify-email/${uidb64}/${token}/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
      .then(async response => {
        const text = await response.text();
        console.log('Raw response:', text); // Debug

        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error('Failed to parse JSON:', e);
          throw new Error('Invalid server response');
        }

        if (!response.ok) {
          throw new Error(data.detail || 'Verification failed');
        }

        setMessage("Email vérifié avec succès! Redirection vers la page de connexion...");
        setTimeout(() => navigate('/connect'), 3000);
      })
      .catch((err) => {
        console.error('Verification error:', err);
        setError(err.message || "Lien de vérification invalide ou expiré.");
      });
  }, [uidb64, token, navigate]);

  return (
    <>
      <NavBar1 />
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
  );
}

export default Verified;