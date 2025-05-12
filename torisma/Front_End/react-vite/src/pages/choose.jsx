"use client";

import React, { useState, useEffect } from 'react';
import { Home, Car } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import NavBar1 from '../components/navbar1';
import NavBarC from '../components/navbar1-connected';
import Footer from '../components/footer';
import '../styles/choose.css';

export default function Choose() {
  const navigate = useNavigate();
  const location = useLocation();
  const { wilaya } = location.state || {};
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    setIsAuthenticated(!!accessToken);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const handleHouseClick = () => {
    if (wilaya && wilaya.location) {
      navigate(`/houses/${wilaya.location.toLowerCase()}`);
    } else {
      navigate('/maison1');
    }
  };

  const handleCarClick = () => {
    if (wilaya && wilaya.location) {
      navigate(`/cars/${wilaya.location.toLowerCase()}`);
    } else {
      navigate('/voiture1');
    }
  };

  return (
    <>
      {isAuthenticated ? <NavBarC /> : <NavBar1 />}
      <div className="choose-page">
        <motion.div
          className="choose-cards-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="choose-title" variants={itemVariants}>
            Que souhaitez-vous faire ?
          </motion.h1>
          <div className="choose-cards">
            <motion.div
              className="choose-card maison-card"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleHouseClick}
            >
              <div className="card-bg maison-bg" />
              <div className="card-content">
                <Home className="card-icon" />
                <div className="card-label">Louer une maison</div>
                <div className="card-subtitle">Découvrez nos logements confortables</div>
              </div>
            </motion.div>
            <motion.div
              className="choose-card voiture-card"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCarClick}
            >
              <div className="card-bg voiture-bg" />
              <div className="card-content">
                <Car className="card-icon" />
                <div className="card-label">Louer une voiture</div>
                <div className="card-subtitle">Parcourez l'Algérie en toute liberté</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
