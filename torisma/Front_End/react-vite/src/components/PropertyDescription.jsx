import React from 'react';
import '../styles/PropertyDescription.css';



const PropertyDescription = () => {
  return (
    <div className="description-container">
      <h2 className="description-title"><u>Description</u></h2>
      <div className="description-box">
        <p><span className="icon">🏡</span> <strong>Nombre des chambres:  </strong> 4 pièces</p>
        <p><span className="icon">📍</span> <strong>Localisation: </strong></p>
        <ul>
          <li> Situé à El Biar, au 5ᵉ étage d’un immeuble bien entretenu</li>
        </ul>
        <p><span className="icon">🛒</span> <strong>Proximité: </strong></p>
        <ul>
          <li>Pharmacies, épiceries, et supermarchés à quelques minutes à pied</li>
        </ul>
        <p><span className="icon">🅿️</span> <strong>Parking: </strong> disponible</p>
        <p><span className="icon">📶</span> <strong>WiFi: </strong> disponible</p>
        <p><span className="icon">📝</span> <strong>détails supplémentaires: </strong></p>
        <ul>
          <li>Appartement lumineux et spacieux avec une vue dégagée sur la ville</li>
        </ul>
      </div>
    </div>
  );
};



export default PropertyDescription;