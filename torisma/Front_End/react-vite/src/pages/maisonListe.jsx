import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from '../components/navbar1-connected';
import Sidebar from '../components/Sidebar';
import Footer from '../components/footer';
import TwoCards from '../components/profileCardsHouse';
import '../styles/profileCards.css';
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


function MaisonListe() {
  const navigate = useNavigate();
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('houses') || "[]");
    setHouses(stored);
  }, []);

  const handleAdd = () => {
    navigate('/addhouse?type=maison');
  };

  const handleEdit = (id) => {
    navigate(`/addhouse?type=maison&id=${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
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
      
      <main className="flex-grow profile-page-container flex">
        <aside className="profile-navigation"><Sidebar/></aside>
        <section className="flex-1">
          <TwoCards items={houses} onAdd={handleAdd} onEdit={handleEdit}/>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default MaisonListe;
