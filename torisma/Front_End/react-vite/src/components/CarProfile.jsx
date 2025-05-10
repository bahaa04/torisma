import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CarProfile.css';

const CarProfile = ({ houseId }) => {
  const navigate = useNavigate();
  const [images, setImages] = useState([null, null, null, null, null]);
  const [wilaya, setWilaya] = useState('');
  const [ville, setVille] = useState('');
  const [availability, setAvailability] = useState('disponible');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [details, setDetails] = useState('');

  const wilayas = [
    "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra",
    "Béchar", "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret",
    "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda",
    "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem",
    "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj",
    "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela",
    "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent",
    "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar", "Ouled Djellal",
    "Béni Abbès", "In Salah", "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Meniaa"
  ];

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
    navigate('/voiture-liste');
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
          <label htmlFor="wilaya">Wilaya</label>
          <select 
            id="wilaya"
            value={wilaya} 
            onChange={e => setWilaya(e.target.value)}
          >
            <option value="">Sélectionner une wilaya</option>
            {wilayas.map((w, index) => (
              <option key={index} value={w}>{w}</option>
            ))}
          </select>
        </div>
        
        <div className="input-field">
          <label htmlFor="ville">Ville</label>
          <input 
            id="ville"
            type="text" 
            value={ville} 
            onChange={e => setVille(e.target.value)} 
            placeholder="Entrez la ville" 
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

export default CarProfile;
