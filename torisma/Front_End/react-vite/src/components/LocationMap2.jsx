
 
import React from 'react';
import './styles/LocationMap.css';
import map from '../assets/map.jpg'; 

function LocationMap2() {
  return (
    <div className="location-map">
      <h2 className="description-t"><u>Localisation</u></h2>
      <div className="map-container">
      
        <div className="map-placeholder">
          <img
            src={map || "/placeholder.svg"}
            alt="Map of Bab El Zzouar, Alger"
            className="map-image" 
          />
        </div>
      </div>
      <button className="show-on-map-button" onClick={() => window.open('https://www.google.com/maps/place/Bab+Ezzouar,+Algiers/@36.735546,3.1928843,14z/data=!3m1!4b1!4m6!3m5!1s0x128e51ddc622a197:0x9660167b19459873!8m2!3d36.735546!4d3.210393!16s%2Fg%2F121w206s', '_blank', 'noopener,noreferrer')}>
        <i className="fas fa-map-marker-alt"></i> Afficher sur la carte
      </button>
    </div>
  );
}




export default LocationMap2;