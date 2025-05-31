import React from 'react';
import '../styles/Message.css';
import { useNavigate } from 'react-router-dom';

function FailedMessage({ onClose }) {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/connect');
  };

  return (
    <div className="message-overlay">
      <div className="message-box error">
        <h2 className="error-title">Connexion Requise</h2>
        <h1 className="error-icon">⚠️</h1>
        <p className="error-text">Vous devez être connecté pour effectuer une réservation.</p>
        <div className="failed-message-buttons">
          <button className="sign-in-button" onClick={handleSignIn}>Se Connecter</button>
          <button className="close-button" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
}

export default FailedMessage;
