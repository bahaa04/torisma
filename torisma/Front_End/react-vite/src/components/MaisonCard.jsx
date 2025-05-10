import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import '../styles/car-card.css'

export default function MaisonCard({ house, index, onClick }) {
  const navigate = useNavigate()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
  
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100 * index)

    return () => clearTimeout(timer)
  }, [index])

  const nextImage = (e) => {
    e.stopPropagation() // Prevent card click when clicking carousel buttons
    setCurrentImageIndex((prev) => (prev + 1) % house.images.length)
  }

  const prevImage = (e) => {
    e.stopPropagation() 
    setCurrentImageIndex((prev) => (prev - 1 + house.images.length) % house.images.length)
  }

  const handleIndicatorClick = (e, imgIndex) => {
    e.stopPropagation() // Prevent card click when clicking indicators
    setCurrentImageIndex(imgIndex)
  }

  // Navigate to the localisation page
  const navigateToDetail = () => {
    if (house.customPath) {
      navigate(house.customPath); // Use customPath for navigation
    } else {
      navigate('/localisation'); // Fallback navigation
    }
  }

  return (
    <div
      className={`car-card ${isVisible ? 'visible' : ''}`}
      onClick={onClick} // Use the onClick prop here
    >
      <div className="car-image-container">
        <div className="carousel">
          <button className="carousel-button prev" onClick={prevImage}>
            <ChevronLeft size={20} />
          </button>
          <div className="carousel-images">
            {house.images.map((image, imgIndex) => (
              <div
                key={imgIndex}
                className={`carousel-image ${imgIndex === currentImageIndex ? 'active' : ''}`}
                style={{ backgroundImage: `url(${image})` }}
              />
            ))}
          </div>
          <button className="carousel-button next" onClick={nextImage}>
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="carousel-indicators">
          {house.images.map((_, imgIndex) => (
            <span
              key={imgIndex}
              className={`indicator ${imgIndex === currentImageIndex ? 'active' : ''}`}
              onClick={(e) => handleIndicatorClick(e, imgIndex)}
            />
          ))}
        </div>
      </div>
      
      <div className="car-info">
        <div className="car-location">{house.location}</div>
        {house.rooms !== undefined && (
          <div className="car-rooms">{house.rooms} pièces</div>
        )}
        <div className="car-status">
          Statut : {house.status}
          {house.status === 'rented' && house.rented_until && (
            <span> — Louée jusqu'au {new Date(house.rented_until).toLocaleDateString('fr-FR')}</span>
          )}
        </div>
        <div className="car-price">
          {house.brand} <br />
          {house.model}
        </div>
        <div className="car-price">
          {house.price} {house.currency} <span className="per-day">par jour</span>
        </div>
      </div>
    </div>
  )
}
