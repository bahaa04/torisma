import React from 'react';
import StripePayment from './StripePayement';
import "../styles/PaymentContainer.css"

const PaymentPage = () => {
  const handlePaymentSuccess = (paymentIntent) => {
    console.log('Payment successful:', paymentIntent);
    // Handle successful payment (e.g., redirect to success page)
  };

  return (
    <div className="payment-container">
      <h1>Payment Details</h1>
      <div className="payment-form">
        <StripePayment
          amount={1000}
          onSuccess={handlePaymentSuccess}
        />
      </div>
    </div>
  );
};

export default PaymentPage;
