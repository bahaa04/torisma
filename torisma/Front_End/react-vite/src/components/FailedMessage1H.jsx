import React from 'react';
import '../styles/Message.css';

function FailedMessage1C({ onClose, startDate, endDate, error }) {
  return (
    <div className="message-overlay">
      <div className="message-box warning">
        <h2 className="warning-title">localisation non disponible!</h2>
        <h1 className="warning-icon">⚠️</h1>
        <h2>{error || 'Ce logement est déjà réservée pour la période sélectionnée.'}</h2>
        <p className="error-text">Du {startDate} au {endDate}</p>
        {!error && (
          <p className="error-text">Veuillez choisir une autre période ou consulter nos autres véhicules disponibles.</p>
        )}
        <button className="close-button" onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
}

export default FailedMessage1C;
