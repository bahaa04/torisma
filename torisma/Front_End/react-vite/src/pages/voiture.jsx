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
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const handlePhotoClick = (photoUrl) => {
        setSelectedPhoto(photoUrl);
    };

    const handleCloseModal = () => {
        setSelectedPhoto(null);
    };

    return (
        <div>
            <NavBar />
            <PropertyGallery2 onPhotoClick={handlePhotoClick} />
            
            {/* Photo Modal */}
            {selectedPhoto && (
                <div className="photo-modal" onClick={handleCloseModal}>
                    <div className="modal-content">
                        <img src={selectedPhoto} alt="Selected vehicle" />
                        <button className="close-button" onClick={handleCloseModal}>×</button>
                    </div>
                </div>
            )}

            <div className="localisation-container"> 
                <div className="right-column"> 
                    <>
                        <PropertyRating />
                        <LocationMap2 />    
                        <PropertyDescription2 /> 
                    </>
                </div>

                <div className="left-column">
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
    );
}

export default Voiture;