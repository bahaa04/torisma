import React from 'react';
import '../styles/Message.css';

function FailedCoupon({ onClose, couponCode }) {
  return (
    <div className="message-overlay">
      <div className="message-box error">
        <h2 className="error-title">Code Promo Invalid</h2>
        <h1 className="error-icon">❌</h1>
        <p className="error-text">
          Le code promo "{couponCode}" n'existe pas ou n'est plus valide.
        </p>
        <div className="failed-message-buttons">
          <button className="close-button" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
}

export default FailedCoupon;
