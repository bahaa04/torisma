import React from 'react';
import '../styles/Message.css';

function FailedMessage1C({ onClose, startDate, endDate }) {
  return (
    <div className="message-overlay">
      <div className="message-box warning">
        <h2 className="warning-title">Voiture non disponible!</h2>
        <h1 className="warning-icon">⚠️</h1>
        <h2>Cette voiture est déjà réservée pour la période sélectionnée.</h2>
        <p className="error-text">Du {startDate} au {endDate}</p>
        <p className="error-text">Veuillez choisir une autre période ou consulter nos autres véhicules disponibles.</p>
        <button className="close-button" onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
}

export default FailedMessage1C;
