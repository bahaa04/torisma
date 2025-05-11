import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import '../styles/StripePayment.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHER_KEY);

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

const PaymentForm = ({ transactionId, amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setProcessing(true);

    if (!stripe || !elements) {
      setError('Stripe has not been properly initialized');
      setProcessing(false);
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/reservations/stripe/create-payment/${transactionId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        throw new Error('Payment initialization failed');
      }

      const { clientSecret } = await response.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        onSuccess(result.paymentIntent);
      }
    } catch (error) {
      setError('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
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

      <button type="submit" disabled={!stripe || processing}>
        {processing ? 'Processing...' : `Pay ${amount} EUR`}
      </button>
    </form>
  );
};

const StripePayment = ({ transactionId, amount, onSuccess }) => {
  return (
    <div className="stripe-payment-container">
      <h2>Complete Your Payment</h2>
      <Elements stripe={stripePromise}>
        <PaymentForm transactionId={transactionId} amount={amount} onSuccess={onSuccess} />
      </Elements>
    </div>
  );
};

export default StripePayment;
