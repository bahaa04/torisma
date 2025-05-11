import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBarC from '../components/navbar1-connected';
import Sidebar from '../components/Sidebar';
import Footer from '../components/footer';
import TwoCards from '../components/profileCardsHouse';
import '../styles/profileCards.css';
import { ArrowLeft, Loader } from 'lucide-react';
import axios from 'axios';

// API endpoints
const API_BASE_URL = 'http://127.0.0.1:8000';
const API_ENDPOINT = '/api/listings/houses/user/';

function MaisonListe() {
  const navigate = useNavigate();
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchHouses = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        setError('Not authenticated. Please log in.');
        setLoading(false);
        return;
      }

      console.log('Attempting to fetch houses from:', API_BASE_URL + API_ENDPOINT);
      
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
        const houseData = Array.isArray(response.data) ? response.data : response.data.results || [];
        console.log('Parsed house data:', houseData);
        setHouses(houseData);
      } else {
        console.error('Empty or invalid response data');
        setError('Invalid response format from server');
      }
    } catch (err) {
      console.error('Error fetching houses:', err);
      
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
    fetchHouses();
  }, [refreshTrigger]);

  const handleAdd = () => {
    navigate('/add-logement');
  };

  const handleDelete = (id) => {
    setHouses(houses.filter(house => house.id !== id));
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCardClick = (house) => {
    navigate(`/house/${house.id}`);
  };

  // Test data for development when API is unavailable
  const loadTestData = () => {
    const testHouses = [
      {
        id: "test-id",
        owner: "test-owner",
        description: "Maison en très bon état",
        price: "15000.00",
        location: "Centre ville",
        wilaya: "Alger",
        status: "available",
        type: "Apartment",
        rooms: 3,
        created_at: "2024-03-11T19:45:08Z",
        photos: []
      }
    ];
    setHouses(testHouses);
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
          ) : houses.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-gray-500">Vous n'avez pas encore ajouté de logements.</p>
              <button 
                onClick={handleAdd}
                className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Ajouter un logement
              </button>
            </div>
          ) : (
            <div className="h-full overflow-auto">
              <TwoCards 
                items={houses} 
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

export default MaisonListe;
