import React from 'react';
import '../styles/PropertyDescription.css';

const PropertyDescription2 = () => {
  return (
    <div className="description-container">
      <h2 className="description-title"><u>Description</u></h2>
      <div className="description-box">
        <p><span className="icon">ℹ️</span> <strong>Informations supplémentaires: </strong> Description du véhicule</p>
        <p><span className="icon">📅</span> <strong>Année de fabrication: </strong> 2023</p>
        <p><span className="icon">🪑</span> <strong>Nombre de sièges: </strong> 5</p>
        <p><span className="icon">⛽</span> <strong>Type de carburant: </strong> Essence</p>
      </div>
    </div>
  );
};

export default PropertyDescription2;