import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavbarC from "../components/navbar1-connected";
import Footer from "../components/footer";
import CarProfile from "../components/CarProfile";
import "../styles/CarProfile.css";



function CProfile() {
    const { id } = useParams();
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
      <NavbarC />
      <main className="flex-grow flex justify-center items-start p-6">
        <CarProfile />
      </main>
      <Footer />
    </div>
    );
}

export default CProfile;