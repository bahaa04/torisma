import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import StripePayment from './StripePayement';
import "../styles/PaymentContainer.css"

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [reservationData, setReservationData] = useState({
    amount: 0,
    reservationId: null,
    type: '',
    originalPrice: 0,
    numberOfDays: 1,
    isDiscounted: false,
    itemId: null // Add this
  });

  // Get data passed from reservation component
  useEffect(() => {
    if (location.state) {
      setReservationData({
        amount: location.state.amount,
        reservationId: location.state.reservationId,
        type: location.state.type,
        originalPrice: location.state.originalPrice,
        numberOfDays: location.state.numberOfDays,
        isDiscounted: location.state.isDiscounted,
        itemId: location.state.itemId // Add this
      });
    }
  }, [location]);

  const processPaymentResult = async (status, paymentIntent) => {
    try {
      // Only send request if payment was successful
      if (status === 'completed') {
        await fetch(
          'http://127.0.0.1:8000/api/reservations/process-payment-result/', 
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify({
              reservation_id: reservationData.reservationId,
              payment_status: status,
              item_type: reservationData.type,
              total_amount: reservationData.amount,
              payment_intent_id: paymentIntent?.id || null
            })
          }
        );
      }
      return true;
    } catch (error) {
      console.error('Payment processing error:', error);
      return false;
    }
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      const success = await processPaymentResult('completed', paymentIntent);
      if (success) {
        setPaymentStatus('success');
        setTimeout(() => {
          // Add status parameter to URL
          navigate(
            `/${reservationData.type === 'car' ? 'voiture' : 'localisation'}/${reservationData.itemId}?status=success`,
            { replace: true }
          );
        }, 2000);
      } else {
        setPaymentStatus('update_failed');
      }
    } catch (error) {
      console.error('Payment success handling error:', error);
      setPaymentStatus('update_failed');
    }
  };

  const handlePaymentFailure = async (error) => {
    try {
      const errorCode = error?.code || 'generic_error';
      const status = errorCode === 'card_insufficient_funds' ? 'insufficient' : 'failed';
      
      await processPaymentResult(status, null);
      setPaymentStatus(status);
      
      setTimeout(() => {
        // Redirect with the appropriate status in URL
        navigate(
          `/${reservationData.type === 'car' ? 'voiture' : 'localisation'}/${reservationData.itemId}?status=${status}`,
          { replace: true }
        );
      }, 1500);
    } catch (error) {
      console.error('Payment failure handling error:', error);
      setPaymentStatus('update_failed');
    }
  };

  if (!reservationData.reservationId) {
    return (
      <div className="payment-container">
        <div className="error-message">
          <h2>Invalid Reservation</h2>
          <p>Redirecting to homepage...</p>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className="payment-container">
        <div className="success-message">
          <h2>Payment Successful!</h2>
          <p>Thank you for your payment.</p>
        </div>
      </div>
    );
  } else if (paymentStatus === 'failed') {
    return (
      <div className="payment-container">
        <div className="failed-message">
          <h2>Payment Failed!</h2>
          <p>Please try again or contact support.</p>
        </div>
      </div>
    );
  } else if (paymentStatus === 'update_failed') {
    return (
      <div className="payment-container">
        <div className="error-message">
          <h2>System Error</h2>
          <p>Payment processed but reservation update failed. Contact support.</p>
        </div>
      </div>
    );
  } else if (paymentStatus === 'insufficient') {
    return (
      <div className="payment-container">
        <div className="error-message">
          <h2>Insufficient Funds</h2>
          <p>Your card has insufficient funds. Please use a different payment method.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <h1>Payment Details</h1>
      {reservationData.amount > 0 ? (
        <>
          <StripePayment
            amount={reservationData.amount}
            onSuccess={handlePaymentSuccess}
            onFailed={handlePaymentFailure}
          />
        </>
      ) : (
        <div className="error-message">
          <p>Invalid payment amount</p>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;