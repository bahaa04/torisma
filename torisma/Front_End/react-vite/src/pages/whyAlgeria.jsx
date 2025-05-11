import { useState } from "react";
import NavBar11 from '../components/navbar11';
import Pourquoi from "../components/Pourquoi";
import Footer from "../components/footer";

function WhyAlgeria() {
  return (
    <>
    <div className="container">
    <div className="min-h-screen flex flex-col">
      <NavBar11 />
      <main className="flex-grow">
        <Pourquoi />
      </main>
      <Footer />
    </div>
    </div>
    </>
  );
}

export default WhyAlgeria;