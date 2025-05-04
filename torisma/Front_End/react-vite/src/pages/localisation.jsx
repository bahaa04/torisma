import React, { useState } from 'react';
import '../styles/Localisation.css';
import PropertyGallery from '../components/PropertyGallery';
import PropertyRating from '../components/PropertyRating';
import BookingForm from '../components/BookingForm';
import LocationMap from '../components/LocationMap';
import PropertyDescription from '../components/PropertyDescription';
import Footer from '../components/footer';
import Navbar from '../components/Navbar';
import BookingConfirmationForm from '../components/BookingConfirmationForm';
import PaymentConfirmation from '../components/PaymentConfirmation';
import SuccessMessage from '../components/SuccessMessage';
import Erreur from '../components/Erreur';

function Localisation() {
const [showConfirmation, setShowConfirmation] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

      return (
    <div>
      <Navbar />
      <PropertyGallery />
      
      <div className="localisation-container"> {/* Parent container */}
      
      <div className="right-column"> <>
      <PropertyRating />
    <LocationMap  />    
    <PropertyDescription /> 
      
    </>
    </div>


   

      
<div className="left-column"> {/* Container for the left column */}
    
    <>
      <BookingForm onReserve={() => setShowConfirmation(true)} />
      {showConfirmation && (
      <BookingConfirmationForm
      onClose={() => setShowConfirmation(false)}
      onNext={() => {
      setShowConfirmation(false);
      setShowPayment(true);
      }}
      />
      )}
    </>
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
  <SuccessMessage onClose={() => setShowSuccess(false)} />
   )}
    {showError && (
   <Error
    onRetry={() => {
      setShowError(false);
      setShowPayment(true);
    }}
    onCancel={() => {
      setShowError(false);
    }}
    />
    )}
    <Footer />
    </div>
  )
}

export default Localisation;