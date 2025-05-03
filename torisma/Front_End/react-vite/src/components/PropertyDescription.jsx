
import React from 'react';
import './styles/PropertyDescription.css';



const PropertyDescription = () => {
  return (
    <div className="description-container">
      <h2 className="description-title"><u>Description</u></h2>
      <div className="description-box">
        <p><span className="icon">🏡</span> <strong>Type:  </strong>  Appartement F4 (4 pièces)</p>
        <p><span className="icon">📍</span> <strong>Localisation: </strong> Situé à El Biar, au 5ᵉ étage d’un immeuble bien entretenu</p>
        <p><span className="icon">🛡️</span> <strong>Sécurité: </strong> Quartier très sécurisé, avec surveillance et environnement calme</p>
        <p><span className="icon">🛒</span> <strong>Proximité: </strong></p>
        <ul>
          <li>Pharmacies, épiceries, et supermarchés à quelques minutes à pied</li>
          <li>Accès facile aux écoles, transports en commun et services essentiels</li>
        </ul>
        <p><span className="icon">🅿️</span> <strong>Parking: </strong> Gratuit</p>
      </div>
    </div>
  );
};



export default PropertyDescription;