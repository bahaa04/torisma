import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/CarProfile.css';

const CarProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/api/listings/cars/${id}/`, { withCredentials: true });
        setCar(response.data);
        setForm(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch car');
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('access_token');
      
      if (id) {
        await axios.put(`http://127.0.0.1:8000/api/listings/cars/${id}/`, form, { 
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      setSaving(false);
      navigate('/voiture-liste');
    } catch (err) {
      setError('Failed to save car');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette voiture?')) return;
    try {
      setDeleting(true);
      const token = localStorage.getItem('access_token');
      
      await axios.delete(`http://127.0.0.1:8000/api/listings/cars/${id}/`, { 
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setDeleting(false);
      navigate('/voiture-liste');
    } catch (err) {
      setError('Failed to delete car');
      setDeleting(false);
    }
  };

  const openImage = (image) => {
    setSelectedImage(image);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  const handlePhotoChange = async (index, event) => {
    event.stopPropagation(); // Prevent image modal from opening
    const file = event.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('photo', file);

      const response = await axios.put(
        `http://localhost:8000/api/listings/cars/${id}/photo/${index}/`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Update the car photos in state
      setCar(prevCar => ({
        ...prevCar,
        photos: prevCar.photos.map((photo, i) => 
          i === index ? { photo: response.data.photo } : photo
        ),
      }));
    } catch (err) {
      setError('Failed to update photo');
    }
  };

  if (loading) return <div className="car-profile-loading">Chargement...</div>;
  if (error) return <div className="car-profile-error">Erreur: {error}</div>;
  if (!form) return null;

  return (
    <div className="car-profile">
      <div className="images-section">
        {(car.photos && car.photos.length > 0 ? car.photos : [{ photo: '/placeholder-car.jpg' }]).map((img, idx) => (
          <div 
            key={idx} 
            className="image-slot"
            onMouseEnter={() => setActivePhotoIndex(idx)}
            onMouseLeave={() => setActivePhotoIndex(null)}
          >
            <img 
              src={img.photo.startsWith('http') ? img.photo : `http://localhost:8000${img.photo}`} 
              alt={`Car ${idx + 1}`} 
              className="slot-img" 
              onClick={() => openImage(img.photo.startsWith('http') ? img.photo : `http://localhost:8000${img.photo}`)}
            />
            {activePhotoIndex === idx && (
              <>
                <input
                  type="file"
                  id={`photo-input-${idx}`}
                  style={{ display: 'none' }}
                  onChange={(e) => handlePhotoChange(idx, e)}
                  accept="image/*"
                />
                <button
                  className="change-photo-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById(`photo-input-${idx}`).click();
                  }}
                >
                  Changer
                </button>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="inputs-container">
        <div className="input-field">
          <label>Status</label>
          <select 
            name="status" 
            value={form.status || 'available'} 
            onChange={handleChange}
            className="status-select"
          >
            <option value="available">Disponible</option>
            <option value="disabled">Indisponible</option>
          </select>
        </div>
        <div className="input-field">
          <label>Marque</label>
          <input name="manufacture" value={form.manufacture || ''} onChange={handleChange} />
        </div>
        <div className="input-field">
          <label>Modèle</label>
          <input name="model" value={form.model || ''} onChange={handleChange} />
        </div>
        <div className="input-field">
          <label>Année</label>
          <input name="manufacturing_year" value={form.manufacturing_year || ''} onChange={handleChange} />
        </div>
        <div className="input-field">
          <label>Ville</label>
          <input name="location" value={form.location || ''} onChange={handleChange} />
        </div>
        <div className="input-field">
          <label>Wilaya</label>
          <input name="wilaya" value={form.wilaya || ''} onChange={handleChange} />
        </div>
        <div className="input-field">
          <label>Nombre de Places</label>
          <input name="seats" value={form.seats || ''} onChange={handleChange} />
        </div>
        <div className="input-field">
          <label>Type de Carburant</label>
          <input name="fuel_type" value={form.fuel_type || ''} onChange={handleChange} />
        </div>
        <div className="input-field">
          <label>Prix</label>
          <input name="price" value={form.price || ''} onChange={handleChange} />
        </div>
        <div className="input-field">
          <label>Description</label>
          <textarea name="description" value={form.description || ''} onChange={handleChange} />
        </div>
      </div>
      <div className="buttons-section">
        <button className="save-btn" onClick={handleSave} disabled={saving}>
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
        <button type="button" className="delete-btn" onClick={handleDelete} disabled={deleting}>
          {deleting ? 'Suppression...' : 'Supprimer'}
        </button>
        <button type="button" className="cancel-btn" onClick={() => navigate('/voiture-liste')}>
          Annuler
        </button>
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

export default CarProfile;
