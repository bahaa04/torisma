import React, { useState } from 'react';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

const CarGallery = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
