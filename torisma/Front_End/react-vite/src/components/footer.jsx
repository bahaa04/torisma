import React from 'react';
import "../styles/homepage.css";
import Logo from "../components/logo";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3>À propos de TourismA</h3>
          <a href="#">À propos de TourismA</a>
          <h3>Nos Services</h3>
          <a href="#">Location de voiture</a>
          <a href="#">Découvrir les beaux paysages</a>
          <a href="#">Location de maisons</a>
        </div>

        <div className="footer-column">
          <h3>Contacts</h3>
          <p>TourismA@gmail.com</p>
          <p>+213 5 67 89 09 00</p>
          <p>+213 7 88 22 45 12</p>

          <div className="social-icons">
          <a href="#" className="social-icon">
            <svg viewBox="0 0 24 24" width="24px" height="24px" className="d Vb UmNoP" aria-hidden="true"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.093 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.563V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.129 22 16.992 22 12"></path></svg>
          </a>
          <a href="#" className="social-icon instagram">
            <svg viewBox="0 0 24 24" width="24px" height="24px" className="d Vb UmNoP" aria-hidden="true"><path d="M12 3.803c2.67 0 2.986.01 4.04.059.976.044 1.505.207 1.858.344.435.16.828.416 1.151.748.332.323.588.716.748 1.151.137.353.3.882.344 1.857.049 1.055.059 1.37.059 4.041 0 2.67-.01 2.986-.059 4.041-.044.975-.207 1.505-.344 1.857A3.32 3.32 0 0 1 17.9 19.8c-.352.137-.882.3-1.857.344-1.054.048-1.37.058-4.04.058s-2.987-.01-4.041-.058c-.975-.044-1.505-.207-1.857-.344a3.1 3.1 0 0 1-1.151-.748 3.1 3.1 0 0 1-.749-1.151c-.137-.353-.3-.883-.344-1.857-.048-1.055-.058-1.371-.058-4.041s.01-2.987.058-4.041c.045-.975.207-1.505.344-1.857a3.1 3.1 0 0 1 .749-1.151 3.1 3.1 0 0 1 1.15-.749c.353-.137.883-.3 1.858-.344 1.054-.048 1.37-.058 4.04-.058zM12.002 2c-2.716 0-3.057.012-4.124.06-1.066.05-1.793.22-2.428.466A4.9 4.9 0 0 0 3.678 3.68a4.9 4.9 0 0 0-1.153 1.772c-.247.635-.416 1.363-.465 2.427C2.012 8.943 2 9.286 2 12.002c0 2.715.012 3.056.06 4.123.05 1.066.218 1.791.465 2.426a4.9 4.9 0 0 0 1.153 1.772c.5.508 1.105.902 1.772 1.153.635.248 1.363.417 2.428.465s1.407.06 4.123.06 3.056-.01 4.123-.06 1.79-.217 2.426-.465a5.1 5.1 0 0 0 2.925-2.925c.247-.635.416-1.363.465-2.427.048-1.064.06-1.407.06-4.123s-.012-3.057-.06-4.123c-.05-1.067-.218-1.791-.465-2.426a4.9 4.9 0 0 0-1.153-1.771 4.9 4.9 0 0 0-1.772-1.155c-.635-.247-1.363-.416-2.428-.464s-1.406-.06-4.122-.06z"></path><path d="M12 6.866a5.135 5.135 0 1 0 0 10.27 5.135 5.135 0 0 0 0-10.27m0 8.47a3.334 3.334 0 1 1 0-6.669 3.334 3.334 0 0 1 0 6.669m5.338-7.473a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4"></path></svg>
          </a>
          <a href="#" className="social-icon twitter">
            <svg viewBox="0 0 24 24" width="24px" height="24px" className="d Vb UmNoP" aria-hidden="true"><path d="M13.905 10.47 21.35 2h-1.764L13.12 9.353 7.956 2H2l7.809 11.12L2 22h1.764l6.827-7.766L16.044 22H22M4.4 3.302h2.71l12.476 17.46h-2.71"></path></svg>
          </a>
        </div>

          <div className="language-selector">
            <span>Algérie</span>
            <button className="globe-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </button>
          </div>
          </div>


          <div className="footer-column">
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
    
    <div className="footer-bottom">
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
