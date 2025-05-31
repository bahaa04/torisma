import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import '../styles/Localisation.css';

import PropertyGallery from '../components/PropertyGallery';
import PropertyRating from '../components/PropertyRating';
import BookingForm from '../components/BookingForm';
import LocationMap from '../components/LocationMap';
import PropertyDescription from '../components/PropertyDescription';
import Footer from '../components/footer';
import NavBar from '../components/navbar1';
import NavBarC from '../components/navbar1-connected';
import PaymentConfirmation from '../components/PaymentConfirmation';
import SuccessMessage from '../components/SuccessMessage';
import FailedMessage0 from '../components/FailedMessage0';
import FailedMessage2 from '../components/FailedMessage2';
import Erreur from '../components/Erreur';
import Redirecting from '../components/Redirecting';

function Localisation() {
  const { id } = useParams(); // Get id from URL params
  const navigate = useNavigate();
  const location = useLocation();
  const [houseData, setHouseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showInsufficientFunds, setShowInsufficientFunds] = useState(false);
  const [showIncorrectCard, setShowIncorrectCard] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    setIsAuthenticated(!!accessToken);

    // Check URL parameters for payment status
    const urlParams = new URLSearchParams(location.search);
    const status = urlParams.get('status');
    
    if (status) {
      switch (status) {
        case 'success':
          setShowSuccess(true);
          break;
        case 'insufficient':
          setShowInsufficientFunds(true);
          break;
        case 'failed':
          setShowIncorrectCard(true);
          break;
      }
      // Clean up URL parameters
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    const fetchHouseData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/listings/houses/${id}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch house data');
        }
        const data = await response.json();
        setHouseData(data);
      } catch (error) {
        console.error('Error fetching house data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHouseData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {isAuthenticated ? <NavBarC /> : <NavBar />}

      {houseData && (
        <>
          <PropertyGallery id={id} altText="Gallery of the property" images={houseData.images} />

          <div className="localisation-container">
            <div className="right-column">
              <PropertyRating type="house" itemId={id} />
              <LocationMap location={houseData.location} />
              <PropertyDescription description={houseData.description} />
            </div>

            <div className="left-column">
              <BookingForm
                originalPrice={houseData?.price}
                listingId={id} // Pass the ID from URL params
                availability={houseData.availability}
                onReserve={(paymentMethod) => {
                  if (paymentMethod === 'Liquide') {
                    setShowSuccess(true);
                  } else {
                    setRedirectUrl('https://www.facebook.com/?locale=fr_FR');
                  }
                }}
              />
            </div>
          </div>
        </>
      )}

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

      {showInsufficientFunds && (
        <FailedMessage2 onClose={() => setShowInsufficientFunds(false)} />
      )}

      {showIncorrectCard && (
        <FailedMessage0 onClose={() => setShowIncorrectCard(false)} />
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