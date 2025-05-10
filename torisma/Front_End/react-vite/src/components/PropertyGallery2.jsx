import React from 'react';
import '../styles/PropertyGallery.css';
import v1 from '/v1.jpg';
import v2 from '/v2.jpg';
import v3 from '/v3.jpg';
import v4 from '/v4.jpg';
import v5 from '/v5.jpg';

function PropertyGallery2({ onPhotoClick }) {
  const images = [v1, v2, v3, v4, v5];

  return (
    <div className="property-gallery-container">
      <div className="property-info">
        <p className="location"><h2>Bab EL ZZOUAR, Alger</h2></p>
        <p className="type"><h3>Mercedes Classe C</h3></p>
      </div>
      <div className="property-gallery">
        <div className="gallery-main">
          <img
            src={v1 || "/placeholder.svg"}
            alt="Main car view"
            className="main-image"
            onClick={() => onPhotoClick(v1)}
          />
        </div>
        <div className="gallery-grid">
          <img 
            src={v2 || "/placeholder.svg"} 
            alt="Car view 2" 
            className="grid-image"
            onClick={() => onPhotoClick(v2)}
          />
          <img 
            src={v4 || "/placeholder.svg"} 
            alt="Car view 3" 
            className="grid-image"
            onClick={() => onPhotoClick(v4)}
          />
          <img 
            src={v3 || "/placeholder.svg"} 
            alt="Car view 4" 
            className="grid-image"
            onClick={() => onPhotoClick(v3)}
          />
          <img 
            src={v5 || "/placeholder.svg"} 
            alt="Car view 5" 
            className="grid-image"
            onClick={() => onPhotoClick(v5)}
          />
        </div>
      </div>
    </div>
  );
}

export default PropertyGallery2;