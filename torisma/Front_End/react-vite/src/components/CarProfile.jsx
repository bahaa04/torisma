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
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.put(`http://localhost:8000/api/listings/cars/${id}/`, form, { withCredentials: true });
      setSaving(false);
      navigate('/voiture-liste');
    } catch (err) {
      setError('Failed to save car');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this car?')) return;
    try {
      setDeleting(true);
      await axios.delete(`http://localhost:8000/api/listings/cars/${id}/`, { withCredentials: true });
      setDeleting(false);
      navigate('/voiture-liste');
    } catch (err) {
      setError('Failed to delete car');
      setDeleting(false);
    }
  };

  if (loading) return <div className="car-profile-loading">Loading...</div>;
  if (error) return <div className="car-profile-error">{error}</div>;
  if (!form) return null;

  return (
    <div className="car-profile">
      <div className="images-section">
        {(car.photos && car.photos.length > 0 ? car.photos : [{ photo: '/placeholder-car.jpg' }]).map((img, idx) => (
          <div key={idx} className="image-slot">
            <img src={img.photo.startsWith('http') ? img.photo : `http://localhost:8000${img.photo}`} alt={`Car ${idx + 1}`} className="slot-img" />
          </div>
        ))}
      </div>
      <div className="inputs-container">
        <div className="input-field">
          <label>Manufacture</label>
          <input name="manufacture" value={form.manufacture || ''} onChange={handleChange} />
        </div>
        <div className="input-field">
          <label>Model</label>
          <input name="model" value={form.model || ''} onChange={handleChange} />
        </div>
        <div className="input-field">
          <label>Year</label>
          <input name="manufacturing_year" value={form.manufacturing_year || ''} onChange={handleChange} />
        </div>
        <div className="input-field">
          <label>Location</label>
          <input name="location" value={form.location || ''} onChange={handleChange} />
        </div>
        <div className="input-field">
          <label>Wilaya</label>
          <input name="wilaya" value={form.wilaya || ''} onChange={handleChange} />
        </div>
        <div className="input-field">
          <label>Seats</label>
          <input name="seats" value={form.seats || ''} onChange={handleChange} />
        </div>
        <div className="input-field">
          <label>Fuel Type</label>
          <input name="fuel_type" value={form.fuel_type || ''} onChange={handleChange} />
        </div>
        <div className="input-field">
          <label>Price</label>
          <input name="price" value={form.price || ''} onChange={handleChange} />
        </div>
        <div className="input-field">
          <label>Description</label>
          <textarea name="description" value={form.description || ''} onChange={handleChange} />
        </div>
      </div>
      <div className="buttons-section">
        <button className="save-btn" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        <button type="button" className="delete-btn" onClick={handleDelete} disabled={deleting}>{deleting ? 'Deleting...' : 'Delete'}</button>
        <button type="button" className="cancel-btn" onClick={() => navigate('/voiture-liste')}>Cancel</button>
      </div>
    </div>
  );
};

export default CarProfile;
