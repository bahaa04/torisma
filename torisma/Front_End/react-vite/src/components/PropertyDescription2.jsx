import React from 'react';
import '../styles/PropertyDescription.css';



const PropertyDescription2 = () => {
  return (
    <div className="description-container">
      <h2 className="description-title"><u>Description</u></h2>
      <div className="description-box">
        <p><span className="icon">🚗</span> <strong>fabrication:  </strong>  Mercedes Classe C</p>
        <p><span className="icon">🚘</span> <strong>modèle: </strong> 2023</p>
        <p><span className="icon">⛽</span> <strong>Motorisation: </strong> Essence,Diesel et Hybride Rechargeable</p>
        <p><span className="icon">💺</span> <strong>places: </strong> 5</p>
        <p><span className="icon">📝</span> <strong>détails supplémentaires: </strong></p>
        
      </div>
    </div>
  );
};



export default PropertyDescription2;