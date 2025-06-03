import React from 'react';
import '../styles/Message.css';

function SuccessMessage2({ onClose }) {
  return (
    <div className="message-overlay">
      <div className="message-box success">
        <h2 className="success-title">Félicitations !</h2>
        <h1 className="success-icon">🎉</h1>
        <h2>Votre réservation a été confirmée. Veuillez vérifier votre email pour plus d'informations.</h2>
        <button className="close-button" onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
}

export default SuccessMessage2;