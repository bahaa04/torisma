import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import NavBar1 from '../components/navbar1';
import OptionVoiture from '../components/optionvoiture';
import CarList from '../components/car-list';
import Footer from '../components/footer';

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


export default function CarPage() {
  const { wilaya, id: carId } = useParams();
  const navigate = useNavigate();

  const isDetail = Boolean(carId);
  const param = isDetail ? carId : wilaya;

  const [cars, setCars] = useState([]);
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

        if (isDetail) {
          const response = await fetch(`${baseUrl}/api/listings/cars/${param}/`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setCar({
            id: data.id,
            location: data.location || data.wilaya || '',
            brand: data.manufacture,
            model: data.model,
            year: data.manufacturing_year,
            price: parseFloat(data.price),
            currency: 'DA',
            seats: data.seats,
            fuelType: data.fuel_type,
            images: data.photos?.length
              ? data.photos.map((p) => p.photo)
              : ['/default-car.jpg'],
            description: data.description,
            status: data.status,
            rented_until: data.rented_until,
          });
        } else {
          const formattedWilaya = wilaya.charAt(0).toUpperCase() + wilaya.slice(1).toLowerCase();
          const response = await fetch(
            `${baseUrl}/api/listings/cars/by_wilaya/${formattedWilaya}/`
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setCars(
            data.map((item) => ({
              id: item.id,
              location: item.location || item.wilaya || 'Unknown',
              brand: item.manufacture,
              model: item.model,
              price: parseFloat(item.price),
              currency: 'DA',
              status: item.status,
              images: item.photos?.length
                ? item.photos.map((p) => p.photo)
                : ['/default-car.jpg'],
            }))
          );
        }
      } catch (error) {
        console.error('Error fetching cars:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [param, isDetail, wilaya]);

  if (error) {
    return (
      <>
        <div className="container"></div>
        <NavBar1 />
        <div className="error">Erreur : {error}</div>
        <Footer />
        <div />
      </>
    );
  }

  if (isDetail) {
    if (!car) {
      return (
        <div className="container">
          <div className="error-page">
            <h1>Voiture introuvable</h1>
            <button onClick={() => navigate(-1)} className="back-button">
              <ArrowLeft className="back-icon" /> Retour
            </button>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="container">
          <NavBar1 />
          <div className="car-detail">
            <h2>
              {car.brand} {car.model} ({car.year})
            </h2>
            <div className="image-gallery">
              {car.images.map((src, idx) => (
                <img key={idx} src={src} alt={`${car.brand} ${idx}`} />
              ))}
            </div>
            <p>Localisation : {car.location}</p>
            <p>Places : {car.seats}</p>
            <p>Carburant : {car.fuelType}</p>
            <p>
              Prix : {car.price.toLocaleString()} {car.currency}
            </p>
            <p>
              Statut : {car.status}
              {car.status === 'rented' && car.rented_until && (
                <span>
                  {' '}
                  — Louée jusqu'au{' '}
                  {new Date(car.rented_until).toLocaleDateString('fr-FR')}
                </span>
              )}
            </p>
            {car.description && <p>Description : {car.description}</p>}
            <button onClick={() => navigate(-1)} className="back-button">
              <ArrowLeft className="back-icon" /> Retour
            </button>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar1 />
      <div style={buttonStyles.backContainer}>
        <button
          onClick={() => navigate('/')}
          style={buttonStyles.backButton}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <ArrowLeft className="back-icon" /> Retour aux wilayas
        </button>
      </div>
   <OptionVoiture />
{loading ? (
  <p>Chargement des voitures...</p>
) : cars.length === 0 ? (
  <p
    style={{
      textAlign: 'center',
      marginTop: '20px',
      marginBottom: '100px', // Added margin-bottom to create space
      fontSize: '18px',
      color: '#666',
    }}
  >
    Aucune voiture disponible pour cette wilaya.
  </p>
) : (
  <CarList cars={cars} />
)}
<Footer />
    </>
  );
}