import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/profileCards.css';
import { Trash2, Edit, Eye } from 'lucide-react';

// API base URL constants
const API_BASE_URL = 'http://127.0.0.1:8000';
const API_ENDPOINT = '/api/listings/houses/';

export default function TwoCards({ items, onAdd, onDelete, onCardClick }) {
  const navigate = useNavigate();

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Prevent card click when clicking delete
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce logement?')) {
      try {
        console.log(`Attempting to delete house with ID: ${id}`);
        
        // Try primary URL
        try {
          await axios.delete(`${API_BASE_URL}${API_ENDPOINT}${id}/`, {
            withCredentials: true,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });
          console.log('House deleted successfully');
          if (onDelete) onDelete(id);
        } catch (primaryError) {
          console.error('Error with primary delete URL:', primaryError);
          
          // Try fallback URL
          console.log('Trying fallback delete URL...');
          await axios.delete(`http://localhost:8000${API_ENDPOINT}${id}/`, {
            withCredentials: true
          });
          console.log('House deleted successfully with fallback URL');
          if (onDelete) onDelete(id);
        }
      } catch (error) {
        console.error('All delete attempts failed:', error);
        
        // Detailed error logging
        if (error.response) {
          console.error('Error response data:', error.response.data);
          console.error('Error response status:', error.response.status);
          
          // Handle specific error codes
          if (error.response.status === 401 || error.response.status === 403) {
            alert('Erreur d\'authentification. Veuillez vous rese connecter.');
          } else if (error.response.status === 404) {
            alert('Ce logement n\'existe plus ou a déjà été supprimé.');
            if (onDelete) onDelete(id); // Remove from UI if already gone from server
          } else {
            alert(`Erreur lors de la suppression: ${error.response.data.message || 'Erreur inconnue'}`);
          }
        } else if (error.request) {
          console.error('No response received:', error.request);
          alert('Le serveur ne répond pas. Veuillez vérifier votre connexion internet.');
        } else {
          console.error('Error message:', error.message);
          alert(`Erreur lors de la suppression: ${error.message}`);
        }
      }
    }
  };

  const handleEdit = (e, id) => {
    e.stopPropagation(); // Prevent card click when clicking edit
    navigate(`/edit-house/${id}`);
  };

  const handleView = (e, house) => {
    e.stopPropagation();
    if (onCardClick) onCardClick(house);
  };

  const getHouseImageUrl = (house) => {
    if (!house.photos || house.photos.length === 0) {
      return '/placeholder-house.jpg';
    }
    
    const photo = house.photos[0].photo;
    if (!photo) return '/placeholder-house.jpg';
    
    if (photo.startsWith('http')) {
      return photo;
    }
    return `${API_BASE_URL}${photo}`;
  };

  return (
    <div className="cards-grid">
      {items.map(item => (
        <div 
          key={item.id} 
          className="photo-card"
          onClick={() => onCardClick(item)}
        >
          <div className="photo-card-image-wrapper">
            <img 
              src={getHouseImageUrl(item)} 
              alt={`${item.city}, ${item.wilaya}`} 
              className="photo-card-image" 
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = '/placeholder-house.jpg';
              }}
            />
            <div className="house-price">{Number(item.price).toLocaleString()} DA</div>
          </div>
          <div className="photo-card-info">
            <div className="photo-card-name">{item.city}, {item.wilaya}</div>
            <div className="photo-card-details">
              <span>{item.type}</span>
              <span>{item.rooms} pièces</span>
              <span>{item.status === 'available' ? 'Disponible' : 'Loué'}</span>
            </div>
          </div>
          
          <div className="card-actions">

          </div>
        </div>
      ))}
      <div className="add-card" onClick={onAdd}>
        <span className="add-icon">＋</span>
        <span className="add-text">Ajouter un logement</span>
      </div>
    </div>
  );
}