import React from 'react';
import '../styles/Message.css';

function SuccessMessage2({ onClose }) {
  return (
    <div className="message-overlay">
      <div className="message-box success">
        <h2 className="success-title">Félicitations !</h2>
        <h1 className="success-icon">🎉</h1>
        <h2>Voiture bien réservé</h2>
        <p className="success-text">• Veuillez respecter les règles précédentes et restituer la voiture dans un état propre et soigné</p>
        <p className="success-text">• Veuillez respecter la date de votre réservation. Si vous souhaitez prolonger votre location, veuillez vérifier la disponibilité et effectuer une nouvelle réservation sur le site</p>
        <button className="close-button" onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
}

export default SuccessMessage2;