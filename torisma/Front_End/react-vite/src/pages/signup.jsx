import React, { useState, useRef } from 'react';
import { ChevronDown, Upload } from 'lucide-react';
import '../styles/signup.css';
import NavBar2 from "../components/navbar2"
import Footer from '../components/footer';
import NavBar3 from '../components/navbar3';

export default function SignUp() {
  const [idCardType, setIdCardType] = useState('');
  const [gender, setGender] = useState('');
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      // e.g. you could generate a preview URL:
      // const previewUrl = URL.createObjectURL(e.target.files[0]);
    }
  };

  return (
<>
<div className="container">
<NavBar3/>
<hr style={{border:"none" , height:"0.5px",backgroundColor:"#e0e0e0"}}  />

    <div className="form-container">
      <div className="form-wrapper">
        <h1 className="form-title">Créer votre compte</h1>
        <p className="form-subtitle">
          Définissez un mot de passe sécurisé pour garantir la protection de votre compte TouristmA
        </p>

        <form className="registration-form">
          <input type="email" placeholder="Email" className="form-input" />
          <input type="text" placeholder="Username" className="form-input" />
          <input type="text" placeholder="Nom" className="form-input" />
          <input type="text" placeholder="Prénom" className="form-input" />
          <input type="tel" placeholder="Numéro de téléphone" className="form-input" />
          
          <div className="dropdown-container">
            <div
              className="dropdown-selector"
              onClick={() => setShowGenderDropdown(!showGenderDropdown)}
            >
              <span className="dropdown-placeholder">
                {gender || "Genre"}
              </span>
              <ChevronDown className="dropdown-icon" />
            </div>
            {showGenderDropdown && (
              <div className="dropdown-menu">
                {["Masculin", "Féminin"].map((type) => (
                  <div
                    key={type}
                    className="dropdown-item"
                    onClick={() => {
                      setGender(type);
                      setShowGenderDropdown(false);
                    }}
                  >
                    {type}
                  </div>
                ))}
              </div>
            )}
          </div>

          <input type="password" placeholder="Mot de passe" className="form-input" />

          <div className="dropdown-container">
            <div
              className="dropdown-selector"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span className="dropdown-placeholder">
                {idCardType || "Type de la carte d'identité"}
              </span>
              <ChevronDown className="dropdown-icon" />
            </div>
            {showDropdown && (
              <div className="dropdown-menu">
                {[
                  "Carte Nationale d'Identité",
                  "Passeport"
                ].map((type) => (
                  <div
                    key={type}
                    className="dropdown-item"
                    onClick={() => {
                      setIdCardType(type);
                      setShowDropdown(false);
                    }}
                  >
                    {type}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* hidden file input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          <div
            className="upload-container"
            onClick={handleFileClick}
            style={{ cursor: 'pointer' }}
          >
            <div className="upload-icon-wrapper">
              <Upload className="upload-icon" />
            </div>
            <span className="upload-text">
              {selectedFile ? selectedFile.name : 'Télécharger'}
            </span>
          </div>

          <button type="submit" className="submit-button">
            Continuer
          </button>
        </form>
      </div>
    </div>
<Footer/>
</div>
    </>
  );
}
