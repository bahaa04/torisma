import React, { useState, useEffect } from 'react';
import '../styles/PropertyGallery.css';

const PropertyGallery2 = ({ carId }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [carData, setCarData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/listings/cars/${carId}`);
        if (!response.ok) throw new Error('Failed to fetch car data');
        const data = await response.json();
        console.log('Car data:', data); // Debug log
        setCarData(data);
      } catch (error) {
        console.error('Error fetching car data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (carId) {
      fetchCarData();
    }
  }, [carId]);

  const openImage = (image) => {
    setSelectedImage(image);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  if (loading) return <div>Loading photos...</div>;
  if (!carData) return <div>No photos available</div>;

  return (
    <div className="property-gallery-container">
      <div className="property-info">
        <div className="location">
          <h2>{carData.wilaya}</h2>
        </div>
        <div className="type">
          <h3>{carData.manufacture} {carData.model}</h3>
        </div>
      </div>
      <div className="property-gallery">
        <div className="gallery-main">
          <img
            src={carData.photos?.[0]?.photo || "/placeholder.svg"}
            alt="Main car view"
            className="main-image"
            onClick={() => openImage(carData.photos?.[0]?.photo)}
          />
        </div>
        <div className="gallery-grid">
          {carData.photos?.slice(1, 5).map((photo, index) => (
            <img 
              key={index}
              src={photo.photo || "/placeholder.svg"}
              alt={`Car view ${index + 2}`}
              className="grid-image"
              onClick={() => openImage(photo.photo)}
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

export default PropertyGallery2;