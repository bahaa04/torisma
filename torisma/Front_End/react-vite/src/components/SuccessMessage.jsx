
import React from 'react';
import '../styles/SuccessMessage.css';

function SuccessMessage({ onClose }) {
  return (
    <div className="success-message-overlay">
      <div className="success-message-box">
        <h2> Félicitations !</h2>
        <h1>🎉 </h1>
        <h2> Logement  bien  réservé </h2>
        <p>• Veuillez respecter les règles précédentes et laisser l'endroit propre. </p>
        <p>• Veuillez respecter la date de votre réservation. Si vous souhaitez prolonger votre séjour, veuillez vérifier la disponibilité et réserver directement sur le site.</p>
        <button className="close-button" onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
}

export default SuccessMessage;