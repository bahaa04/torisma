import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBarC from '../components/navbar1-connected';
import Sidebar from '../components/Sidebar';
import Footer from '../components/footer';
import TwoCards from '../components/profileCardsCar';
import '../styles/profileCards.css';
import { ArrowLeft, Loader } from 'lucide-react';
import axios from 'axios';

// Try both endpoint formats, with better error logging
const API_BASE_URL = 'http://127.0.0.1:8000'; // Base URL for API
const API_ENDPOINT = '/api/listings/cars/user/';

function VoitureListe() {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchCars = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('access_token'); // Get the JWT token
      
      if (!token) {
        setError('Not authenticated. Please log in.');
        setLoading(false);
        return;
      }

      console.log('Attempting to fetch cars from:', API_BASE_URL + API_ENDPOINT);
      
      const response = await axios.get(API_BASE_URL + API_ENDPOINT, { 
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('API Response:', response);
      
      if (response.data) {
        const carData = Array.isArray(response.data) ? response.data : response.data.results || [];
        console.log('Parsed car data:', carData);
        setCars(carData);
      } else {
        console.error('Empty or invalid response data');
        setError('Invalid response format from server');
      }
    } catch (err) {
      console.error('Error fetching cars:', err);
      
      // Detailed error logging
      if (err.response) {
        console.error('Error response data:', err.response.data);
        console.error('Error response status:', err.response.status);
        console.error('Error response headers:', err.response.headers);
        
        if (err.response.status === 401) {
          setError('Authentication failed. Please log in again.');
        } else {
          setError(`Server error: ${err.response.status} - ${err.response.data?.error || err.response.data?.message || 'Unknown error'}`);
        }
      } else if (err.request) {
        console.error('Error request:', err.request);
        setError('No response received from the server. Please check if the API server is running.');
      } else {
        console.error('Error message:', err.message);
        setError(`Request error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [refreshTrigger]);

  const handleAdd = () => {
    navigate('/add-voiture');
  };

  const handleDelete = (id) => {
    setCars(cars.filter(car => car.id !== id));
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCardClick = (car) => {
    navigate(`/car/${car.id}`);
  };

  // Test data for development when API is unavailable
  const loadTestData = () => {
    const testCars = [
      {
        id: "28a7504d-7a3d-4b6d-ae2b-d3488615efa8",
        owner: "df006098-e4a7-47f8-84f7-680eeda592b9",
        description: "Voiture en très bon état",
        price: "8000.00",
        location: "Centre ville",
        wilaya: "Alger",
        status: "available",
        manufacture: "dsgz",
        model: "dzgzeg",
        manufacturing_year: 2005,
        seats: 5,
        fuel_type: "gasoline",
        created_at: "2025-05-11T19:45:08Z",
        photos: []
      }
    ];
    setCars(testCars);
    setError(null);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBarC />
      <div style={{
        padding: '10px',
        marginTop: '0',
        borderBottom: '1px solid #eee'
      }}>
        <button 
          onClick={() => navigate('/')} 
          style={{
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
          }}
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
        <aside className="profile-navigation">
          <Sidebar/>
        </aside>
        <section className="flex-1 p-4 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              {error && (
                <button 
                  onClick={loadTestData}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 transition-colors"
                >
                  Charger données de test
                </button>
              )}
              
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <Loader className="animate-spin h-8 w-8 text-blue-500" />
            </div>
          ) : error ? (
            <div className="text-center p-8">
              <p className="text-red-500 mb-2">{error}</p>
              <div className="bg-gray-100 p-4 rounded-md text-left mb-4 max-w-lg mx-auto">
                <h3 className="font-semibold mb-2">Solutions possibles:</h3>
                <ul className="list-disc pl-5 text-sm">
                  <li>Vérifiez que le serveur API est en cours d'exécution sur http://127.0.0.1:8000</li>
                  <li>Assurez-vous que les cookies d'authentification sont correctement configurés</li>
                  <li>Vérifiez les paramètres CORS sur le serveur backend</li>
                  <li>Essayez de vous reconnecter à votre compte</li>
                </ul>
              </div>
              <button 
                onClick={handleRefresh}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Réessayer
              </button>
            </div>
          ) : cars.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-gray-500">Vous n'avez pas encore ajouté de voitures.</p>
              <button 
                onClick={handleAdd}
                className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Ajouter une voiture
              </button>
            </div>
          ) : (
            <div className="h-full overflow-auto">
              <TwoCards 
                items={cars} 
                onAdd={handleAdd}
                onDelete={handleDelete}
                onCardClick={handleCardClick}
              />
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default VoitureListe;