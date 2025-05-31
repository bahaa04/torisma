import React from 'react';
import '../styles/Message.css';

function FailedReservation({ onClose }) {
  return (
    <div className="message-overlay">
      <div className="message-box error">
        <h2 className="error-title">Date invalide!</h2>
        <h1 className="error-icon">⚠️</h1>
        <p className="error-text">Vous ne pouvez pas faire une réservation dans une date passée.</p>
        <p className="error-text">Veuillez sélectionner une date future.</p>
        <button className="close-button" onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
}

export default FailedReservation;
