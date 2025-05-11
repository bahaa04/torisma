import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import NavBar from '../components/navbar1';
import NavBarC from '../components/navbar1-connected';
import Footer from '../components/footer';
import Logo from '../components/logo';
import DestinationList from '../components/destination-list';
import '../styles/homepage.css';

export default function HomePage() {
  const [dests, setDests] = useState([]);
  const [isDestsLoaded, setIsDestsLoaded] = useState(false);
  const [error, setError] = useState(null);

  const [userProfile, setUserProfile] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  const navigate = useNavigate();

  const navigateToHouses = (wilaya) => {
    navigate(`/houses/${wilaya}`);
  };

  const navigateToCars = (wilaya) => {
    navigate(`/cars/${wilaya}`);
  };

  // 1) Try to load user profile if there's an auth token in localStorage
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      // No auth token → skip profile fetch
      setIsProfileLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch('http://localhost:8000/api/users/profile/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
        });
        if (!res.ok) throw new Error(`Unauthorized (${res.status})`);
        const data = await res.json();
        console.log("user === ",data)
        setUserProfile(data);
      } catch (err) {
        console.error('Profile fetch failed:', err);
        // broken token? erase from storage and force login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/connect');
      } finally {
        setIsProfileLoading(false);
      }
    })();
  }, [navigate]);

  // 2) Load wilayas
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://localhost:8000/api/listings/wilayas/');
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        const data = await res.json();
        const formatted = data.map(item => ({
          id: item.id,
          location: item.name,
          images:
            item.photos && item.photos.length > 0
              ? item.photos.map(p => p.image)
              : ['/default-wilaya.jpg'],
        }));
        setDests(formatted);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setIsDestsLoaded(true);
      }
    })();
  }, []);

  // Show loading until both profile (if any) and wilayas have loaded
  if (isProfileLoading || !isDestsLoaded) {
    return (
      <div className="homepage">
        {userProfile ? (
          <NavBarC userProfile={userProfile} />
        ) : (
          <NavBar />
        )}
        <div className="loading">Chargement en cours…</div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="homepage">
        {userProfile ? (
          <NavBarC userProfile={userProfile} />
        ) : (
          <NavBar />
        )}
        <div className="error">Erreur : {error}</div>
        <Footer />
      </div>
    );
  }

  // Success render
  return (
    <div className="homepage">
      {userProfile ? (
        <NavBarC userProfile={userProfile} />
      ) : (
        <NavBar />
      )}

      <div className="main-content">
        <div className="content-header">
          <h1 className="content-title">
            Explorez les wilayas d'Algérie et faites votre choix
          </h1>
          <p className="content-subtitle">
            Partez à la découverte des wilayas d'Algérie et choisissez votre
            prochaine destination.
          </p>
        </div>

        <div className="destinations-grid">
          <DestinationList dests={dests} />
        </div>

        <div className="help-section">
          <p className="help-text">Vous hésitez entre mer, désert ou montagnes ? Si oui, essayez ceci</p>
          <button className="help-button" onClick={() => navigate('/help')}>Aidez-moi</button>
        </div>

      </div>

      <div className="video-banner">
        <video
          width="100%"
          height="100%"
          className="vid"
          autoPlay
          muted
          loop
        >
          <source src="/alg.mp4" type="video/mp4" />
          Your browser does not support the video tag
        </video>
        <div className="banner-logo">
          <Logo />
          <span className="logo-text">TourismA</span>
        </div>
      </div>

      <Footer />
    </div>
  );
}
