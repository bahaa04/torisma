import React from 'react';
import './styles/BookingConfirmationForm.css';

function BookingConfirmationForm({ onClose, onNext }) 
    {
    const onReserve = () => {
        if (onNext) onNext(); // move to PaymentConfirmation
      };
  return (
    <div className="confirmation-overlay">
      <div className="confirmation-modal">
        <button className="back-button" onClick={onClose}>←</button>
        <h2>Confirmer le paiement</h2>

        <label>Veuillez entrer votre numéro de téléphone</label>
        <div className="phone-input">
          <span>+213</span>
          <input type="text" placeholder="numéro de téléphone" />
        </div>

        <label>Mode de paiement</label>
        <select>
          <option>Paiement avec la carte EDAHABIA</option>
        </select>

        <input type="text" placeholder="Numéro de la carte" />
        <div className="name-expiration">
          <input type="text" placeholder="Nom et prénom" />
          <input type="text" placeholder="Date d'expiration MM/AA" />
        </div>

        <div className="reservation-info">
          <input type="text" placeholder="Date de reservation" />
          <input type="text" placeholder="Code postal" />
        </div>

        <div className="info-text">
           <p> <h2>Plus d'informations</h2></p>
          <p>• Réservation remboursable en cas d'annulation</p>
          <p>• En cas de destruction de quelque chose dans le logement, la personne qui l’a réservé sera responsable du remboursement.</p>
        </div>
        <button
  className="reserve-confirm-button animated-reserve-button"
  onClick={onReserve}
>
  Réserver
</button>
        
      </div>
    </div>
  );
}

export default BookingConfirmationForm;
