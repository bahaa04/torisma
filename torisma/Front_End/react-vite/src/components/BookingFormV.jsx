import React, { useState } from 'react';
import '../styles/BookingForm.css';
import SuccessMessage from './SuccessMessage'; // Import SuccessMessage component
import Redirecting from './Redirecting'; // Import Redirecting component

function BookingFormV({ originalPrice, discountedPrice, discount, onReserve }) {
  const [startDate, setStartDate] = useState('27/02/2025');
  const [endDate, setEndDate] = useState('25/04/2025');
  const [paymentMethod, setPaymentMethod] = useState('Hand to hand');
  const [promoCode, setPromoCode] = useState('');
  const [promoMessage, setPromoMessage] = useState('');
  const [showPromoSuccess, setShowPromoSuccess] = useState(false); // New state for promo success message
  const [showRedirecting, setShowRedirecting] = useState(false); // State for redirecting page
  const [redirectUrl, setRedirectUrl] = useState(null); // State for external redirection URL
  const [showEmailMessage, setShowEmailMessage] = useState(false); // State for email message

  const handleApplyPromo = () => {
    if (promoCode.trim() === '') {
      setPromoMessage('Veuillez entrer un code promo.');
    } else {
      setPromoMessage('');
      setShowPromoSuccess(true); // Show success message
    }
  };

  const handleReserve = () => {
    if (paymentMethod === 'Hand to hand') {
      setShowRedirecting(true);
      setTimeout(() => {
        setShowRedirecting(false);
        setShowEmailMessage(true);
      }, 3000);
    } else if (paymentMethod === 'Card') {
      setRedirectUrl('/payement');
      setShowRedirecting(true);
    }
  };

  return (
    <div className="booking-form">
      <div className="booking-header">
        <div className="promo-code-section">
          <div className="price-container">
            <div className="original-price">{originalPrice} par jour</div>
            <div className="discounted-price">{discountedPrice} par jour</div>
          </div>

          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Code promo"
            className="promo-code-input"
          />
          <button
            className="apply-promo-button"
            onClick={handleApplyPromo}
          >
            Appliquez
          </button>

          {promoMessage && <div className="promo-message">{promoMessage}</div>}
        </div>
      </div>

      <div className="availability">
        <div className="availability-label">disponibilité</div>
        <div className="availability-status">Disponible</div>
      </div>

      <div className="date-picker">
        <div className="date-field">
          <label>de</label>
          <input
            type="text"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="date-input"
          />
        </div>
        <div className="date-field">
          <label>à</label>
          <input
            type="text"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="date-input"
          />
        </div>
      </div>

      <div className="payment-method">
        <div className="payment-label">Type de Paiement</div>
        <div className="payment-selector">
          <button
            className={`payment-option ${paymentMethod === 'Hand to hand' ? 'selected' : ''}`}
            onClick={() => setPaymentMethod('Hand to hand')}
          >
            Hand to hand
          </button>
          <button
            className={`payment-option ${paymentMethod === 'Card' ? 'selected' : ''}`}
            onClick={() => setPaymentMethod('Card')}
          >
            Card
          </button>
        </div>
      </div>

      <button
        className="reserve-button animated-reserve-button"
        onClick={handleReserve}
      >
        Réserver
      </button>

      {/* Show promo success message */}
      {showPromoSuccess && (
        <SuccessMessage
          onClose={() => setShowPromoSuccess(false)}
          message={`Code promo "${promoCode}" appliqué avec succès !`}
        />
      )}

      {/* Show redirecting page */}
      {showRedirecting && <Redirecting url={redirectUrl || '#'} />}

      {/* Show email message */}
      {showEmailMessage && (
        <SuccessMessage
          onClose={() => setShowEmailMessage(false)}
          message="Votre réservation a été confirmée. Veuillez vérifier votre email pour plus d'informations."
        />
      )}
    </div>
  );
}

export default BookingFormV;