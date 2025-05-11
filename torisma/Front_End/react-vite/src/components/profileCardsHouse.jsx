import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/profileCards.css';

export default function TwoCards({ items, onAdd, onDelete }) {
  const navigate = useNavigate();

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Prevent card click when clicking delete
    try {
      await axios.delete(`http://localhost:8000/api/listings/houses/${id}/`, {
        withCredentials: true
      });
      if (onDelete) onDelete(id);
    } catch (error) {
      console.error('Error deleting house:', error);
    }
  };

  return (
    <div className="cards-grid">
      {items.map(item => (
        <div 
          key={item.id} 
          className="photo-card"
          onClick={() => navigate(`/house/${item.id}`)}
        >
          <div className="photo-card-image-wrapper">
            <img 
              src={item.photos && item.photos.length > 0 ? 
                (item.photos[0].photo.startsWith('http') ? 
                  item.photos[0].photo : 
                  `http://localhost:8000${item.photos[0].photo}`) 
                : '/placeholder-house.jpg'} 
              alt={item.city + ', ' + item.wilaya} 
              className="photo-card-image" 
            />
          </div>
          <div className="photo-card-name">{item.city}, {item.wilaya}</div>
          <button 
            className="delete-button"
            onClick={(e) => handleDelete(e, item.id)}
          >
            Supprimer
          </button>
        </div>
      ))}
      <div className="add-card" onClick={onAdd}>
        <span className="add-icon">＋</span>
      </div>
    </div>
  );
}