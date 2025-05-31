import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PropertyRating.css';
import laurelLeftImage from '/laurel_left.png';
import laurelRightImage from '/laurel_right.png';

function PropertyRating({ type, itemId }) {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  // Add authentication check effect
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setIsLoggedIn(false);
      setIsProfileLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch('http://localhost:8000/api/users/profile/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
        });
        if (!res.ok) throw new Error(`Unauthorized (${res.status})`);
        const data = await res.json();
        setUserProfile(data);
        setIsLoggedIn(true);
      } catch (err) {
        console.error('Profile fetch failed:', err);
        setIsLoggedIn(false);
      } finally {
        setIsProfileLoading(false);
      }
    })();
  }, [navigate]);

  const handleStarClick = async (selectedRating) => {
    if (!isLoggedIn) {
      navigate('/connect');
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/listings/rate/${type}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          rating: selectedRating,
          [`${type}_id`]: itemId
        })
      });

      if (!response.ok) throw new Error('Failed to submit rating');
      const data = await response.json();
      
      // Update the display with new rating data
      setRating(data.average);
      setTotalRatings(data.rating_count);
    } catch (error) {
      console.error('Rating submission error:', error);
    }
  };

  // Add useEffect to fetch current rating
  useEffect(() => {
    const fetchRating = async () => {
      if (!itemId) return;

      try {
        console.log(`Fetching rating for ${type} ${itemId}`);
        const response = await fetch(`http://127.0.0.1:8000/api/listings/${type}/${itemId}/rating/`);
        
        if (!response.ok) throw new Error('Failed to fetch rating');
        const data = await response.json();
        console.log('Rating data:', data);
        
        setRating(data.average || 0);
        setTotalRatings(data.rating_count || 0);
      } catch (error) {
        console.error('Error fetching rating:', error);
      }
    };

    fetchRating();
  }, [itemId, type]);

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
          className={`star ${i <= (hoverRating || rating) ? 'filled' : 'empty'} ${!isLoggedIn ? 'disabled' : ''}`}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => isLoggedIn && handleStarHover(i)}
          onMouseLeave={() => isLoggedIn && handleStarMouseLeave()}
          style={{ cursor: isLoggedIn ? 'pointer' : 'not-allowed' }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  if (isProfileLoading) {
    return <div className="property-rating">Chargement...</div>;
  }

  return (
    <div className="property-rating">
      <div className="laurels-row">
        <div className="laurel-left">
          <img src={laurelLeftImage} alt="Left Laurel" className="laurel-image" />
        </div>
        <div className="rating-container">
          <div className="rating-value">{rating > 0 ? `${rating.toFixed(2).replace('.', ',')}` : '0,00'}</div>
          <div className="star-container">{renderStars()}</div>
          <div className="rating-text">
            {rating > 0 ? `${rating.toFixed(1)} ★ • ${totalRatings} évaluations` : 'Pas encore évalué'}
          </div>
        </div>
        <div className="laurel-right">
          <img src={laurelRightImage} alt="Right Laurel" className="laurel-image" />
        </div>
      </div>
    </div>
  );
}

export default PropertyRating;