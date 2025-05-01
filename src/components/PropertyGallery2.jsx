import React from 'react';
import './styles/PropertyGallery.css';
import v1 from '../assets/v1.jpg';
import v2 from '../assets/v2.jpg';
import v3 from '../assets/v3.jpg';
import v4 from '../assets/v4.jpg';
import v5 from '../assets/v5.jpg';

function PropertyGallery2({ images }) {
  return (
    <div className="property-gallery-container">
      <div className="property-info">
        <p className="location"><h2>Bab EL ZZOUAR, Alger</h2></p>
        <p className="type"><h3>Mercedes Classe C</h3></p>
      </div>
      <div className="property-gallery">
        <div className="gallery-main">
          <img src={v1 || "/placeholder.svg"} alt="Living room" className="main-image" />
        </div>
        <div className="gallery-grid">
          <img src={v2 || "/placeholder.svg"} alt="Kitchen" className="grid-image" />
          <img src={v4 || "/placeholder.svg"} alt="Bedroom" className="grid-image" />
          <img src={v3 || "/placeholder.svg"} alt="Bathroom" className="grid-image" />
          <img src={v5 || "/placeholder.svg"} alt="Hallway" className="grid-image" />
        </div>
      </div>
    </div>
  );
}

export default PropertyGallery2;