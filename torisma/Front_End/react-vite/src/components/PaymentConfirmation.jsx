
import React, { useState } from 'react';
import '../styles/PaymentConfirmation.css';

function PaymentConfirmation({ onBack, onConfirm,onError }) {
  const [code, setCode] = useState('');

  const handleConfirm = () => {
    if (code === '00000') {
      alert('Paiement confirmé !');
      if (onConfirm) onConfirm();
    } else {
        if (onError) onError();

    }
  };

  return (
    <div className="payment-confirmation-container">
      <div className="payment-box">
        <button className="back-button" onClick={onBack}>←</button>
        <h2 className="title">Confirmer le paiement</h2>
        <p className="subtitle">Veuillez entrer le code envoyé à votre numéro de téléphone</p>
        <input
          className="code-input"
          type="text"
          placeholder="Code envoyé"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button className="confirm-button" onClick={handleConfirm}>Confirmer</button>
      </div>
    </div>
  );
}

export default PaymentConfirmation;