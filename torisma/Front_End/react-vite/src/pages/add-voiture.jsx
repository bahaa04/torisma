"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Upload,
  Info,
  Check,
  MapPin,
  DollarSign,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/addInfos.css";
import Footer from "../components/footer";
import Logo from "../components/logo";
import { Link, useNavigate } from "react-router-dom";

export default function AddCar() {
  const [formData, setFormData] = useState({
    typevoiture: "",
    location: "",
    motorization: "",
    puissance: "",
    price: "",
    dispo: "",
    priceNegotiation: "",
  });

  const [photos, setPhotos] = useState(Array(6).fill(""));
  const [activePhotoIndex, setActivePhotoIndex] = useState(null);
  const fileInputRefs = useRef([]);

  useEffect(() => {
    fileInputRefs.current = Array(6)
      .fill(null)
      .map((_, i) => fileInputRefs.current[i] || null);
  }, []);

  const [isExiting, setIsExiting] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const [showDispoDropdown, setShowDispoDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (index, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const newPhotos = [...photos];
      newPhotos[index] = event.target.result;
      setPhotos(newPhotos);
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoClick = (index) => {
    setActivePhotoIndex(index);
    fileInputRefs.current[index]?.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if all fields are filled
    const requiredFields = ['typevoiture', 'location', 'motorization', 'puissance', 'price', 'dispo', 'priceNegotiation'];
    const isFormValid = requiredFields.every(field => formData[field]);
    const hasPhoto = photos[0]; // Check if first photo exists

    if (!isFormValid || !hasPhoto) {
      alert('Veuillez remplir tous les champs et ajouter au moins une photo');
      return;
    }

    // Create new car entry
    const newCar = {
      id: Date.now(),
      name: `${formData.typevoiture} - ${formData.location}`,
      src: photos[0], // Use first photo as card image
      ...formData
    };

    // Get existing cars from localStorage
    const existingCars = JSON.parse(localStorage.getItem('cars') || '[]');
    
    // Add new car and save back to localStorage
    localStorage.setItem('cars', JSON.stringify([...existingCars, newCar]));

    // Navigate back to car list
    navigate('/voiture-liste');
  };

  const handleCancel = () => {
    setIsExiting(true);
    setTimeout(() => {
      navigate('/voiture-liste');
    }, 500);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delayChildren: 0.2, staggerChildren: 0.1 },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  const photoGridVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delayChildren: 0.6, staggerChildren: 0.1 } },
  };

  const photoItemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  const dispo = ["disponible", "non disponible"];
  const negotiationOptions = [
    "Non négociable",
    "Légèrement négociable",
    "Négociable",
    "Très négociable",
  ];

  return (
    <>
      <header>
        <div className="logo-container">
          <Logo />
          <h1 className="logoText">
            <span className="highlight">T</span>ourism
            <span className="highlight">A</span>
          </h1>
        </div>

        <Link to="/signup">
          <div className="register-btn">
            <button>Register</button>
          </div>
        </Link>
      </header>

      <div className="property-form-page">
        <motion.div
          className="property-form-container"
          variants={containerVariants}
          initial="hidden"
          animate={isExiting ? "exit" : "visible"}
        >
          <motion.h1 className="property-form-title" variants={itemVariants}>
            Complétez vos informations
          </motion.h1>

          <form onSubmit={handleSubmit}>
            <motion.div className="form-fields" variants={itemVariants}>
              {/* typevoiture */}
              <div className="input-group">
                <input
                  type="text"
                  name="typevoiture"
                  placeholder="type de voiture"
                  className="form-input"
                  value={formData.typevoiture}
                  onChange={handleInputChange}
                />
                <motion.div
                  className="input-highlight"
                  initial={{ width: "0%" }}
                  animate={{ width: formData.typevoiture ? "100%" : "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* location */}
              <div className="input-group">
                <MapPin className="input-icon" />
                <input
                  type="text"
                  name="location"
                  placeholder="Lieu de localisation"
                  className="form-input"
                  value={formData.location}
                  onChange={handleInputChange}
                />
                <motion.div
                  className="input-highlight"
                  initial={{ width: "0%" }}
                  animate={{ width: formData.location ? "100%" : "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* motorization */}
              <div className="input-group">
                <input
                  type="text"
                  name="motorization"
                  placeholder="Motorization"
                  className="form-input"
                  value={formData.motorization}
                  onChange={handleInputChange}
                />
                <motion.div
                  className="input-highlight"
                  initial={{ width: "0%" }}
                  animate={{ width: formData.motorization ? "100%" : "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* puissance */}
              <div className="input-group">
                <Info className="input-icon" />
                <input
                  type="text"
                  name="puissance"
                  placeholder="Puissance"
                  className="form-input"
                  value={formData.puissance}
                  onChange={handleInputChange}
                />
                <motion.div
                  className="input-highlight"
                  initial={{ width: "0%" }}
                  animate={{ width: formData.puissance ? "100%" : "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* disponibilité */}
              <div className="dropdown-group">
                <div
                  className="dropdown-selector"
                  onClick={() => {
                    setShowDispoDropdown((v) => !v);
                    setShowPriceDropdown(false);
                  }}
                >
                  <span className="dropdown-text">
                    {formData.dispo || "disponibilité"}
                  </span>
                  <motion.div
                    animate={{ rotate: showDispoDropdown ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="dropdown-icon" />
                  </motion.div>
                </div>

                <AnimatePresence>
                  {showDispoDropdown && (
                    <motion.div
                      className="dropdown-menu"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {dispo.map((option, i) => (
                        <motion.div
                          key={i}
                          className="dropdown-item"
                          whileHover={{ backgroundColor: "#f3f4f6" }}
                          onClick={() => {
                            setFormData((p) => ({ ...p, dispo: option }));
                            setShowDispoDropdown(false);
                          }}
                        >
                          {option}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* prix en DA */}
              <div className="input-group">
                <DollarSign className="input-icon" />
                <input
                  type="number"
                  name="price"
                  placeholder="prix en DA"
                  className="form-input"
                  value={formData.price}
                  onChange={handleInputChange}
                />
                <motion.div
                  className="input-highlight"
                  initial={{ width: "0%" }}
                  animate={{ width: formData.price ? "100%" : "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* négociation sur le prix */}
              <div className="dropdown-group">
                <DollarSign className="input-icon" />
                <div
                  className="dropdown-selector"
                  onClick={() => {
                    setShowPriceDropdown((v) => !v);
                    setShowDispoDropdown(false);
                  }}
                >
                  <span className="dropdown-text">
                    {formData.priceNegotiation || "Négociation sur le prix"}
                  </span>
                  <motion.div
                    animate={{ rotate: showPriceDropdown ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="dropdown-icon" />
                  </motion.div>
                </div>

                <AnimatePresence>
                  {showPriceDropdown && (
                    <motion.div
                      className="dropdown-menu"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {negotiationOptions.map((option, i) => (
                        <motion.div
                          key={i}
                          className="dropdown-item"
                          whileHover={{ backgroundColor: "#f3f4f6" }}
                          onClick={() => {
                            setFormData((p) => ({
                              ...p,
                              priceNegotiation: option,
                            }));
                            setShowPriceDropdown(false);
                          }}
                        >
                          {option}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Photo upload */}
            <motion.div className="photo-section" variants={itemVariants}>
              <h2 className="photo-title">
                Veuillez insérer six photos de votre voiture
              </h2>
              <motion.div className="photo-grid" variants={photoGridVariants}>
                {Array(6)
                  .fill(0)
                  .map((_, idx) => (
                    <motion.div
                      key={idx}
                      className="photo-upload-container"
                      variants={photoItemVariants}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePhotoClick(idx)}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        ref={(el) => (fileInputRefs.current[idx] = el)}
                        onChange={(e) => handlePhotoUpload(idx, e)}
                        className="hidden-input"
                      />
                      {photos[idx] ? (
                        <motion.div
                          className="photo-preview"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <img
                            src={photos[idx]}
                            alt={`Property photo ${idx + 1}`}
                          />
                          <div className="photo-overlay">
                            <Check className="check-icon" />
                          </div>
                        </motion.div>
                      ) : (
                        <div className="upload-placeholder">
                          <Upload className="upload-icon" />
                        </div>
                      )}
                    </motion.div>
                  ))}
              </motion.div>
            </motion.div>

            <motion.div
              className="warning-section"
              variants={itemVariants}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <div className="warning-dot" />
              <p className="warning-text">
                Merci de noter qu'il est strictement interdit d'ajouter une
                voiture fictive ou de fournir des informations fausses. Tout
                manquement à cette règle entraînera des sanctions conformément
                à nos conditions d'utilisation.
              </p>

              <AnimatePresence>
                {showTooltip && (
                  <motion.div
                    className="tooltip"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <p>
                      Nous vérifions toutes les annonces pour garantir la
                      qualité de notre plateforme.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Actions */}
            <motion.div className="form-actions" variants={itemVariants}>
              <motion.button
                type="submit"
                className="submit-button"
                whileHover={{ scale: 1.03, backgroundColor: "#28b67d" }}
                whileTap={{ scale: 0.97 }}
              >
                Créer
              </motion.button>
              <motion.button
                type="button"
                className="cancel-button"
                onClick={handleCancel}
                whileHover={{ textDecoration: "underline" }}
              >
                Annuler
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
