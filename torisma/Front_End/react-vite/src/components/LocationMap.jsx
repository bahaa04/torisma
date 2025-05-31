import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/LocationMap.css';
import map from '/map.jpg'; // Keep default map as fallback

function LocationMap() {
  const { id } = useParams();  // Get id from URL params
  const [houseData, setHouseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHouseData = async () => {
      console.log('Fetching location data for id:', id); // Debug log
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/listings/houses/${id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log('Location data received:', data); // Debug log
        setHouseData(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHouseData();
  }, [id]);

  const openMapInNewTab = () => {
    if (houseData?.gps_location) {
      window.open(houseData.gps_location, '_blank', 'noopener,noreferrer');
    }
  };

  const extractMapCoordinates = (url) => {
    try {
      // Extract coordinates from Google Maps URL
      const match = url.match(/@(-?\d+\.\d+,\d+\.\d+)/);
      return match ? match[1] : null;
    } catch (err) {
      console.error('Error parsing map URL:', err);
      return null;
    }
  };

  const getStaticMapUrl = (gpsUrl) => {
    const coords = extractMapCoordinates(gpsUrl);
    if (coords) {
      return `https://maps.googleapis.com/maps/api/staticmap?center=${coords}&zoom=15&size=600x400&maptype=roadmap&markers=color:red%7C${coords}&key=YOUR_GOOGLE_MAPS_API_KEY`;
    }
    return null;
  };

  if (loading) return <div>Loading map...</div>;
  if (error) return <div>Error loading map: {error}</div>;
  if (!houseData) return <div>No location data available</div>;

  return (
    <div className="location-map">
      <h2 className="description-t"><u>Localisation</u></h2>
      <div className="map-container" onClick={openMapInNewTab} style={{ cursor: 'pointer' }}>
        {houseData?.gps_location ? (
          <img
            src={getStaticMapUrl(houseData.gps_location) || map}
            alt="Property location map"
            className="map-image"
            style={{ width: '100%', height: '400px', objectFit: 'cover' }}
          />
        ) : (
          <div className="map-placeholder">
            <img src={map} alt="Default map" className="map-image" />
          </div>
        )}
      </div>
    </div>
  );
}

export default LocationMap;