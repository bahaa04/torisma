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
      await axios.put(`http://localhost:8000/api/listings/houses/${id}/`, form, { withCredentials: true });
      setSaving(false);
      navigate('/maison-liste');
    } catch (err) {
      setError('Failed to save house');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this house?')) return;
    try {
      setDeleting(true);
      await axios.delete(`http://localhost:8000/api/listings/houses/${id}/`, { withCredentials: true });
      setDeleting(false);
      navigate('/maison-liste');
    } catch (err) {
      setError('Failed to delete house');
      setDeleting(false);
    }
  };

  if (loading) return <div className="house-profile-loading">Loading...</div>;
  if (error) return <div className="house-profile-error">{error}</div>;
  if (!form) return null;

  return (
    <div className="house-profile">
      <div className="images-section">
        {(house.photos && house.photos.length > 0 ? house.photos : [{ photo: '/placeholder-house.jpg' }]).map((img, idx) => (
          <div key={idx} className="image-slot">
            <img src={img.photo.startsWith('http') ? img.photo : `http://localhost:8000${img.photo}`} alt={`House ${idx + 1}`} className="slot-img" />
          </div>
        ))}
      </div>
      <div className="inputs-container">
        <div className="input-field">
          <label>City</label>
          <input name="city" value={form.city || ''} onChange={handleChange} />
        </div>
        <div className="input-field">
          <label>Wilaya</label>
          <input name="wilaya" value={form.wilaya || ''} onChange={handleChange} />
        </div>
        <div className="input-field">
          <label>Location</label>
          <input name="location" value={form.location || ''} onChange={handleChange} />
        </div>
        <div className="input-field">
          <label>Price</label>
          <input name="price" value={form.price || ''} onChange={handleChange} />
        </div>
        <div className="input-field">
          <label>Description</label>
          <textarea name="description" value={form.description || ''} onChange={handleChange} />
        </div>
        <div className="checkbox-field">
          <input name="furnished" type="checkbox" checked={form.furnished || false} onChange={handleChange} />
          <label>Furnished</label>
        </div>
        <div className="checkbox-field">
          <input name="has_parking" type="checkbox" checked={form.has_parking || false} onChange={handleChange} />
          <label>Parking</label>
        </div>
        <div className="checkbox-field">
          <input name="has_wifi" type="checkbox" checked={form.has_wifi || false} onChange={handleChange} />
          <label>WiFi</label>
        </div>
      </div>
      <div className="buttons-section">
        <button className="save-btn" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        <button type="button" className="delete-btn" onClick={handleDelete} disabled={deleting}>{deleting ? 'Deleting...' : 'Delete'}</button>
        <button type="button" className="cancel-btn" onClick={() => navigate('/maison-liste')}>Cancel</button>
      </div>
    </div>
  );
};

export default HouseProfile;
