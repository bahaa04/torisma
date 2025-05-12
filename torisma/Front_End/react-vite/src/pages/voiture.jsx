import React, { useState, useEffect } from 'react';
import '../styles/Voiture.css';
import PropertyGallery2 from '../components/PropertyGallery2';
import PropertyRating from '../components/PropertyRating';
import BookingFormV from '../components/BookingFormV';
import PropertyDescription2 from '../components/PropertyDescription2';
import Footer from '../components/footer';
import NavBar1 from '../components/navbar1';
import NavBarC from '../components/navbar1-connected';
import PaymentConfirmation from '../components/PaymentConfirmation';
import SuccessMessage2 from '../components/SuccessMessage2';
import Erreur from '../components/Erreur';
import Redirecting from '../components/Redirecting';

function Voiture() {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [redirectUrl, setRedirectUrl] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        setIsAuthenticated(!!accessToken);
    }, []);

    return (
        <div>
            {isAuthenticated ? <NavBarC /> : <NavBar1 />}
            <PropertyGallery2 altText="Gallery of the car" />
            
            <div className="localisation-container"> 
            <div className="right-column"> 
            <PropertyRating />
            <PropertyDescription2 /> 
          </div>

            
          <div className="left-column">
                <BookingFormV
                  originalPrice="16 666DA"
                  discountedPrice="10 090DA"
                  discount="40%"
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