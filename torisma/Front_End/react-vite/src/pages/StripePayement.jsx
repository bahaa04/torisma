import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import '../styles/StripePayment.css';

// Make sure to use your publishable key
const stripePromise = loadStripe('pk_test_51RFZ1NRom7GyCAfJofQoeWphZ0wzdfOJV6zSzrJOXim7Zd8AHX5yh1Q0MdD8qYOPjr5uUlvwcmm5XE4ghOoqjPyO00nam3KQHi');

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

const PaymentForm = ({ amount, onSuccess, onInsufficient, onFailed }) => {
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setProcessing(true);

    if (!stripe || !elements) {
      setProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    
    // Get card details to check the number
    const { error: cardError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (cardError) {
      setError(cardError.message);
      setProcessing(false);
      return;
    }

    // Static payment logic based on card numbers
    const cardNumber = paymentMethod.card.last4;
    
    setTimeout(() => {
      setProcessing(false);
      
      // Check the last 4 digits to determine the outcome
      if (cardNumber === '4242') {
        // Success for 4242 4242 4242 4242
        onSuccess({
          id: 'demo_payment_' + Date.now(),
          status: 'success', // Changed from 'succeeded' to match expected status
          amount: amount
        });
      } else if (cardNumber === '0002') {
        // Insufficient for 4000 0000 0000 0002
        onFailed({
          code: 'card_insufficient_funds',
          payment_intent: { id: 'demo_payment_' + Date.now() }
        });
      } else {
        // Failed for any other card
        onFailed({
          code: 'card_declined',
          payment_intent: { id: 'demo_payment_' + Date.now() }
        });
      }
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="form-row">
        <label htmlFor="card-element">Credit or debit card</label>
        <CardElement 
          id="card-element" 
          options={CARD_ELEMENT_OPTIONS}
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="demo-notice">
        <h3>Numéros de Carte de Démonstration :</h3>
        <p>• 4242 4242 4242 4242 - Succès</p>
        <p>• 4000 0000 0000 0341 - Paiement échoué</p>
        <p>Utilisez n'importe quelle date future pour l'expiration et n'importe quel CVC à 3 chiffres</p>
      </div>

      <button 
        type="submit" 
        disabled={processing || !stripe}
        className={processing ? 'processing' : ''}
      >
        {processing ? 'Processing...' : `Pay ${amount} DZD`}
      </button>
    </form>
  );
};

const StripePayment = ({ amount, onSuccess = () => {}, onInsufficient = () => {}, onFailed = () => {} }) => {
  return (
    <div className="stripe-payment-container">
      <h2>Card Payment Page</h2>
      <Elements stripe={stripePromise}>
        <PaymentForm 
          amount={amount} 
          onSuccess={onSuccess}
          onInsufficient={onInsufficient}
          onFailed={onFailed}
        />
      </Elements>
    </div>
  );
};

export default StripePayment;
