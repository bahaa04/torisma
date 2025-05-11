import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ProfileInformations.css';

const ProfileInformations = ({ userProfile }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    profile_image: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (userProfile) {
      setUserData({
        email: userProfile.email || '',
        username: userProfile.username || '',
        first_name: userProfile.first_name || '',
        last_name: userProfile.last_name || '',
        phone_number: userProfile.phone_number || '',
        profile_image: null // file upload handled separately
      });
      setPreviewImage(userProfile.profile_image || '/default-profile.jpg');
    }
  }, [userProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData(prev => ({
        ...prev,
        profile_image: file
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const access = localStorage.getItem('access_token');
      const formData = new FormData();
      formData.append('email', userData.email);
      formData.append('username', userData.username);
      formData.append('first_name', userData.first_name);
      formData.append('last_name', userData.last_name);
      formData.append('phone_number', userData.phone_number);
      if (userData.profile_image) {
        formData.append('profile_image', userData.profile_image);
      }

      const res = await fetch('http://localhost:8000/api/users/profile/', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${access}`
        },
        body: formData
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setMessage('Profil mis à jour avec succès.');
      // Optionally refresh profile data
    } catch (err) {
      console.error('Update failed:', err);
      setMessage('Échec de la mise à jour.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      <div className="profile-header">
        <div className="profile-image-container">
          <label htmlFor="profile_image" className="upload-label">
            <img src={previewImage} alt="Profile" className="profile-image" />
          </label>
          <input
            type="file"
            id="profile_image"
            name="profile_image"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="username">Nom d'utilisateur</label>
          <input
            type="text"
            id="username"
            name="username"
            value={userData.username}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="first_name">Prénom</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={userData.first_name}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="last_name">Nom</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={userData.last_name}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone_number">Numéro de téléphone</label>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            value={userData.phone_number}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label style={{ visibility: 'hidden' }}>Mot de passe</label>
          <button
            type="button"
            className="password-change-button"
            onClick={() => navigate('/recmsg')}
          >
            Changer le mot de passe
          </button>
        </div>
      </div>

      {message && <p className="update-message">{message}</p>}

      <button type="submit" className="save-button" disabled={saving}>
        {saving ? 'Sauvegarde…' : 'Sauvegarder'}
      </button>
    </form>
  );
};

export default ProfileInformations;
