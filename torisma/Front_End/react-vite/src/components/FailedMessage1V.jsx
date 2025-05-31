import React from 'react';
import '../styles/Message.css';

function FailedMessage1V({ onClose, startDate, endDate }) {
  return (
    <div className="message-overlay">
      <div className="message-box">
        <h2 className="warning-title">Logement non disponible!</h2>
        <h1 className="warning-icon">⚠️</h1>
        <h2>Ce logement est déjà réservé pour la période sélectionnée.</h2>
        <p className="error-text">Du {startDate} au {endDate}</p>
        <p className="error-text">Veuillez choisir une autre période ou consulter nos autres logements disponibles.</p>
        <button className="close-button" onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
}

export default FailedMessage1V;
