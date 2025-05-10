import { useEffect, useState } from 'react';
import '../styles/Redirecting.css'; // Ensure you create this CSS file for styling

export default function Redirecting({ url, delay = 3000 }) {
  const [showRedirectMessage, setShowRedirectMessage] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (url && url !== '#') {
        window.location.href = url; // Redirect to the external URL
      } else {
        setShowRedirectMessage(false); // Hide redirecting message
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [url, delay]);

  return (
    <div className="redirecting-overlay">
      <div className="redirecting-box">
        {showRedirectMessage ? (
          <>
            <h2>Redirection en cours…</h2>
            <div className="dots-animation">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </>
        ) : (
          <h2>Votre réservation a été confirmée. Veuillez vérifier votre email pour plus d'informations.</h2>
        )}
      </div>
    </div>
  );
}