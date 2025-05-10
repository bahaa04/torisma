import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HouseProfile.css';

const HouseProfile = ({ houseId }) => {
  const navigate = useNavigate();
  // Five slots: one large + four small
  const [images, setImages] = useState([null, null, null, null, null]);
  const [rooms, setRooms] = useState(1);
  const [availability, setAvailability] = useState('disponible');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [wifi, setWifi] = useState(false);
  const [parking, setParking] = useState(false);
  const [details, setDetails] = useState('');

  const onImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImages(prev => {
        const copy = [...prev];
        copy[index] = url;
        return copy;
      });
    }
  };

  const handleNavigation = () => {
    navigate('/maison-liste');
  };

  return (
    <div className="house-profile">
      <div className="images-section">
        {images.map((img, idx) => (
          <label key={idx} className="image-slot">
            {img ? <img src={img} alt={`House ${idx + 1}`} className="slot-img" /> : <span>＋</span>}
            <input
              type="file"
              accept="image/*"
              onChange={e => onImageChange(idx, e)}
              className="image-input"
            />
          </label>
        ))}
      </div>

      <div className="inputs-container">
        <div className="input-field">
          <label htmlFor="rooms">Nombre des chambres</label>
          <input 
            id="rooms"
            type="number" 
            value={rooms} 
            onChange={e => setRooms(e.target.value)} 
            min="1" 
          />
        </div>
        <div className="input-field">
          <label htmlFor="availability">Disponibilité</label>
          <select 
            id="availability"
            value={availability} 
            onChange={e => setAvailability(e.target.value)}
          >
            <option value="disponible">Disponible</option>
            <option value="indisponible">Indisponible</option>
          </select>
        </div>
        <div className="input-field">
          <label htmlFor="price">Prix</label>
          <input 
            id="price"
            type="text" 
            value={price} 
            onChange={e => setPrice(e.target.value)} 
            placeholder="Entrez le prix" 
          />
        </div>
        <div className="input-field">
          <label htmlFor="location">Location GPS</label>
          <input 
            id="location"
            type="text" 
            value={location} 
            onChange={e => setLocation(e.target.value)} 
            placeholder="Latitude, Longitude" 
          />
        </div>
        <div className="checkbox-field">
          <input 
            id="wifi" 
            type="checkbox" 
            checked={wifi} 
            onChange={e => setWifi(e.target.checked)} 
          />
          <label htmlFor="wifi">WiFi</label>
        </div>
        <div className="checkbox-field">
          <input 
            id="parking" 
            type="checkbox" 
            checked={parking} 
            onChange={e => setParking(e.target.checked)} 
          />
          <label htmlFor="parking">Parking</label>
        </div>
        <div className="input-field">
          <label>Détails supplémentaires</label>
          <textarea value={details} onChange={e => setDetails(e.target.value)} placeholder="Entrez des détails supplémentaires" />
        </div>
      </div>

      <div className="buttons-section">
        <button className="save-btn" onClick={handleNavigation}>Sauvegarder</button>
        <button type="button" className="cancel-btn" onClick={handleNavigation}>Annuler</button>
        <button type="button" className="delete-btn" onClick={handleNavigation}>Supprimer</button>
      </div>
    </div>
  );
};

export default HouseProfile;
