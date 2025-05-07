import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from '../components/navbar1-connected';
import Sidebar from '../components/Sidebar';
import Footer from '../components/footer';
import TwoCards from '../components/profileCardsHouse';
import '../styles/profileCards.css';

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
