import React from 'react';
import "../styles/homepage.css";
import Logo from "../components/logo";
import { Twitter, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container pretty-footer center-footer">
        
        <div className="footer-column contacts">
          <h3>Contacts</h3>
          <div className="footer-contact-item">
            <span role="img" aria-label="email">📧</span>
            <span>TourismA@gmail.com</span>
          </div>
          <div className="footer-contact-item">
            <span role="img" aria-label="phone">📞</span>
            <span>+213 5 67 89 09 00</span>
          </div>
          <div className="footer-contact-item">
            <span role="img" aria-label="phone">📞</span>
            <span>+213 7 88 22 45 12</span>
          </div>
          <div className="footer-contact-item">
            <span role="img" aria-label="country">🌍</span>
            <span>Algérie</span>
          </div>
          <div className="social-icons">
            <a href="https://www.facebook.com/ba.ha.411207" target="_blank" rel="noopener noreferrer" className="social-icon facebook">
              <Facebook size={20} />
            </a>
            <a href="https://www.instagram.com/ba__.haa/" target="_blank" rel="noopener noreferrer" className="social-icon instagram">
              <Instagram size={20} />
            </a>
            <a href="https://x.com/fellahbahaa" target="_blank" rel="noopener noreferrer" className="social-icon twitter">
              <Twitter size={20} />
            </a>
          </div>
        </div>

        <div className="footer-column with-tourisma">
          <h3>Avec TourismA</h3>
          <h2>Découvrez l'Algérie autrement</h2>
          <div className="footer-logo">
            <div className="logo-container">
              <Logo/>
              <span className="logo-text">TourismA</span>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom center-footer-bottom">
        <div className="footer-links">
          <a href="#">Mentions légales</a>
          <a href="#">Politique de confidentialité</a>
          <a href="#">Conditions générales d'utilisation</a>
        </div>
        <div className="copyright">
          © 2025 Tourisma. Tous droits réservés
        </div>
      </div>
    </footer>
  );
};

export default Footer;
