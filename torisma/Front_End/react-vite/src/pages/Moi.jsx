import { Suspense } from "react";
import { useNavigate } from "react-router-dom";
import NavBarC from '../components/navbar1-connected';
import Sidebar from '../components/Sidebar';
import ProfileInformations from "../components/ProfileInformations";
import Footer from '../components/footer';
import { ArrowLeft } from 'lucide-react';

const buttonStyles = {
  backContainer: {
    padding: '20px',
    marginTop: '0',
    borderBottom: '1px solid #eee'
  },  
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    backgroundColor: 'transparent',
    color: '#666',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.3s ease'
  }
};

function Moi() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBarC />
      <div style={buttonStyles.backContainer}>
        <button 
          onClick={() => navigate('/')} 
          style={buttonStyles.backButton}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <ArrowLeft className="back-icon" /> Retour aux wilayas
        </button>
      </div>
      {/* wrap sidebar + content in your “profile‑page‑container” */}
      <main className="flex-grow profile-page-container">
        <aside className="profile-navigation">
          <Sidebar />
        </aside>

        <section className="profile-content">
          <Suspense fallback={<div>Loading...</div>}>
            <ProfileInformations />
          </Suspense>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Moi;
