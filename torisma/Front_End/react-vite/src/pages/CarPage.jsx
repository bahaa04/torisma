import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import NavBar from '../components/navbar1';
import OptionVoiture from '../components/optionvoiture';
import CarList from '../components/car-list';
import Footer from '../components/footer';

export default function CarPage() {
  // grab both params (one will be undefined)
  const { wilaya, id: carId } = useParams();
  const navigate = useNavigate();

  // are we showing detail (carId) or a list (wilaya)?
  const isDetail = Boolean(carId);
  const param = isDetail ? carId : wilaya;

  const [cars, setCars] = useState([]);
  const [car, setCar]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    if (isDetail) {
      // ─── DETAIL ───
      fetch(`http://127.0.0.1:8000/api/listings/cars/${param}/`)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(data => {
          setCar({
            id:         data.id,
            location:   data.location || data.la_wilaya,
            brand:      data.manufacture,
            model:      data.model,
            year:       data.manufacturing_year,
            price:      parseFloat(data.price),
            currency:   'DA',
            seats:      data.seats,
            fuelType:   data.fuel_type,
            images:     data.photos?.length
                         ? data.photos.map(p => p.photo)
                         : ['/default-car.jpg'],
            description:data.description,
            status:     data.status,
            rented_until: data.rented_until,
          });
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));

    } else {
      // ─── LIST FOR WILAYA ───
      fetch(`http://127.0.0.1:8000/api/listings/cars/by_wilaya/${encodeURIComponent(param)}/`)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(data => {
          setCars(
            (data.results || []).map(item => ({
              id:       item.id,
              location: item.location || item.la_wilaya,
              brand:    item.manufacture,
              model:    item.model,
              price:    parseFloat(item.price),
              currency: 'DA',
              status:   item.status,
              rented_until: item.rented_until,
              images:   item.photos?.length
                          ? item.photos.map(p => p.photo)
                          : ['/default-car.jpg'],
            }))
          );
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [param, isDetail]);

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="loading">Chargement des voitures…</div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavBar />
        <div className="error">Erreur : {error}</div>
        <Footer />
      </>
    );
  }

  if (isDetail) {
    if (!car) {
      return (
        <div className="error-page">
          <h1>Voiture introuvable</h1>
          <button onClick={() => navigate(-1)} className="back-button">
            <ArrowLeft className="back-icon" /> Retour
          </button>
        </div>
      );
    }

    return (
      <>
        <NavBar />
        <div className="car-detail">
          <h2>
            {car.brand} {car.model} ({car.year})
          </h2>
          <div className="image-gallery">
            {car.images.map((src, idx) => (
              <img key={idx} src={src} alt={`${car.brand} ${idx}`} />
            ))}
          </div>
          <p>Localisation : {car.location}</p>
          <p>Places : {car.seats}</p>
          <p>Carburant : {car.fuelType}</p>
          <p>Prix : {car.price.toLocaleString()} {car.currency}</p>
          <p>Statut : {car.status}{car.status === 'rented' && car.rented_until && (
            <span> — Louée jusqu'au {new Date(car.rented_until).toLocaleDateString('fr-FR')}</span>
          )}</p>
          {car.description && <p>Description : {car.description}</p>}
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
      <NavBar />
      <div className="back-to-wilayas">
        <button onClick={() => navigate('/')} className="back-button">
          <ArrowLeft className="back-icon" /> Retour aux wilayas
        </button>
      </div>
      <OptionVoiture />
      <CarList cars={cars} />
      <Footer />
    </>
  );
}
