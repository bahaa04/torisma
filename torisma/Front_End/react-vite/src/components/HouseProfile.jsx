import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/HouseProfile.css';

const HouseProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [house, setHouse] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(null);

  useEffect(() => {
    const fetchHouse = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/api/listings/houses/${id}/`, { withCredentials: true });
        setHouse(response.data);
        setForm(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch house');
        setLoading(false);
      }
    };
    fetchHouse();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('access_token');
      
      if (id) {
        await axios.put(`http://127.0.0.1:8000/api/listings/houses/${id}/`, form, { 
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      setSaving(false);
      navigate('/maison-liste');
    } catch (err) {
      setError('Failed to save house');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette maison?')) return;
    try {
      setDeleting(true);
      const token = localStorage.getItem('access_token');
      
      await axios.delete(`http://127.0.0.1:8000/api/listings/houses/${id}/`, { 
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setDeleting(false);
      navigate('/maison-liste');
    } catch (err) {
      setError('Failed to delete house');
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
    event.stopPropagation();
    const file = event.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('photo', file);

      const response = await axios.put(
        `http://localhost:8000/api/listings/houses/${id}/photo/${index}/`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setHouse(prevHouse => ({
        ...prevHouse,
        photos: prevHouse.photos.map((photo, i) => 
          i === index ? { photo: response.data.photo } : photo
        ),
      }));
    } catch (err) {
      setError('Failed to update photo');
    }
  };

  if (loading) return <div className="house-profile-loading">Chargement...</div>;
  if (error) return <div className="house-profile-error">Erreur: {error}</div>;
  if (!form) return null;

  return (
    <div className="house-profile">
      <div className="images-section">
        {(house.photos && house.photos.length > 0 ? house.photos : [{ photo: '/placeholder-house.jpg' }]).map((img, idx) => (
          <div 
            key={idx} 
            className="image-slot"
            onMouseEnter={() => setActivePhotoIndex(idx)}
            onMouseLeave={() => setActivePhotoIndex(null)}
          >
            <img 
              src={img.photo.startsWith('http') ? img.photo : `http://localhost:8000${img.photo}`} 
              alt={`House ${idx + 1}`} 
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
          <label>Ville</label>
          <input name="city" value={form.city || ''} onChange={handleChange} />
        </div>
        <div className="input-field">
          <label>Wilaya</label>
          <input name="wilaya" value={form.wilaya || ''} onChange={handleChange} />
        </div>
        <div className="input-field">
          <label>Localisation</label>
          <input name="location" value={form.location || ''} onChange={handleChange} />
        </div>
        <div className="input-field">
          <label>Prix</label>
          <input name="price" value={form.price || ''} onChange={handleChange} />
        </div>
        <div className="input-field">
          <label>Description</label>
          <textarea name="description" value={form.description || ''} onChange={handleChange} />
        </div>
        
        <div className="amenities-group">
          <div className="checkbox-group">
            <label htmlFor="has_wifi" className="amenity-label">
              <input
                type="checkbox"
                id="has_wifi"
                name="has_wifi"
                checked={form.has_wifi || false}
                onChange={handleChange}
                className="amenity-checkbox"
              />
              <span>WiFi disponible</span>
            </label>
          </div>
          <div className="checkbox-group">
            <label htmlFor="has_parking" className="amenity-label">
              <input
                type="checkbox"
                id="has_parking"
                name="has_parking"
                checked={form.has_parking || false}
                onChange={handleChange}
                className="amenity-checkbox"
              />
              <span>Parking disponible</span>
            </label>
          </div>
        </div>
      </div>
      <div className="buttons-section">
        <button className="save-btn" onClick={handleSave} disabled={saving}>
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
        <button type="button" className="delete-btn" onClick={handleDelete} disabled={deleting}>
          {deleting ? 'Suppression...' : 'Supprimer'}
        </button>
        <button type="button" className="cancel-btn" onClick={() => navigate('/maison-liste')}>
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

export default HouseProfile;
