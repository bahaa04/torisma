import { useState } from "react";
import Navbar from '../components/navbar1';
import Pourquoi from "../components/Pourquoi";
import Footer from "../components/footer";

function WhyAlgeria() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Pourquoi />
      </main>
      <Footer />
    </div>
  );
}

export default WhyAlgeria;