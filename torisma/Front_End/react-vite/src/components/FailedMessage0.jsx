import React from 'react';
import '../styles/Message.css';

function FailedMessage0({ onClose }) {
  return (
    <div className="message-overlay">
      <div className="message-box">
        <h2>Échec de paiement!</h2>
        <h1>❌</h1>
        <h2>Informations de carte incorrectes.</h2>
        <p>Veuillez vérifier les informations de votre carte et réessayer.</p>
        <button className="close-button" onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
}

export default FailedMessage0;