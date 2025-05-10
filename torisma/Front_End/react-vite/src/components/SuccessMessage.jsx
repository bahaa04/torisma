import React from 'react';
import '../styles/SuccessMessage.css';

function SuccessMessage({ onClose, message }) {
  return (
    <div className="success-message-overlay">
      <div className="success-message-box">
        <h2> Félicitations !</h2>
        <h1>🎉 </h1>
        <h2>{message || 'Opération réussie !'}</h2>
        <button className="close-button" onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
}

export default SuccessMessage;