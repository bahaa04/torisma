
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/navbar1";
import Footer from "../components/footer";
import Search from "../components/search";
import Logo from "../components/logo";
import "../styles/homepage.css";
import DestinationList from "../components/destination-list";
import OptionWillaya from "../components/optionwillaya";






export default function HomePage() {


  const initialDests = [
    {
      id: 1,
      location: "Alger",

      images: ["/alger1.jpg", "/alger3.jpg", "/alger2.jpg"],
    },
    {
      id: 2,
      location: "Bejaia",
      images: [
        "/bejaia1.jpg",
        "/bejaia2.jpg",
        "/bajaia3.jpg",
      ],
    },
    {
      id: 3,
      location: "Constantine",
      images: [
        "/constantine1.jpg",
        "/constantine2.jpg",
        "/constantine3.jpg",
      ],
    },





    {
      id: 4,
      location: "Skikda",
      images: [
        "/skikda1.jpg",
        "/skikda2.jpg",
        "/skikda3.jpg",
      ],
    },
    {
      id: 5,
      location: "Jijel",
      images: [
        "/jijel1.jpg",
        "/jijel2.jpg",
        "/jijel3.jpg",
      ],
    },
    {
      id: 6,
      location: "Bechar",
      images: [
        "/bechar1.jpg",
        "/bechar2.jpg",
        "/bechar3.jpg",
      ],
    },

    {
      id: 7,
      location: "Tlemcen",
      images: [
        "/tlemcen1.jpg",
        "/tlemcen2.jpg",
        "/tlemcen3.jpg",
      ],
    },

    {
      id: 8,
      location: "Setif",
      images: [
        "/setif1.jpg",
        "/setif2.jpg",
        "/setif3.jpg",
      ],
    },

    {
      id: 9,
      location: "Oran",
      images: [
        "/oran1.jpg",
        "/oran2.jpg",
        "/oran3.jpg",
      ],
    },
    {
      id: 10,
      location: "Tamenraset",
      images: [
        "/tamenraset3.jpg",
        "/tamenraset2.jpg",
        "/tamenraset1.jpg",
      ],
    },
    {
      id: 11,
      location: "Annaba",
      images: [
        "/annaba1.jpg",
        "/annaba2.jpg",
        "/annaba3.jpg",
      ],
    },
    {
      id: 12,
      location: "Ghardaia",
      images: [
        "/ghardaia1.jpg",
        "/ghardaia.jpg",
        "/ghardaia3.jpg",
      ],
    },


    
  ];

  const [dests, setDests] = useState(initialDests);

 const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);




  return (
    <>
<div className="homepage">


      <NavBar />

      
      <Search />

     
      <div className="categories">
       <OptionWillaya/>
      </div>

<div className="butt">
      <Link to="/add" className="no-underline"> 
          <button className="button" type="button">
            <span className="button__text">Ajoutez</span>
            <span className="button__icon">
              <svg className="svg" fill="none" height="24" stroke="currentColor"
                strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <line x1="12" x2="12" y1="5" y2="19"></line>
                <line x1="5" x2="19" y1="12" y2="12"></line>
              </svg>
            </span>
          </button>
        </Link> 
        </div>
        <br/>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-header">
          <h1 className="content-title">Explorez les wilayas d'Algérie et faites votre choix</h1>
          <p className="content-subtitle">
            Partez à la découverte des wilayas d'Algérie et choisissez votre prochaine destination.
          </p>
        </div>

        <div className="destinations-grid">
 <DestinationList dests={dests} />
      </div>
     



      {/* <!-- Help--> */}
    <div className="help-section">
      <p className="help-text">Vous hésitez entre mer, désert ou montagnes ? Si oui, essayez ceci</p>
      <a href="#" className="help-button">Aidez-moi</a>
    </div>
    </div>


    {/* <!-- Video --> */}
  <div className="video-banner">

    <video width="100%" height="100%" className="vid"  controls autoPlay  muted loop >
  <source src="/alg.mp4" type="video/mp4"/>
  Your browser does not support the video tag
</video>
  
<div className="banner-logo">
     
     <Logo/>
      <span className="logo-text">TourismA</span>
      </div>
      </div>

      <Footer/>

 </div>     
    </>
  );
}