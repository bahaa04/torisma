import React from 'react';
import './styles/Pourquoi.css';
import why1 from '../assets/why1.jpg'; // Replace with your actual image paths
import why2 from '../assets/why2.jpg';
import why3 from '../assets/why3.jpg';
import why4 from '../assets/why4.jpg';




const Pourquoi = () => {
  return (
    <div className="pourquoi-container reversed"> {/* Added 'reversed' class */}
      <div className="image-carousel">
        <div className="spinning-circle">
          <span style={{ '--i': 1 }}><img src={why1} alt="" /></span>
          <span style={{ '--i': 2 }}><img src={why2} alt="" /></span>
          <span style={{ '--i': 3 }}><img src={why3} alt="" /></span>
          <span style={{ '--i': 4 }}><img src={why4} alt="" /></span>
        </div>
      </div>
      <div className="text-content">
        <div className="title-container">
          <span className="pourquoi-label">Pourquoi</span>
          <span className="dz-label">DZ</span>
        </div>
        <h2 className="main-title">L'Algérie, trésor du Maghreb, beauté entre mer et désert</h2>
        <p className="description">
          terre de beauté et d'histoire, dévoile ses plages méditerranéennes, ses montagnes majestueuses et son Sahara infini.
          Ses villes chargées de culture et son peuple chaleureux en font un pays unique et fascinant.
        </p>
        <button className="explore-button">Explorez, découvrez, savourez.</button>
      </div>
    </div>
  );
};

export default Pourquoi;