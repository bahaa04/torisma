import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar1';
import Footer from '../components/footer';
import '../styles/verification-form.css';

function ConfirmationPage() {
    const [searchParams] = useSearchParams();
    const reservationId = searchParams.get('id');
    const navigate = useNavigate();
    const [message, setMessage] = useState("Confirmation de la réservation en cours...");
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!reservationId) {
            setError("ID de réservation manquant");
            return;
        }

        const confirmReservation = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/reservations/reservations/${reservationId}/confirm/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Échec de la confirmation");
                }

                setMessage("Réservation confirmée avec succès! Redirection vers l'accueil...");
                setTimeout(() => navigate('/'), 3000);
            } catch (error) {
                setError("Impossible de confirmer la réservation. Veuillez réessayer plus tard.");
            }
        };

        confirmReservation();
    }, [reservationId, navigate]);

    return (
        <>
            <Navbar />
            <div className="verification-container visible">
                <h1 className="verification-title">Confirmation de Réservation</h1>
                {error ? (
                    <p className="verification-error">{error}</p>
                ) : (
                    <p className="verification-description">{message}</p>
                )}
            </div>
            <Footer />
        </>
    );
}

export default ConfirmationPage;
