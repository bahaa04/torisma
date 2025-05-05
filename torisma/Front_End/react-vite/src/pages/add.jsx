"use client";

import { useState } from "react";
import { Home, Car, X } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate  } from "react-router-dom";
import Footer from "../components/footer";
import Logo from "../components/logo";
import "../styles/add.css";

export default function Add() {


  const navigate = useNavigate();

  const handleClick = () => {
    handleOptionSelect("logement");
    navigate("/infoadd");
  };
  const handleClick2 = () => {
    handleOptionSelect("voiture");
    navigate("/add-voiture");
  };



  const [selectedOption, setSelectedOption] = useState(null);
  const [isExiting, setIsExiting] = useState(false);

  
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
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.3 },
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

  
  const handleOptionSelect = (option) => {
    setSelectedOption(option);

    setTimeout(() => {
      alert(
        `Vous avez choisi d'ajouter: ${
          option === "logement" ? "un logement" : "une voiture"
        }`
      );
      setSelectedOption(null);
    }, 800);
  };

  
  const handleCancel = () => {
    setIsExiting(true);
    setTimeout(() => {
      alert("Opération annulée");
      setIsExiting(false);
    }, 500);
  };

  return (
    <>

      <header>
            <div className="logo-container">
                <Logo/>
                <h1 className="logoText"><span className="highlight">T</span>ourism<span className="highlight">A</span></h1>
            </div>
            <div className="register-btn">
                <button>Register</button>
            </div>
           
        </header>


    <div className="selection-page">
      <motion.div
        className="selection-container"
        variants={containerVariants}
        initial="hidden"
        animate={isExiting ? "exit" : "visible"}
      >
        <motion.h1 className="selection-title" variants={itemVariants}>
          Vous voulez ajouter
        </motion.h1>




        <motion.div className="options-container" variants={itemVariants}>


        
        <motion.button
      className={`option-button ${selectedOption === "logement" ? "selected" : ""}`}
      onClick={handleClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <Home className="option-icon" />
      <span>Un logement</span>
    </motion.button>
          
          


    <motion.button
            className={`option-button ${
              selectedOption === "voiture" ? "selected" : ""
            }`}
            onClick={handleClick2}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Car className="option-icon" />
            <span>Une Voiture</span>
          </motion.button>
        </motion.div>



        <motion.div className="cancel-container" variants={itemVariants}>
          <button className="cancel-button" onClick={handleCancel}>
            <X className="cancel-icon" />
            <span>Annuler</span>
          </button>
        </motion.div>
      </motion.div>
     
    </div>
     <Footer/>

     </>
  );
}
