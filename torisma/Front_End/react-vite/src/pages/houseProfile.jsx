// src/pages/HProfile.jsx
import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/navbar1-connected";
import Footer from "../components/footer";
import HouseProfile from "../components/HouseProfile";
import "../styles/HouseProfile.css";

function HProfile() {
  const { id } = useParams();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <main className="flex-grow flex justify-center items-start p-6">
        <HouseProfile />
      </main>
      <Footer />
    </div>
  );
}

export default HProfile;
