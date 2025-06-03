import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import NavbarC from '../components/navbar1-connected';
import Footer from '../components/footer';
import '../styles/verification-form.css';

function CancellationPage() {
    const [searchParams] = useSearchParams();
    const reservationId = searchParams.get('id');
    const reservationType = searchParams.get('type');
    const navigate = useNavigate();
    const [message, setMessage] = useState("Annulation de la réservation en cours...");
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!reservationId || !reservationType) {
            setError("Informations de réservation manquantes");
            return;
        }

        const cancelReservation = async () => {
            try {
                const endpoint = `http://127.0.0.1:8000/api/reservations/${reservationType}-reservations/${reservationId}/cancel/`;
                
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || "Échec de l'annulation");
                }

                setMessage("Réservation annulée avec succès! Redirection vers l'accueil...");
                setTimeout(() => navigate('/'), 3000);
            } catch (error) {
                console.error('Cancellation error:', error);
                setError(error.message || "Impossible d'annuler la réservation. Veuillez réessayer plus tard.");
            }
        };

        cancelReservation();
    }, [reservationId, reservationType, navigate]);

    return (
        <>
            <NavbarC />
            <div className="verification-container visible">
                <h1 className="verification-title">Annulation de Réservation</h1>
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

export default CancellationPage;
