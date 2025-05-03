
import React, { useState } from 'react';
import './styles/BookingForm.css';

function BookingForm({ originalPrice, discountedPrice, discount, onReserve }) {
  const [startDate, setStartDate] = useState('27/02/2025');
  const [endDate, setEndDate] = useState('25/04/2025');
  const [paymentMethod, setPaymentMethod] = useState('Hand to hand');

  

  return (
    <div className="booking-form">
      <div className="booking-header">
        <div className="promo-tag">Promo! <span className="discount">{discount}</span></div>
        <div className="he">-30%</div>
      </div>
      
      <div className="price-container">
        <div className="original-price">{originalPrice} 16 666DA par nuit</div>
        <div className="discounted-price">{discountedPrice} 10 090DA par nuit</div>
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
         className={`payment-option en-ligne-button ${paymentMethod === 'En ligne' ? 'selected' : ''}`}
         onClick={() => setPaymentMethod('En ligne')}
      >
        En ligne
      </button>
        </div>
      </div>
      
      <button
  className="reserve-button animated-reserve-button"
  onClick={onReserve}
>
  Réserver
</button>

    </div>
  );
}

export default BookingForm;