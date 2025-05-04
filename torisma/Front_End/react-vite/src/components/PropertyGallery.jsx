
import React from 'react';
import '../styles/PropertyGallery.css';
import app1 from '/app1.jpg';
import app2 from '/app2.jpg';
import app3 from '/app3.jpg';
import app4 from '/app4.jpg';
import app5 from '/app5.jpg';

function PropertyGallery({ images }) {
  return (
    <div className="property-gallery-container">
      <div className="property-info">
        <p className="location"><h2>El Biar, Alger</h2></p>
        <p className="type"><h3>Appartement F4</h3></p>
      </div>
      <div className="property-gallery">
        <div className="gallery-main">
          <img src={app1 || "/placeholder.svg"} alt="Living room" className="main-image" />
        </div>
        <div className="gallery-grid">
          <img src={app2 || "/placeholder.svg"} alt="Kitchen" className="grid-image" />
          <img src={app4 || "/placeholder.svg"} alt="Bedroom" className="grid-image" />
          <img src={app3 || "/placeholder.svg"} alt="Bathroom" className="grid-image" />
          <img src={app5 || "/placeholder.svg"} alt="Hallway" className="grid-image" />
        </div>
      </div>
    </div>
  );
}

export default PropertyGallery;