"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Upload,
  Info,
  Check,
  MapPin,
  Shield,
  Home,
  DollarSign,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/AddInfos.css";
import Footer from "../components/footer";
import Logo from "../components/logo";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar1";

export default function AddInfos() {
 
  const [formData, setFormData] = useState({
    bedrooms: "",
    location: "",
    security: "",
    proximity: "",
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
  const [showDropdown, setShowDropdown] = useState(false);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handlePhotoUpload = (index, e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newPhotos = [...photos];
        newPhotos[index] = event.target.result;
        setPhotos(newPhotos);
      };
      reader.readAsDataURL(file);
    }
  };


  const handlePhotoClick = (index) => {
    setActivePhotoIndex(index);
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index].click();
    }
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    const filledPhotos = photos.filter((p) => p !== "").length;
    alert(`Form submitted with ${filledPhotos} photos!`);
  };

  // Handle cancel with exit animation
  const handleCancel = () => {
    setIsExiting(true);
    setTimeout(() => {
      alert("Opération annulée");
      setIsExiting(false);
    }, 500);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const photoGridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const photoItemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  
  const negotiationOptions = [
    "Non négociable",
    "Légèrement négociable",
    "Négociable",
    "Très négociable",
  ];

  return (
    <>
      <Navbar />
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
              {/* Bedrooms */}
              <div className="input-group">
                <Home className="input-icon" />
                <input
                  type="number"
                  name="bedrooms"
                  placeholder="Nombre de chambres"
                  className="form-input"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  min="1"
                />
                <motion.div
                  className="input-highlight"
                  initial={{ width: "0%" }}
                  animate={{ width: formData.bedrooms ? "100%" : "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Location */}
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

              {/* Security */}
              <div className="input-group">
                <Shield className="input-icon" />
                <input
                  type="text"
                  name="security"
                  placeholder="Dispositifs de sécurité"
                  className="form-input"
                  value={formData.security}
                  onChange={handleInputChange}
                />
                <motion.div
                  className="input-highlight"
                  initial={{ width: "0%" }}
                  animate={{ width: formData.security ? "100%" : "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Proximity */}
              <div className="input-group">
                <Info className="input-icon" />
                <input
                  type="text"
                  name="proximity"
                  placeholder="Proximité"
                  className="form-input"
                  value={formData.proximity}
                  onChange={handleInputChange}
                />
                <motion.div
                  className="input-highlight"
                  initial={{ width: "0%" }}
                  animate={{ width: formData.proximity ? "100%" : "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Price negotiation */}
              <div className="dropdown-group">
                <DollarSign className="input-icon" />
                <div
                  className="dropdown-selector"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <span className="dropdown-text">
                    {formData.priceNegotiation || "Négociation sur le prix"}
                  </span>
                  <motion.div
                    animate={{ rotate: showDropdown ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="dropdown-icon" />
                  </motion.div>
                </div>

                <AnimatePresence>
                  {showDropdown && (
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
                            setShowDropdown(false);
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
                Veuillez insérer six photos de votre logement
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
                Merci de noter qu'il est strictement interdit d'ajouter un
                logement fictif ou de fournir des informations fausses. Tout
                manquement à cette règle entraînera des sanctions conformément à
                nos conditions d'utilisation.
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
                      Nous vérifions toutes les annonces pour garantir la qualité
                      de notre plateforme.
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
                Continuer
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
      <Footer/>
    </>
  );
}