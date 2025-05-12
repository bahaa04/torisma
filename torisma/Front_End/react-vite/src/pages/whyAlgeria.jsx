import React, { useState, useEffect } from 'react';
import NavBar1 from '../components/navbar1';
import NavBarC from '../components/navbar1-connected';
import Pourquoi from "../components/Pourquoi";
import Footer from "../components/footer";

function WhyAlgeria() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    setIsAuthenticated(!!accessToken);
  }, []);

  return (
    <>
    <div className="container">
    <div className="min-h-screen flex flex-col">
      {isAuthenticated ? <NavBarC /> : <NavBar1 />}
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