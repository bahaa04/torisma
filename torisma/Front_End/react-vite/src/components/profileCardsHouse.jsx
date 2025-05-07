import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/profileCards.css';

export default function TwoCards() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  // Load houses from localStorage whenever it changes
  useEffect(() => {
    const loadHouses = () => {
      const stored = JSON.parse(localStorage.getItem('houses') || '[]');
      setItems(stored);
    };

    loadHouses();
    // Add event listener for storage changes
    window.addEventListener('storage', loadHouses);
    return () => window.removeEventListener('storage', loadHouses);
  }, []);

  const handleAdd = () => {
    navigate('/addhouse');
  };

  return (
    <div className="cards-grid">
      {items.map(item => (
        <div 
          key={item.id} 
          className="photo-card"
          onClick={() => navigate('/house', { state: { item } })}
        >
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
