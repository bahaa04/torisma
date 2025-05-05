
import React, { useState } from 'react';
import BookingForm from './BookingForm';
import BookingConfirmationForm from './BookingConfirmationForm';

function PropertyDetails() {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleReserveClick = () => {
    setShowConfirmation(true);
  };

  const handlePaymentConfirmed = (paymentData) => {
    console.log('Payment Data:', paymentData);
    alert('Payment successful!');
    setShowConfirmation(false);
  };

  const handleGoBack = () => {
    setShowConfirmation(false);
  };

  return (
    <div>
      {!showConfirmation ? (
        <BookingForm
          originalPrice={16666}
          discountedPrice={10090}
          discount="39.46%"
          onReserve={handleReserveClick} // Passing the function as a prop
        />
      ) : (
        <BookingConfirmationForm
          onConfirmPayment={handlePaymentConfirmed}
          onGoBack={handleGoBack}
        />
      )}
    </div>
  );
}

export default PropertyDetails;