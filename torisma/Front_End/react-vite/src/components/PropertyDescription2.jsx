
import React from 'react';
import '../styles/PropertyDescription.css';



const PropertyDescription2 = () => {
  return (
    <div className="description-container">
      <h2 className="description-title"><u>Description</u></h2>
      <div className="description-box">
        <p><span className="icon">🚗</span> <strong>Type:  </strong>  Mercedes Classe C</p>
        <p><span className="icon">⛽</span> <strong>Motorisation: </strong> Essence,Diesel et Hybride Rechargeable</p>
        <p><span className="icon">📊</span> <strong>Puissance: </strong> De 163 à 680 chevaux (selon version)</p>
        <p><span className="icon">©</span> <strong>Consommation: </strong> Variable selon la motorisation </p>
        
        
        <ul>
          <li>Entre 1,0L/100 km pour l’hybride</li>
          <li>Et 7,5L/100 km pour les modèles essence</li>
        </ul>
        <p><span className="icon">📌</span> <strong>Coffre: </strong> 450 litres</p>
      </div>
    </div>
  );
};



export default PropertyDescription2;