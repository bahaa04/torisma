import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/BookingForm.css';
import SuccessMessage from './SuccessMessage'; // Import SuccessMessage component
import Redirecting from './Redirecting'; // Import Redirecting component
import FailedMessage1H from './FailedMessage1H';
import FailedMessage2 from './FailedMessage2';
import FailedMessage from './FialedMessage';
import FailedCoupon from './FailedCoupon'; // Import FailedCoupon component
import FailedReservation from './FailedReservationH';

function BookingForm({ originalPrice, listingId }) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Format dates in YYYY-MM-DD format for placeholders
  const formatDatePlaceholder = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Liquide');
  const [promoCode, setPromoCode] = useState('');
  const [promoMessage, setPromoMessage] = useState('');
  const [showPromoSuccess, setShowPromoSuccess] = useState(false); // New state for promo success message
  const [showRedirecting, setShowRedirecting] = useState(false); // State for redirecting page
  const [redirectUrl, setRedirectUrl] = useState(null); // State for external redirection URL
  const [showEmailMessage, setShowEmailMessage] = useState(false); // State for email message
  const [currentPrice, setCurrentPrice] = useState(originalPrice);
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [showUnavailableMessage, setShowUnavailableMessage] = useState(false);
  const [showInsufficientCredits, setShowInsufficientCredits] = useState(false);
  const [showLoginError, setShowLoginError] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [showInvalidCoupon, setShowInvalidCoupon] = useState(false);
  const [showPastDateError, setShowPastDateError] = useState(false);
  const [status, setStatus] = useState('Available');
  const [dateError, setDateError] = useState(''); // New state for date-related errors
  const [totalPrice, setTotalPrice] = useState(originalPrice);
  const [numberOfDays, setNumberOfDays] = useState(1);
  const navigate = useNavigate();

  // Simulated authentication check
  useEffect(() => {
    // This would normally check with your backend
    const checkAuthStatus = () => {
      const userToken = localStorage.getItem('userToken');
      setIsLoggedIn(!!userToken);
    };

    checkAuthStatus();
  }, []);

  // Add authentication check effect
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setIsLoggedIn(false);
      setIsProfileLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch('http://localhost:8000/api/users/profile/', {
          headers:
           {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
        });
        if (!res.ok) throw new Error(`Unauthorized (${res.status})`);
        const data = await res.json();
        setUserProfile(data);
        setIsLoggedIn(true);
      } catch (err) {
        console.error('Profile fetch failed:', err);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsLoggedIn(false);
        navigate('/connect');
      } finally {
        setIsProfileLoading(false);
      }
    })();
  }, [navigate]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/listings/houses/${listingId}/`);
        if (!response.ok) throw new Error('Failed to fetch status');
        const data = await response.json();
        setStatus(data.status === 'disabled' ? 'Indisponible' : 'Disponible');
      } catch (error) {
        console.error('Error fetching status:', error);
      }
    };

    fetchStatus();
  }, [listingId]);

  const formatDateForBackend = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  const checkAvailability = async () => {
    try {
      const formattedStartDate = formatDateForBackend(startDate);
      const formattedEndDate = formatDateForBackend(endDate);

      console.log('Sending dates:', { formattedStartDate, formattedEndDate }); // Debug log

      const response = await fetch('http://127.0.0.1:8000/api/reservations/check-availability/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          item_type: 'house', // or 'car' for BookingFormV
          item_id: listingId,
          start_date: formattedStartDate,
          end_date: formattedEndDate
        })
      });

      const data = await response.json();
      console.log('Response:', data); // Debug log
      
      if (!response.ok) {
        setDateError(data.error || 'Failed to check availability');
        return false;
      }

      return data.available;
    } catch (error) {
      console.error('Availability check failed:', error);
      return false;
    }
  };

  const checkCredits = async () => {
    // Simulate API call to check user credits
    // For testing: return false if total price > 1000 to simulate insufficient credits
    return currentPrice <= 1000;
  };

  const handleApplyPromo = async () => {
    if (!isLoggedIn) {
      setShowLoginError(true);
      return;
    }

    if (!promoCode.trim()) {
      setPromoMessage('Veuillez entrer un code promo.');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://127.0.0.1:8000/api/coupons/validate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code: promoCode,
          listing_type: 'house',
          listing_id: listingId
        })
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (data.valid) {
        setCurrentPrice(data.final_price);
        setIsPromoApplied(true);
        setShowPromoSuccess(true);
        setShowInvalidCoupon(false);
      } else {
        setShowInvalidCoupon(true);
        setShowPromoSuccess(false);
      }
    } catch (error) {
      console.error('Coupon validation error:', error);
      setShowInvalidCoupon(true);
      setShowPromoSuccess(false);
    }
  };
  const formatDateForAPI = (dateStr) => {
    if (!dateStr) return '';
    try {
      // Ensure we're getting DD/MM/YYYY format
      const parts = dateStr.split('/');
      if (parts.length !== 3) throw new Error('Invalid date format');
      
      // Rearrange to YYYY-MM-DD
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    } catch (error) {
      console.error('Date formatting error:', error);
      return '';
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      setNumberOfDays(days);
      setTotalPrice(currentPrice * days);
    }
  }, [startDate, endDate, currentPrice]);

  const handleReserve = async () => {
    if (!isLoggedIn) {
      setShowLoginError(true);
      return;
    }

    // Validate dates
    if (!startDate || !endDate) {
      setShowPastDateError(true);
      return;
    }

    try {
      const isAvailable = await checkAvailability();
      if (!isAvailable) {
        setShowUnavailableMessage(true);
        return;
      }

      const reservationData = {
        house: listingId,
        start_date: startDate,
        end_date: endDate,
        payment_method: paymentMethod === 'Liquide' ? 'cash' : 'card',
        user: userProfile.id
      };

      console.log('Sending reservation data:', reservationData);

      const response = await fetch('http://127.0.0.1:8000/api/reservations/house-reservations/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(reservationData)
      });

      console.log('Response status:', response.status);

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Reservation request failed');
      }

      if (paymentMethod === 'Liquide') {
        setShowEmailMessage(true);
      } else {
        navigate('/payement', { 
          state: { 
            amount: totalPrice,
            originalPrice: currentPrice,
            numberOfDays: numberOfDays,
            reservationId: data.id,
            type: 'house',
            isDiscounted: isPromoApplied,
            itemId: listingId
          }
        });
      }
    } catch (error) {
      console.error('Reservation error:', error);
      setShowUnavailableMessage(true);
    }
  };


  if (isProfileLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="booking-form">
      <div className="booking-header">
        <div className="promo-code-section">
          <div className="price-container">
            {isPromoApplied && (
              <span className="new-price-label">Le nouveau prix!</span>
            )}
            <div className={`price ${isPromoApplied ? 'discounted' : ''}`}>
              {currentPrice} par jour
              <br />
            </div>
          </div>

          <div className="promo-input-container">
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
              Appliquer
          </button>
          </div>

          {promoMessage && <div className="promo-message">{promoMessage}</div>}
        </div>
      </div>

      <div className="availability">
        <div className="availability-label">disponibilité</div>
        <div className={`availability-status ${status.toLowerCase()}`}>
          {status}
        </div>
      </div>

      <div className="date-picker">
        <div className="date-field">
          <label>de</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="date-input"
            min={formatDatePlaceholder(today)}
          />
        </div>
        <div className="date-field">
          <label>à</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="date-input"
            min={startDate || formatDatePlaceholder(tomorrow)}
          />
        </div>
      </div>

      <div className="payment-method">
        <div className="payment-label">Type de Paiement</div>
        <div className="payment-selector">
          <button
            className={`payment-option ${paymentMethod === 'Liquide' ? 'selected' : ''}`}
            onClick={() => setPaymentMethod('Liquide')}
          >
            Liquide
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

      {showLoginError && (
        <FailedMessage
          onClose={() => setShowLoginError(false)}
          errorType="invalid_credentials"
        />
      )}

      {showUnavailableMessage && (
        <FailedMessage1H
          onClose={() => setShowUnavailableMessage(false)}
          startDate={startDate}
          endDate={endDate}
        />
      )}

      {showInsufficientCredits && (
        <FailedMessage2
          onClose={() => setShowInsufficientCredits(false)}
        />
      )}

      {showPromoSuccess && (
        <SuccessMessage
          onClose={() => setShowPromoSuccess(false)}
          message={`Code promo "${promoCode}" appliqué avec succès !`}
        />
      )}

      {showRedirecting && <Redirecting url={redirectUrl || '#'} />}

      {showEmailMessage && (
        <SuccessMessage
          onClose={() => setShowEmailMessage(false)}
          message="Votre réservation a été confirmée. Veuillez vérifier votre email pour plus d'informations."
        />
      )}

      {showInvalidCoupon && (
        <FailedCoupon
          onClose={() => setShowInvalidCoupon(false)}
          couponCode={promoCode}
        />
      )}

      {showPastDateError && (
        <FailedReservation
          onClose={() => setShowPastDateError(false)}
        />
      )}
    </div>
  );
}

export default BookingForm;