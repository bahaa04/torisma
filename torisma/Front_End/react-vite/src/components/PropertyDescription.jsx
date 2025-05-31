import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/PropertyDescription.css';

const PropertyDescription = () => {
  const { id } = useParams();
  const [houseData, setHouseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHouseData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/listings/houses/${id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setHouseData(data);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHouseData();
  }, [id]);

  if (loading) return <div>Loading description...</div>;
  if (!houseData) return <div>No description available</div>;

  return (
    <div className="description-container">
      <h2 className="description-title"><u>Description</u></h2>
      <div className="description-box">
        <div className="description-item">
          <span className="icon">ℹ️</span>
          <p><strong>Informations supplémentaires: </strong> {houseData.description}</p>
        </div>
        <div className="description-item">
          <span className="icon">🅿️</span>
          <p><strong>Parking: </strong> {houseData.has_parking ? 'Disponible' : 'Non disponible'}</p>
        </div>
        <div className="description-item">
          <span className="icon">📶</span>
          <p><strong>WiFi: </strong> {houseData.has_wifi ? 'Disponible' : 'Non disponible'}</p>
        </div>
        <div className="description-item">
          <span className="icon">🛏️</span>
          <p><strong>Nombre de chambres: </strong> {houseData.rooms}</p>
        </div>
      </div>
    </div>
  );
};

export default PropertyDescription;