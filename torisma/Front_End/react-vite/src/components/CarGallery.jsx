import React, { useState, useEffect } from 'react';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

const CarGallery = ({ carId }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        console.log('Fetching images for car:', carId);
        const response = await fetch(`http://127.0.0.1:8000/api/listings/cars/${carId}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API response:', data);

        // Assuming the API returns car data with an images property
        if (data && data.car && data.car.images) {
          setImages(data.car.images.slice(0, 5));
        } else {
          throw new Error('No images found in API response');
        }
      } catch (err) {
        console.error('Error fetching images:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (carId) {
      fetchImages();
    }
  }, [carId]);

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-[400px] bg-gray-100 rounded-lg">
      <div className="text-gray-600">Loading images...</div>
    </div>
  );
  if (error) return <div>Error: {error}</div>;
  if (images.length === 0) return <div>No images available</div>;

  return (
    <div className="relative w-full h-[400px]">
      <div className="relative h-full">
        <img
          src={images[currentImageIndex]}
          alt={`Car image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute inset-0 flex items-center justify-between p-4">
          <button
            onClick={prevImage}
            className="bg-white p-2 rounded-full opacity-75 hover:opacity-100"
          >
            <FaArrowLeft className="text-xl" />
          </button>
          <button
            onClick={nextImage}
            className="bg-white p-2 rounded-full opacity-75 hover:opacity-100"
          >
            <FaArrowRight className="text-xl" />
          </button>
        </div>
      </div>
      <div className="flex justify-center gap-2 mt-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full ${
              currentImageIndex === index ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default CarGallery;
