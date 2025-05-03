import React, { useState, useEffect } from "react";
import NavBar from "../components/navbar1";
import Footer from "../components/footer";
import Logo from "../components/logo";
import "../styles/homepage.css";
import DestinationList from "../components/destination-list";

export default function HomePage() {
  const [dests, setDests] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/listings/wilayas/")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const formatted = data.map((item) => ({
          id: item.id,
          location: item.name,
          images:
            item.photos && item.photos.length > 0
              // extract the `image` URL from each photo object
              ? item.photos.map((p) => p.image)
              // fallback if no photos
              : ["/default-wilaya.jpg"],
        }));
        setDests(formatted);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message);
      })
      .finally(() => {
        setIsLoaded(true);
      });
  }, []);

  if (!isLoaded) {
    return (
      <div className="homepage">
        <NavBar />
        <div className="loading">Chargement des wilayas…</div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="homepage">
        <NavBar />
        <div className="error">Erreur : {error}</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="homepage">
      <NavBar />

      <div className="main-content">
        <div className="content-header">
          <h1 className="content-title">
            Explorez les wilayas d'Algérie et faites votre choix
          </h1>
          <p className="content-subtitle">
            Partez à la découverte des wilayas d'Algérie et choisissez votre
            prochaine destination.
          </p>
        </div>

        <div className="destinations-grid">
          <DestinationList dests={dests} />
        </div>

        <div className="help-section">
          <p className="help-text">
            Vous hésitez entre mer, désert ou montagnes ? Si oui, essayez ceci
          </p>
          <a href="#" className="help-button">
            Aidez-moi
          </a>
        </div>
      </div>

      <div className="video-banner">
        <video
          width="100%"
          height="100%"
          className="vid"
          controls
          autoPlay
          muted
          loop
        >
          <source src="/alg.mp4" type="video/mp4" />
          Your browser does not support the video tag
        </video>
        <div className="banner-logo">
          <Logo />
          <span className="logo-text">TourismA</span>
        </div>
      </div>

      <Footer />
    </div>
  );
}
