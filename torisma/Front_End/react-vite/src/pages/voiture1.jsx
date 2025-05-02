"use client";

import React, { useState, useEffect } from "react";
import NavBar from "../components/navbar1";
import Search from "../components/search";
import OptionVoiture from "../components/optionvoiture";
import CarList from "../components/car-list";
import "../styles/voiture1.css";
import Footer from "../components/footer";

export default function Voiture1() {
  const initialCars = [
    {
      id: 1,
      location: "Cheraga",
      brand: "DACIA",
      model: "DUSTER",
      price: 8500,
      currency: "DA",
      images: ["/daciaduster1.jpg", "/daciaduster2.jpg", "/daciaduster3.jpg"],
    },
    {
      id: 2,
      location: "Bab Ezzouar",
      brand: "MERCEDES",
      model: "classe C",
      price: 25000,
      currency: "DA",
      images: [
        "/mercedes1.jpg",
        "/mercedes2.jpg",
        "/mercedes3.jpg",
      ],
    },
    {
      id: 3,
      location: "Beraki",
      brand: "MERCEDES",
      model: "GLC",
      price: 40000,
      currency: "DA",
      images: [
        "/merc1.jpg",
        "/merc2.jpg",
        "/merc3.jpg",
      ],
    },
  ];

  const [cars, setCars] = useState(initialCars);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // simulate loading
    setIsLoaded(true);
  }, []);

  return (
    <>
    <div className={`voiture1 car-rental-app ${isLoaded ? "loaded" : ""}`}>
      <NavBar />
      <Search />
      <OptionVoiture />
      <CarList cars={cars} />
      
    </div>
    <br/><br/>
    <Footer/>
    </>
  );
}
