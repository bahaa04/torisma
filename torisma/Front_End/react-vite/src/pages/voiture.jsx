import React, { useState } from 'react';
import '../styles/Voiture.css';
import PropertyGallery2 from '../components/PropertyGallery2';
import PropertyRating from '../components/PropertyRating';
import BookingForm from '../components/BookingForm';
import LocationMap2 from '../components/LocationMap2';
import PropertyDescription2 from '../components/PropertyDescription2';
import Footer from '../components/footer';
import NavBar from '../components/navbar1';
import PaymentConfirmation from '../components/PaymentConfirmation';
import SuccessMessage2 from '../components/SuccessMessage2';
import Erreur from '../components/Erreur';
function Voiture() {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [redirectUrl, setRedirectUrl] = useState(null);

  return (
    <div>
      <NavBar />
      <PropertyGallery2 />
      
      <div className="localisation-container"> 
      <div className="right-column"> 
      <PropertyRating />
      <LocationMap2  />    
      <PropertyDescription2 /> 
    </div>

      
    <div className="left-column">
          <BookingForm
            onReserve={(paymentMethod) => {
              if (paymentMethod === 'Hand to hand') {
                // immediate success flow
                setShowSuccess(true);
              } else {
                // redirect flow
                setRedirectUrl('https://www.facebook.com/?locale=fr_FR');
              }
            }}
          />

          
        </div>
      </div>

      {showPayment && (
        <PaymentConfirmation
          onBack={() => setShowPayment(false)}
          onConfirm={() => {
            setShowPayment(false);
            setShowSuccess(true);
          }}
          onError={() => {
            setShowPayment(false);
            setShowError(true);
          }}
        />
      )}

      {showSuccess && (
        <SuccessMessage2 onClose={() => setShowSuccess(false)} />
      )}

      {showError && (
        <Erreur
          onRetry={() => {
            setShowError(false);
            setShowPayment(true);
          }}
          onCancel={() => setShowError(false)}
        />
      )}

      {/* <-- render Redirecting if redirectUrl is set */}
      {redirectUrl && <Redirecting url={redirectUrl} />}

      <Footer />
    </div>
  )
}

export default Voiture;