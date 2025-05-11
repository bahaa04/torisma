import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ProfileInformations.css';

const ProfileInformations = () => {
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

  useEffect(() => {
    // TODO: Fetch user data from your API
    const fetchUserData = async () => {
      // Simulate API call
      const mockData = {
        email: 'user@example.com',
        username: 'username123',
        first_name: 'John',
        last_name: 'Doe',
        phone_number: '+1234567890',
        profile_image: '/profile.jpg'
      };
      setUserData(mockData);
      setPreviewImage(mockData.profile_image);
    };
    fetchUserData();
  }, []);

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
    // TODO: Implement your API call to update user data
    console.log('Saving user data:', userData);
    // Add your API call here
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
          <label style={{visibility: 'hidden'}}>Mot de passe</label>
          <button 
            type="button"
            className="password-change-button"
            onClick={() => navigate('/recmsg')}
          >
            Changer le mot de passe
          </button>
        </div>
      </div>

      <button type="submit" className="save-button">
        Sauvegarder
      </button>
    </form>
  );
};

export default ProfileInformations;