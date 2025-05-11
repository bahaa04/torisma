"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Check,
  MapPin,
  DollarSign,
  Shield,
  Map,
  Wifi,
  ParkingCircle,
  Info,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/footer";
import Logo from "../components/logo";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/addinfos.css";
import NavBarC from '../components/navbar1-connected';

const WILAYAS = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem", "MSila", "Mascara", "Ouargla", "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar", "Ouled Djellal", "Béni Abbès", "In Salah", "In Guezzam", "Touggourt", "Djanet", "El MGhair", "El Meniaa"
];

const STATUS_CHOICES = [
  { value: "available", label: "Disponible" },
  { value: "disabled", label: "Désactivée" }
];

export default function AddHouse() {
  const [formData, setFormData] = useState({
    wilaya: "",
    city: "",
    gps_location: "",
    description: "",
    price: "",
    status: "available",
    has_parking: false,
    has_wifi: false,
    rooms: ""
  });
  const [photos, setPhotos] = useState(Array(5).fill(null));
  const [activePhotoIndex, setActivePhotoIndex] = useState(null);
  const fileInputRefs = useRef([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    fileInputRefs.current = Array(5)
      .fill(null)
      .map((_, i) => fileInputRefs.current[i] || null);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePhotoUpload = (index, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const newPhotos = [...photos];
    newPhotos[index] = file;
    setPhotos(newPhotos);
  };

  const handlePhotoClick = (index) => {
    setActivePhotoIndex(index);
    fileInputRefs.current[index]?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    photos.forEach(photo => {
      if (photo) data.append('photos', photo);
    });
    try {
      await axios.post(
        'http://localhost:8000/api/listings/houses/create/',
        data,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        }
      );
      setLoading(false);
      navigate('/maison-liste');
    } catch (err) {
      setError('Erreur lors de la création du logement');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/maison-liste');
  };

  return (
    <>
      <NavBarC />
      <div className="property-form-page">
        <motion.div className="property-form-container">
          <motion.h1 className="property-form-title">
            Ajouter un logement
          </motion.h1>
          <form onSubmit={handleSubmit}>
            <div className="form-fields">
              {/* Description */}
              <div className="input-group">
                <Info className="input-icon" />
                <textarea
                  name="description"
                  placeholder="Informations supplémentaires"
                  className="form-input"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Price */}
              <div className="input-group">
                <DollarSign className="input-icon" />
                <input
                  type="number"
                  name="price"
                  placeholder="Prix en DA"
                  className="form-input"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* City */}
              <div className="input-group">
                <MapPin className="input-icon" />
                <input
                  type="text"
                  name="city"
                  placeholder="Ville"
                  className="form-input"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Wilaya */}
              <div className="input-group">
                <Map className="input-icon" />
                <select
                  name="wilaya"
                  className="form-input select-input"
                  value={formData.wilaya}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Wilaya</option>
                  {WILAYAS.map(w => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="input-group">
                <Shield className="input-icon" />
                <select
                  name="status"
                  className="form-input select-input"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  {STATUS_CHOICES.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Number of rooms */}
              <div className="input-group">
                <Users className="input-icon" />
                <input
                  type="number"
                  name="rooms"
                  placeholder="Nombre de chambres"
                  className="form-input"
                  value={formData.rooms}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* GPS Location */}
              <div className="input-group">
                <MapPin className="input-icon" />
                <input
                  type="text"
                  name="gps_location"
                  placeholder="Emplacement GPS (Google Maps)"
                  className="form-input"
                  value={formData.gps_location}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Amenities */}
              <div className="amenities-group">
                <div className="checkbox-group">
                  <label htmlFor="has_parking" className="amenity-label">
                    <input
                      type="checkbox"
                      id="has_parking"
                      name="has_parking"
                      checked={formData.has_parking}
                      onChange={handleInputChange}
                      className="amenity-checkbox"
                    />
                    <ParkingCircle className="amenity-icon" size={20} />
                    <span>Parking disponible</span>
                  </label>
                </div>
                <div className="checkbox-group">
                  <label htmlFor="has_wifi" className="amenity-label">
                    <input
                      type="checkbox"
                      id="has_wifi"
                      name="has_wifi"
                      checked={formData.has_wifi}
                      onChange={handleInputChange}
                      className="amenity-checkbox"
                    />
                    <Wifi className="amenity-icon" size={20} />
                    <span>WiFi disponible</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Photo upload */}
            <div className="photo-section">
              <h2 className="photo-title">Ajoutez 5 photos de votre logement</h2>
              <div className="photo-grid">
                {Array(5).fill(0).map((_, idx) => (
                  <div
                    key={idx}
                    className="photo-upload-container"
                    onClick={() => handlePhotoClick(idx)}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      ref={el => (fileInputRefs.current[idx] = el)}
                      onChange={e => handlePhotoUpload(idx, e)}
                      className="hidden-input"
                    />
                    {photos[idx] ? (
                      <div className="photo-preview">
                        <img
                          src={URL.createObjectURL(photos[idx])}
                          alt={`House photo ${idx + 1}`}
                        />
                        <div className="photo-overlay">
                          <Check className="check-icon" />
                        </div>
                      </div>
                    ) : (
                      <div className="upload-placeholder">
                        <Upload className="upload-icon" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            {loading && <div className="loading-message">Envoi en cours...</div>}
            <div className="form-actions">
              <button type="submit" className="submit-button" disabled={loading}>
                Continuer
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={handleCancel}
                disabled={loading}
              >
                Annuler
              </button>
            </div>
          </form>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}