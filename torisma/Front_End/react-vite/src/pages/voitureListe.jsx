import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from '../components/navbar1-connected';
import Sidebar from '../components/Sidebar';
import Footer from '../components/footer';
import TwoCards from '../components/profileCardsCar';
import '../styles/profileCards.css';

function VoitureListe() {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cars') || "[]");
    setCars(stored);
  }, []);

  const handleAdd = () => {
    navigate('/addcar?type=voiture');
  };

  const handleEdit = (id) => {
    navigate(`/addcar?type=voiture&id=${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow profile-page-container flex">
        <aside className="profile-navigation"><Sidebar/></aside>
        <section className="flex-1">
          <TwoCards items={cars} onAdd={handleAdd} onEdit={handleEdit}/>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default VoitureListe;
