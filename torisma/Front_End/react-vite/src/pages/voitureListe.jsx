import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBarC from '../components/navbar1-connected';
import Sidebar from '../components/Sidebar';
import Footer from '../components/footer';
import TwoCards from '../components/profileCardsCar';
import '../styles/profileCards.css';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';

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

function VoitureListe() {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCars = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/listings/cars/user/', { withCredentials: true });
      setCars(Array.isArray(response.data) ? response.data : response.data.results || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch cars');
      setLoading(false);
      console.error('Error fetching cars:', err);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleAdd = () => {
    navigate('/add-voiture');
  };

  const handleDelete = (id) => {
    setCars(cars.filter(car => car.id !== id));
  };

  const handleCardClick = (car) => {
    navigate(`/car/${car.id}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <NavBarC />
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
      
      <main className="flex-grow profile-page-container flex">
        <aside className="profile-navigation"><Sidebar/></aside>
        <section className="flex-1">
          <TwoCards 
            items={cars} 
            onAdd={handleAdd}
            onDelete={handleDelete}
            onCardClick={handleCardClick}
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default VoitureListe;
