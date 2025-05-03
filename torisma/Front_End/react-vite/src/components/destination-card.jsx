import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import '../styles/car-card.css'

export default function DestinationCard({ dest, index }) {
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
    e.stopPropagation() 
    setCurrentImageIndex((prev) => (prev + 1) % dest.images.length)
  }

  const prevImage = (e) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + dest.images.length) % dest.images.length)
  }

  const handleIndicatorClick = (e, imgIndex) => {
    e.stopPropagation() 
    setCurrentImageIndex(imgIndex)
  }


  const navigateToDetail = () => {
    navigate('/choose', { 
      state: { 
        wilaya: {
          id: dest.id,
          location: dest.location,
          images: dest.images
        }
      }
    });
  }

  return (
    <div
      className={`car-card ${isVisible ? 'visible' : ''}`}
      onClick={navigateToDetail}
    >
      <div className="car-image-container">
        <div className="carousel">
          <button className="carousel-button prev" onClick={prevImage}>
            <ChevronLeft size={20} />
          </button>
          <div className="carousel-images">
            {dest.images.map((image, imgIndex) => (
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
          {dest.images.map((_, imgIndex) => (
            <span
              key={imgIndex}
              className={`indicator ${imgIndex === currentImageIndex ? 'active' : ''}`}
              onClick={(e) => handleIndicatorClick(e, imgIndex)}
            />
          ))}
        </div>
      </div>
      <div className="car-info">
        <div className="car-location">{dest.location}</div>

      </div>
    </div>
  )
}
