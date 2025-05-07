import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/profileCards.css';

export default function TwoCards() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  // Load cars from localStorage whenever it changes
  useEffect(() => {
    const loadCars = () => {
      const stored = JSON.parse(localStorage.getItem('cars') || '[]');
      setItems(stored);
    };

    loadCars();
    // Add event listener for storage changes
    window.addEventListener('storage', loadCars);
    return () => window.removeEventListener('storage', loadCars);
  }, []);

  const handleAdd = () => {
    navigate('/addcar');
  };

  return (
    <div className="cards-grid">
      {items.map(item => (
        <div key={item.id} className="photo-card">
          <div className="photo-card-image-wrapper">
            <img src={item.src} alt={item.name} className="photo-card-image" />
          </div>
          <div className="photo-card-name">{item.name}</div>
        </div>
      ))}
      <div className="add-card" onClick={handleAdd}>
        <span className="add-icon">＋</span>
      </div>
    </div>
  );
}
