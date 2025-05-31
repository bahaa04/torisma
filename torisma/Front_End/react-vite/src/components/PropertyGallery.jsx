import React, { useState, useEffect } from 'react';
import '../styles/PropertyGallery.css';

const PropertyGallery = ({ id }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [houseData, setHouseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError('No house ID provided');
      setLoading(false);
      return;
    }

    const fetchHouseData = async () => {
      console.log('Fetching data for id:', id);
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/listings/houses/${id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log('House data received:', data);
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

  const openImage = (image) => {
    setSelectedImage(image);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  if (loading) return <div className="loading">Loading images...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!houseData) return <div>No data available</div>;

  const images = houseData.photos.map(photo => photo.photo);
  const mainImage = images[0] || "/placeholder.svg";
  const gridImages = images.slice(1);

  return (
    <div className="property-gallery-container">
      <div className="property-info">
        <p className="location"><h2>{houseData.wilaya}, {houseData.city}</h2></p>
      </div>
      <div className="property-gallery">
        <div className="gallery-main">
          <img
            src={mainImage}
            alt="Main view"
            className="main-image"
            onClick={() => openImage(mainImage)}
          />
        </div>
        <div className="gallery-grid">
          {gridImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`View ${index + 2}`}
              className="grid-image"
              onClick={() => openImage(image)}
            />
          ))}
        </div>
      </div>

      {selectedImage && (
        <div className="modal" onClick={closeImage}>
          <div className="modal-content">
            <span className="close-button" onClick={closeImage}>&times;</span>
            <img src={selectedImage} alt="Selected" className="modal-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyGallery;