import React from 'react';
import { useNavigate } from 'react-router-dom';

const MaisonList = ({ houses }) => {
  const navigate = useNavigate();

  const handleCardClick = (house) => {
    // Navigate to a specific page based on the house's custom path or ID
    navigate(house.customPath || `/house/${house.id}`);
  };

  return (
    <div className="maison-list">
      {houses.map((house) => (
        <MaisonCard
          key={house.id}
          house={house}
          customPath={house.customPath}
          onClick={() => handleCardClick(house)}
          style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '16px',
            margin: '8px',
            cursor: 'pointer',
          }}
        />
      ))}
    </div>
  );
};

export default MaisonList;