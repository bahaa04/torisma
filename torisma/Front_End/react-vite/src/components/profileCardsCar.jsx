import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/profileCards.css';
import { Trash2, Edit, Eye } from 'lucide-react';

// API base URL constants
const API_BASE_URL = 'http://127.0.0.1:8000';
const API_ENDPOINT = '/api/listings/cars/';

export default function TwoCards({ items, onAdd, onDelete, onCardClick }) {
  const navigate = useNavigate();

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Prevent card click when clicking delete    
  };

  const handleEdit = (e, id) => {
    e.stopPropagation(); // Prevent card click when clicking edit
    navigate(`/edit-car/${id}`);
  };

  const handleView = (e, car) => {
    e.stopPropagation();
    if (onCardClick) onCardClick(car);
  };

  const getCarImageUrl = (car) => {
    if (!car.photos || car.photos.length === 0) {
      return '/placeholder-car.jpg';
    }
    
    const photo = car.photos[0].photo;
    if (!photo) return '/placeholder-car.jpg';
    
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
              src={getCarImageUrl(item)} 
              alt={`${item.manufacture} ${item.model}`} 
              className="photo-card-image" 
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = '/placeholder-car.jpg';
              }}
            />
            <div className="car-price">{Number(item.price).toLocaleString()} DA</div>
          </div>
          <div className="photo-card-info">
            <div className="photo-card-name">{item.manufacture} {item.model}</div>
            <div className="photo-card-details">
              <span>{item.manufacturing_year}</span>
              <span>{item.fuel_type === 'gasoline' ? 'Essence' : 'Diesel'}</span>
              <span>{item.wilaya}</span>
            </div>
          </div>
          
          <div className="card-actions">
          </div>
        </div>
      ))}
      <div className="add-card" onClick={onAdd}>
        <span className="add-icon">＋</span>
        <span className="add-text">Ajouter une voiture</span>
      </div>
    </div>
  );
}