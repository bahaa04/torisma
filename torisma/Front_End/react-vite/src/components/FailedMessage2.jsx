import React from 'react';
import '../styles/Message.css';

function FailedMessage2({ onClose }) {
  return (
    <div className="message-overlay">
      <div className="message-box error">
        <h2 className="error-title">Échec de paiement!</h2>
        <h1 className="error-icon">❌</h1>
        <h2>Crédits insuffisants pour effectuer cette réservation.</h2>
        <p className="error-text">Veuillez vérifier votre solde ou choisir un autre mode de paiement.</p>
        <button className="close-button" onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
}

export default FailedMessage2;
