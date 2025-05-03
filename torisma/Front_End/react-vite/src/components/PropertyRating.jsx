
import React, { useState } from 'react';
import './styles/PropertyRating.css';
import laurelLeftImage from '../assets/laurel_left.png'; // Import your left laurel image
import laurelRightImage from '../assets/laurel_right.png'; // Import your right laurel image

function PropertyRating() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
    console.log(`Rating submitted: ${selectedRating} stars`);
  };

  const handleStarHover = (hoveredRating) => {
    setHoverRating(hoveredRating);
  };

  const handleStarMouseLeave = () => {
    setHoverRating(0);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= (hoverRating || rating) ? 'filled' : 'empty'}`}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => handleStarHover(i)}
          onMouseLeave={handleStarMouseLeave}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="property-rating">
      <div className="laurels-row">
        <div className="laurel-left">
          <img src={laurelLeftImage} alt="Left Laurel" className="laurel-image" />
        </div>
        <div className="rating-container">
          <div className="rating-value">{rating > 0 ? `${rating.toFixed(2).replace('.', ',')}` : '0,00'}</div>
          <div className="star-container">{renderStars()}</div>
        </div>
        <div className="laurel-right">
          <img src={laurelRightImage} alt="Right Laurel" className="laurel-image" />
        </div>
      </div>
    </div>
  );
}

export default PropertyRating;