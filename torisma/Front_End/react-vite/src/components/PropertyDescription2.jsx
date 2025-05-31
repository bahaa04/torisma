import React, { useState, useEffect } from 'react';
import '../styles/PropertyDescription.css';

const PropertyDescription2 = ({ carId }) => {
  const [carData, setCarData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarData = async () => {
      if (!carId) return;

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/listings/cars/${carId}`);
        if (!response.ok) throw new Error('Failed to fetch car data');
        const data = await response.json();
        console.log('Car description data:', data);
        setCarData(data);
      } catch (error) {
        console.error('Error fetching car data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarData();
  }, [carId]);

  if (loading) return <div>Loading description...</div>;
  if (!carData) return <div>No description available</div>;

  return (
    <div className="description-container">
      <h2 className="description-title"><u>Description</u></h2>
      <div className="description-box">
        <div className="description-item" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="icon">ℹ️</span>
          <p><strong>Informations supplémentaires: </strong> {carData.description || 'Aucune description disponible'}</p>
        </div>
        <div className="description-item" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="icon">📅</span>
          <p><strong>Année de fabrication: </strong> {carData.manufacturing_year}</p>
        </div>
        <div className="description-item" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="icon">🪑</span>
          <p><strong>Nombre de sièges: </strong> {carData.seats}</p>
        </div>
        <div className="description-item" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="icon">⛽</span>
          <p><strong>Type de carburant: </strong> {carData.fuel_type}</p>
        </div>
      </div>
    </div>
  );
};

export default PropertyDescription2;