import React from 'react';
import '../styles/PropertyDescription.css';

const PropertyDescription = () => {
  return (
    <div className="description-container">
      <h2 className="description-title"><u>Description</u></h2>
      <div className="description-box">
        <div className="description-item">
          <span className="icon">🏡</span>
          <p><strong>Type: </strong> Appartement F4 (4 pièces)</p>
        </div>
        <div className="description-item">
          <span className="icon">📍</span>
          <p><strong>Localisation: </strong> Situé à El Biar, au 5ᵉ étage d’un immeuble bien entretenu</p>
        </div>
        <div className="description-item">
          <span className="icon">🛡️</span>
          <p><strong>Sécurité: </strong> Quartier très sécurisé, avec surveillance et environnement calme</p>
        </div>
        <div className="description-item">
          <span className="icon">🛒</span>
          <p><strong>Proximité: </strong></p>
        </div>
        <ul>
          <li>Pharmacies, épiceries, et supermarchés à quelques minutes à pied</li>
          <li>Accès facile aux écoles, transports en commun et services essentiels</li>
        </ul>
        <div className="description-item">
          <span className="icon">🅿️</span>
          <p><strong>Parking: </strong> Gratuit</p>
        </div>
      </div>
    </div>
  );
};

export default PropertyDescription;