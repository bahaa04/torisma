
 
import React from 'react';
import '../styles/LocationMap.css';
import map from '/map.jpg'; // Assuming you have a map image in your assets folder

function LocationMap() {
  return (
    <div className="location-map">
      <h2 className="description-t"><u>Localisation</u></h2>
      <div className="map-container">
        {/* Placeholder for the map */}
        <div className="map-placeholder">
          <img
            src={map || "/placeholder.svg"}
            alt="Map of El Biar, Alger"
            className="map-image" // Corrected class name
          />
        </div>
      </div>
      <button className="show-on-map-button" onClick={() => window.open('https://www.google.com/maps/place/El+Biar,+Algiers,+Algeria', '_blank', 'noopener,noreferrer')}>
        <i className="fas fa-map-marker-alt"></i> Afficher sur la carte
      </button>
    </div>
  );
}




export default LocationMap;