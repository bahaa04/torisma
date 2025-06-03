import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import NavbarC from '../components/navbar1-connected';
import Footer from '../components/footer';
import '../styles/verification-form.css';

function ConfirmationPage() {
    const [searchParams] = useSearchParams();
    const reservationId = searchParams.get('id');
    const reservationType = searchParams.get('type');
    const navigate = useNavigate();
    const [message, setMessage] = useState("Confirmation de la réservation en cours...");
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Add authentication check
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) {
                navigate('/connect');
                return;
            }

            try {
                const response = await fetch('http://localhost:8000/api/users/profile/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Authentication failed');
                }

                setIsAuthenticated(true);
            } catch (error) {
                console.error('Auth error:', error);
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                navigate('/connect');
            }
        };

        checkAuth();
    }, [navigate]);

    useEffect(() => {
        if (!isAuthenticated) return;

        const confirmReservation = async () => {
            try {
                const token = localStorage.getItem('access_token');
                console.log('Attempting confirmation with token:', token ? 'Present' : 'Missing');
                
                const endpoint = `http://127.0.0.1:8000/api/reservations/${reservationType}-reservations/${reservationId}/confirm/`;
                console.log('Sending confirmation to:', endpoint);
                
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();
                console.log('Server response:', data);

                if (!response.ok) {
                    throw new Error(data.error || data.detail || "Échec de la confirmation");
                }

                setMessage("Réservation confirmée avec succès! Redirection vers l'accueil...");
                setTimeout(() => navigate('/'), 3000);
            } catch (error) {
                console.error('Confirmation error:', error);
                setError(
                    error.message === 'Not authorized' 
                        ? "Vous n'êtes pas autorisé à confirmer cette réservation. Seuls le locataire ou le propriétaire peuvent confirmer."
                        : "Impossible de confirmer la réservation. Veuillez réessayer plus tard."
                );
            }
        };

        confirmReservation();
    }, [reservationId, reservationType, navigate, isAuthenticated]);

    return (
        <>
            <NavbarC />
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
