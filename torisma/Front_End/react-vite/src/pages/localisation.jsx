import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Localisation.css';

import PropertyGallery from '../components/PropertyGallery';
import PropertyRating from '../components/PropertyRating';
import BookingForm from '../components/BookingForm';
import LocationMap from '../components/LocationMap';
import PropertyDescription from '../components/PropertyDescription';
import Footer from '../components/footer';
import NavBar1 from '../components/navbar1';
import NavBarC from '../components/navbar1-connected';
import PaymentConfirmation from '../components/PaymentConfirmation';
import SuccessMessage from '../components/SuccessMessage';
import Erreur from '../components/Erreur';
import Redirecting from '../components/Redirecting';

function Localisation() {
  const navigate = useNavigate();
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
      
      <PropertyGallery altText="Gallery of the property" />

      <div className="localisation-container">
        <div className="right-column">
          <PropertyRating />
          <LocationMap />
          <PropertyDescription />
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
        <SuccessMessage onClose={() => setShowSuccess(false)} />
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
  );
}

export default Localisation;
