import React from 'react';
import '../styles/PropertyDescription.css';

const PropertyDescription = () => {
  return (
    <div className="description-container">
      <h2 className="description-title"><u>Description</u></h2>
      <div className="description-box">
        <div className="description-item">
          <span className="icon">ℹ️</span>
          <p><strong>Informations supplémentaires: </strong> Description du logement</p>
        </div>
        <div className="description-item">
          <span className="icon">🅿️</span>
          <p><strong>Parking: </strong> Disponible</p>
        </div>
        <div className="description-item">
          <span className="icon">📶</span>
          <p><strong>WiFi: </strong> Disponible</p>
        </div>
        <div className="description-item">
          <span className="icon">🛏️</span>
          <p><strong>Nombre de chambres: </strong> 4</p>
        </div>
      </div>
    </div>
  );
};

export default PropertyDescription;