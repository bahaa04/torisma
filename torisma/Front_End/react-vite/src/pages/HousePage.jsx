import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import NavBar1 from '../components/navbar1';
import NavBarC from '../components/navbar1-connected';
import OptionMaison from '../components/optionmaison';
import MaisonList from '../components/maison-list';
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

export default function HousePage() {
  const { id, wilaya } = useParams();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    setIsAuthenticated(!!accessToken);
  }, []);

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
      const fetchHouseData = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/listings/houses/${param}`);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          setHouse({
            id: data.id,
            rooms: data.number_of_rooms,
            price: parseFloat(data.price),
            currency: 'DA',
            location: data.exact_location,
            status: data.status === 'disabled' ? 'Indisponible' : 'Disponible',
            parking: data.has_parking,
            wifi: data.has_wifi,
            description: data.description,
            rented_until: data.rented_until,
            favorised: data.is_favorised,
            images: data.photos?.length ? data.photos.map(p => p.photo) : ['/default-house.jpg'],
          });
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchHouseData();
    } else {
      // ─── LIST ───
      fetch(`http://127.0.0.1:8000/api/listings/houses/by_wilaya/${encodeURIComponent(param)}/`)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(data => {
          setHouses(
            (data.results || []).map((item) => ({
              id: item.id,
              brand: `${item.rooms} pièces`,  // Using brand for room count
              location: item.exact_location || item.city || 'Unknown',
              price: parseFloat(item.price),
              currency: 'DA',
              status: item.status === 'disabled' ? 'Indisponible' : 'Disponible',
              rented_until: item.rented_until,
              images: item.photos?.length ? item.photos.map(p => p.photo) : ['/default-house.jpg'],
              customPath: `/localisation/${item.id}`
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
        {isAuthenticated ? <NavBarC /> : <NavBar1 />}
        <div className="error">Erreur : {error}</div>
        <Footer />
      </>
    );
  }

  if (isDetail) {
    if (!house) {
      return (
        <>
          {isAuthenticated ? <NavBarC /> : <NavBar1 />}
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
        {isAuthenticated ? <NavBarC /> : <NavBar1 />}
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


          <div className="image-gallery">
            {house.images.map((src, i) => (
              <img key={i} src={src} alt={`Maison ${i + 1}`} className="gallery-image" />
            ))}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      {isAuthenticated ? <NavBarC /> : <NavBar1 />}
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