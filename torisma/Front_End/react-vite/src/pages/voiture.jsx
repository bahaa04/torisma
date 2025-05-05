import React, { useState } from 'react';
import '../styles/Voiture.css';
import PropertyGallery2 from '../components/PropertyGallery2';
import PropertyRating from '../components/PropertyRating';
import BookingForm from '../components/BookingForm';
import LocationMap2 from '../components/LocationMap2';
import PropertyDescription2 from '../components/PropertyDescription2';
import Footer from '../components/footer';
import NavBar from '../components/navbar1';
import BookingConfirmationForm from '../components/BookingConfirmationForm';
import PaymentConfirmation from '../components/PaymentConfirmation';
import SuccessMessage2 from '../components/SuccessMessage2';
import Erreur from '../components/Erreur';
function Voiture() {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

  return (
    <div>
      <NavBar />
      <PropertyGallery2 />
      
      <div className="localisation-container"> 
      <div className="right-column"> <>{/* actally left column */}
      <PropertyRating />
      <LocationMap2  />    
      <PropertyDescription2 /> 
    </>
    </div>


   

      
<div className="left-column"> {/*right column actually */}
    
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
  <SuccessMessage2 onClose={() => setShowSuccess(false)} />
   )}
    {showError && (
   <Erreur
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

export default Voiture;