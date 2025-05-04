import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import NavBar from '../components/navbar1';
import AuthNavBar from '../components/AuthNavBar';
import OptionMaison from '../components/optionmaison';
import MaisonList from '../components/maison-list';
import Footer from '../components/footer';

export default function HousePage() {
  const { id, wilaya } = useParams();
  const navigate = useNavigate();

  const isDetail = Boolean(id);
  const param = isDetail ? id : wilaya;

  const [houses, setHouses] = useState([]);
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated] = useState(!!localStorage.getItem('access_token'));
  const NavBarComponent = isAuthenticated ? AuthNavBar : NavBar;

  useEffect(() => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('access_token');

    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };

    if (isDetail) {
      // ─── DETAIL ───
      fetch(`http://127.0.0.1:8000/api/listings/houses/${param}/`, { headers })
        .then(res => {
          if (res.status === 401) {
            navigate('/connect');
            throw new Error('Please login to view this content');
          }
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(data => {
          setHouse({
            id: data.id,
            rooms: data.number_of_rooms,
            price: parseFloat(data.price),
            currency: 'DA',
            location: data.exact_location,
            parking: data.has_parking,
            wifi: data.has_wifi,
            description: data.description,
            status: data.status,
            rented_until: data.rented_until,
            favorised: data.is_favorised,
            images: data.photos?.length ? data.photos.map(p => p.photo || p.image) : ['/default-house.jpg'],
          });
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    } else {
      // ─── LIST ───
      fetch(`http://127.0.0.1:8000/api/listings/houses/by_wilaya/${encodeURIComponent(param)}/`, { headers })
        .then(res => {
          if (res.status === 401) {
            navigate('/connect');
            throw new Error('Please login to view this content');
          }
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(data => {
          setHouses(
            (data.results || []).map(item => ({
              id: item.id,
              rooms: item.number_of_rooms,
              price: parseFloat(item.price),
              currency: 'DA',
              location: item.exact_location,
              status: item.status,
              rented_until: item.rented_until,
              images: item.photos?.length ? item.photos.map(p => p.photo || p.image) : ['/default-house.jpg'],
            }))
          );
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [param, isDetail, navigate]);

  if (loading) {
    return (
      <>
        <NavBarComponent />
        <div className="loading">Loading houses...</div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavBarComponent />
        <div className="error">Erreur : {error}</div>
        <Footer />
      </>
    );
  }

  if (isDetail) {
    if (!house) {
      return (
        <>
          <NavBarComponent />
          <div className="error-page">
            <h1>Maison introuvable</h1>
            <button onClick={() => navigate(-1)} className="back-button">
              <ArrowLeft className="back-icon" /> Retour
            </button>
          </div>
          <Footer />
        </>
      );
    }

    return (
      <>
        <NavBarComponent />
        <div className="house-detail">
          <h2>{house.rooms} pièces — {house.location}</h2>
          <div className="image-gallery">
            {house.images.map((src, i) => (
              <img key={i} src={src} alt={`Maison ${i + 1}`} />
            ))}
          </div>
          <p>Prix : {house.price.toLocaleString()} {house.currency}</p>
          <p>Parking : {house.parking ? 'Oui' : 'Non'}</p>
          <p>Wi‑Fi : {house.wifi ? 'Oui' : 'Non'}</p>
          <p>Statut : {house.status}{house.status === 'rented' && house.rented_until && (
            <span> — Louée jusqu'au {new Date(house.rented_until).toLocaleDateString('fr-FR')}</span>
          )}</p>
          {house.description && <p>Description : {house.description}</p>}
          <button onClick={() => navigate(-1)} className="back-button">
            <ArrowLeft className="back-icon" /> Retour
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBarComponent />
      <div className="back-to-wilayas">
        <button onClick={() => navigate('/')} className="back-button">
          <ArrowLeft className="back-icon" /> Retour aux wilayas
        </button>
      </div>
      <OptionMaison />
      <MaisonList houses={houses} />
      <Footer />
    </>
  );
}
