
import React from 'react';
import '../styles/ProfileInformations.css';
import profile from '/profile.jpg'; // Replace with your actual image path

 // Replace with your actual image path

const ProfileInformations = () => {
  return (
    <div className="profile-informations-container">
      <div className="profile-header">
        <div className="profile-image-container animated-profile">
          <img src={profile} alt="Profile" className="profile-image" />
        </div>
        <h2 className="profile-name">Moi</h2>
        
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="nom">Nom</label>
          <input type="text" id="nom" placeholder="" />
        </div>
        <div className="form-group">
          <label htmlFor="prenom">Prénom</label>
          <input type="text" id="prenom" placeholder="" />
        </div>
        <div className="form-group full-width">
          <label htmlFor="adresse">Adresse</label>
          <input type="text" id="adresse" placeholder="" />
        </div>
        <div className="form-group full-width">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="" />
        </div>
        
        <div className="form-group full-width">
          <label htmlFor="telephone">Numéro de téléphone</label>
          <input type="tel" id="telephone" placeholder="" />
        </div>
        <div className="form-group full-width">
          <label htmlFor="mot-de-passe">Mot de passe</label>
          <input type="password" id="mot-de-passe" placeholder="" />
        </div>
      </div>

      <button className="disconnect-button">Déconnecter</button>
    </div>
  );
};

export default ProfileInformations;