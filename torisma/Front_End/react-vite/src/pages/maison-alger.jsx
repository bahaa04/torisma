"use client"

import React, { useState, useEffect } from "react";
import MaisonList from "../components/maison-list";
import "../styles/voiture1.css";
import OptionMaison2 from "../components/optionmaison2";
import NavBar from "../components/navbar1";
import Search from "../components/search";
import Footer from "../components/footer";
export default function MaisonAlger() {
  const [houses] = useState([
    {
      id: 1,
      location: "Hydra",
      brand: "Villa ,500 m²",
      model: "7 juin - 20 juillet",
      price: 34440,
      currency: "DA",
      images: [
        "/hydra.jpg",
        "/hydra1.jpg",
        "/hydra2.jpg",
      ],
    },
    {
      id: 2,
      location: "El Biar",
      brand: "appartement ,F4",
      model: "5-20 septembre",
      price: 166660,
      currency: "DA",
      images: [
        "/biar1.jpg",
        "/biar3.jpg",
        "/biar2.jpg",
      ],
    },
    {
      id: 3,
      location: "Hydra",
      brand: "appartement ,500 m²",
      model: "7 mars-20 mai",
      price: 9000,
      currency: "DA",
      images: [
        "/hydra4.jpg",
        "/hydra5.jpg",
        "/hydra6.jpg",
      ],
    },
  ]);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (

    <>
  
    
    <div className={`car-rental-app ${isLoaded ? "loaded" : ""}`}>
     
       <NavBar/>
       <Search/>
      <OptionMaison2 />
      <MaisonList houses={houses} />
    </div>
    <br/><br/>
   <Footer/>



    </>
  );
}
