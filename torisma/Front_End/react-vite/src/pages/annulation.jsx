import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar1';
import Footer from '../components/footer';
import '../styles/verification-form.css';

function CancellationPage() {
    const [searchParams] = useSearchParams();
    const reservationId = searchParams.get('id');
    const navigate = useNavigate();
    const [message, setMessage] = useState("Annulation de la réservation en cours...");
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!reservationId) {
            setError("ID de réservation manquant");
            return;
        }

        const cancelReservation = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/reservations/reservations/${reservationId}/cancel/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    if (data.status === "confirmed") {
                        setError("Impossible d'annuler une réservation déjà confirmée");
                    } else {
                        throw new Error(data.error || "Échec de l'annulation");
                    }
                    return;
                }

                setMessage("Réservation annulée avec succès! Redirection vers l'accueil...");
                setTimeout(() => navigate('/'), 3000);
            } catch (error) {
                setError(error.message || "Impossible d'annuler la réservation. Veuillez réessayer plus tard.");
            }
        };

        cancelReservation();
    }, [reservationId, navigate]);

    return (
        <>
            <Navbar />
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
