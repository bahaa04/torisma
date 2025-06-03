import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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
import FailedMessage0 from '../components/FailedMessage0';
import FailedMessage2 from '../components/FailedMessage2';
import Erreur from '../components/Erreur';
import Redirecting from '../components/Redirecting';

function Voiture() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [carData, setCarData] = useState(null);
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
        const searchParams = new URLSearchParams(window.location.search);
        const status = searchParams.get('status');
        
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
          // Clean up URL parameters after a short delay
          setTimeout(() => {
            navigate(location.pathname, { replace: true });
          }, 100);
        }
    }, []); // Run only on mount

    useEffect(() => {
        const fetchCarData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/listings/cars/${id}/`);
                if (!response.ok) throw new Error('Failed to fetch car data');
                const data = await response.json();
                setCarData({
                    ...data,
                    images: data.photos?.length ? data.photos.map(p => p.photo) : ['/default-car.jpg']
                });
            } catch (error) {
                console.error('Error fetching car data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCarData();
    }, [id]);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            {isAuthenticated ? <NavBarC /> : <NavBar1 />}
            {carData && (
                <>
                    <PropertyGallery2 carId={id} altText="Gallery of the car" images={carData.images} />
                    
                    <div className="localisation-container"> 
                        <div className="right-column"> 
                            <PropertyRating type="car" itemId={id} />
                            <PropertyDescription2 
                                carId={id}
                                description={carData.description}
                                brand={carData.manufacture}
                                model={carData.model}
                                year={carData.manufacturing_year}
                                seats={carData.seats}
                                fuelType={carData.fuel_type}
                            /> 
                        </div>
                        
                        <div className="left-column">
                            <BookingFormV
                                originalPrice={carData.price} // Change this line
                                listingId={id}
                                availability={carData.availability}
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
              <SuccessMessage2 onClose={() => setShowSuccess(false)} />
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

export default Voiture;