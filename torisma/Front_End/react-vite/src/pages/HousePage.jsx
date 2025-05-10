import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import NavBar11 from '../components/navbar11';
import OptionMaison from '../components/optionmaison';
import MaisonList from '../components/maison-list';
import Footer from '../components/footer';


const buttonStyles = {
  backContainer: {
    padding: '40px',
    marginTop: '0',
    borderBottom: '1px solid #eee'
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    backgroundColor: 'transparent',
    color: '#666',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.3s ease'
  }
};

export default function HousePage() {
  const { id, wilaya } = useParams();
  const navigate = useNavigate();

  const isDetail = Boolean(id);
  const param = isDetail ? id : wilaya;

  const [houses, setHouses] = useState([]);
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    if (isDetail) {
      // ─── DETAIL ───
      fetch(`http://127.0.0.1:8000/api/listings/houses/by_wilaya/${param}/`)
        .then(res => {
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
            images: data.photos?.length ? data.photos.map(p => p.photo) : ['/default-house.jpg'],
          });
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    } else {
      // ─── LIST ───
      fetch(`http://127.0.0.1:8000/api/listings/houses/by_wilaya/${encodeURIComponent(param)}/`)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(data => {
          setHouses(
            (data.results || []).map((item, index) => ({
              id: index === 0 ? 1 : index === 1 ? 2 : index === 2 ? 3 : item.id || index + 1, // Assign ID=1 to the first house, ID=2 to the second, and ID=3 to the third
              rooms: item.number_of_rooms,
              price: parseFloat(item.price),
              currency: 'DA',
              location: item.exact_location,
              status: item.status,
              rented_until: item.rented_until,
              images: item.photos?.length ? item.photos.map(p => p.photo) : ['/default-house.jpg'],
              customPath: index === 0 ? '/localisation' : `/house-details/${item.id || index + 1}` // Assign paths based on ID
            }))
          );
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [param, isDetail]);



  if (error) {
    return (
      <>
        <NavBar11 />
        <div className="error">Erreur : {error}</div>
        <Footer />
      </>
    );
  }

  if (isDetail) {
    if (!house) {
      return (
        <>
          <NavBar11 />
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
        <NavBar11 />
        <div className="house-detail">
        <div>
   
        <div style={buttonStyles.backContainer}>
        <button 
         onClick={() => navigate(-1)} 
          style={buttonStyles.backButton}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <ArrowLeft className="back-icon" /> Retour aux maisons
        </button>
      </div>
    </div>
     <h2> &nbsp;&nbsp; &nbsp;&nbsp;  &nbsp;&nbsp;  comming soon....</h2>
    <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/>


          {/* 
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
        
           */}
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar11 />
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
      <OptionMaison />
      <MaisonList houses={houses} /> {/* Pass houses with customPath */}
      <Footer />
    </>
  );
}