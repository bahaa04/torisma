import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Localisation.css';
import PropertyGallery from '../components/PropertyGallery';
import PropertyRating from '../components/PropertyRating';
import BookingForm from '../components/BookingForm';
import LocationMap from '../components/LocationMap';
import PropertyDescription from '../components/PropertyDescription';
import Footer from '../components/footer';
import Navbar from '../components/navbar1';
import BookingConfirmationForm from '../components/BookingConfirmationForm';
import PaymentConfirmation from '../components/PaymentConfirmation';
import SuccessMessage from '../components/SuccessMessage';
import Erreur from '../components/Erreur';

function Localisation() {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const handlePhotoClick = (photoUrl) => {
    setSelectedPhoto(photoUrl);
  };

  const handleCloseModal = () => {
    setSelectedPhoto(null);
  };

  return (
    <div>
      <Navbar />
      <PropertyGallery onPhotoClick={handlePhotoClick} />
      
      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="photo-modal" onClick={handleCloseModal}>
          <div className="modal-content">
            <img src={selectedPhoto} alt="Selected property" />
            <button className="close-button" onClick={handleCloseModal}>×</button>
          </div>
        </div>
      )}
      
      <div className="localisation-container">
        <div className="right-column">
          <PropertyRating />
          <LocationMap />    
          <PropertyDescription />
        </div>

        <div className="left-column">
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
          onCancel={() => {
            setShowError(false);
          }}
        />
      )}
      <Footer />
    </div>
  );
}

export default Localisation;