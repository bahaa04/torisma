import React, { useState, useEffect, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import NavBarC from '../components/navbar1-connected';
import Sidebar from '../components/Sidebar';
import ProfileInformations from "../components/ProfileInformations";
import Footer from '../components/footer';
import { ArrowLeft } from 'lucide-react';

const buttonStyles = {
  backContainer: {
    padding: '10px',
    marginTop: '0',
    borderBottom: '1px solid #eee'
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '5px 10px',
    backgroundColor: 'transparent',
    color: '#666',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.3s ease'
  }
};

function Moi() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const access = localStorage.getItem('access_token');
    const refresh = localStorage.getItem('refresh_token');
    if (!access || !refresh) {
      navigate('/connect');
      return;
    }
    (async () => {
      try {
        const res = await fetch('http://localhost:8000/api/users/profile/', {
          headers: {
            'Authorization': `Bearer ${access}`,
            'Accept': 'application/json'
          }
        });
        if (!res.ok) throw new Error(`Unauthorized (${res.status})`);
        const data = await res.json();
        setUserProfile(data);
      } catch (err) {
        console.error('Profile fetch failed:', err);
        setError('Impossible de charger le profil.');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBarC userProfile={{ profile_image: '', username: '' }} />
        <div style={buttonStyles.backContainer}>
          <button style={buttonStyles.backButton}>
            <ArrowLeft className="back-icon" /> Chargement...
          </button>
        </div>
        <div className="flex-grow flex items-center justify-center">Chargement de votre profil…</div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBarC userProfile={{ profile_image: '', username: '' }} />
        <div style={buttonStyles.backContainer}>
          <button onClick={() => navigate('/')} style={buttonStyles.backButton}>
            <ArrowLeft className="back-icon" /> Retour
          </button>
        </div>
        <div className="flex-grow flex items-center justify-center text-red-600">{error}</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBarC userProfile={userProfile || { profile_image: '', username: '' }} />

      <div style={buttonStyles.backContainer}>
        <button
          onClick={() => navigate('/')}
          style={buttonStyles.backButton}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <ArrowLeft className="back-icon" /> Retour aux wilayas
        </button>
      </div>

      <main className="flex-grow profile-page-container">
        <aside className="profile-navigation">
          <Sidebar />
        </aside>

        <section className="profile-content">
          <Suspense fallback={<div>Chargement des informations…</div>}>
            <ProfileInformations userProfile={userProfile} />
          </Suspense>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Moi;
