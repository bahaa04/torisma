
import React from 'react';
import '../styles/SuccessMessage.css';

function SuccessMessage2({ onClose }) {
  return (
    <div className="success-message-overlay">
      <div className="success-message-box">
        <h2> Félicitations !</h2>
        <h1>🎉 </h1>
        <h2> Voiture  bien  réservé vérifier votre email pour plus d'informations</h2>
        <p>• Veuillez respecter les règles précédentes et restituer la voiture dans un état propre et soigné </p>
        <p>• Veuillez respecter la date de votre réservation. Si vous souhaitez prolonger votre location, veuillez vérifier la disponibilité et effectuer une nouvelle réservation sur le site</p>
        <button className="close-button" onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
}

export default SuccessMessage2;