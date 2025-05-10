import React from 'react';
import "../styles/whyTourisma.css";
import NavBar from "../components/navbar1";
import Footer from "../components/footer";

const WhyTourisma = () => {
    const features = [
        {
            title: "1. Offre Double Unique",
            text: "TourismA est la première et la seule plateforme (pour l'instant) qui permet aux utilisateurs de louer à la fois des maisons et des voitures à partir d'un service unique et intégré. Gérez vos besoins d'hébergement et de transport sans effort, en un seul endroit."
        },
        {
            title: "2. Processus de Réservation Simplifié",
            text: "Notre plateforme conviviale simplifie l'ensemble du processus de réservation, vous permettant de réserver votre séjour et votre véhicule simultanément, vous faisant gagner du temps et des efforts."
        },
        {
            title: "3. Large Gamme d'Options",
            text: "Des villas de luxe aux appartements économiques et des voitures compactes aux VUS haut de gamme, TourismA propose une vaste sélection pour répondre aux besoins et au budget de chaque voyageur."
        },
        {
            title: "4. Hôtes de Confiance et Vérifiés",
            text: "Nous nous assurons que chaque maison et voiture listée sur notre plateforme est vérifiée, vous offrant ainsi tranquillité d'esprit et une expérience de voyage sûre."
        },
        {
            title: "5. Tarification Compétitive",
            text: "Notre modèle de tarification transparent garantit l'absence de frais cachés, avec des options de réservation flexibles adaptées à votre budget et à vos préférences."
        },
        {
            title: "6. Expérience de Voyage Personnalisée",
            text: "Personnalisez votre itinéraire de voyage en sélectionnant le type exact d'hébergement et de véhicule dont vous avez besoin, garantissant un voyage confortable et pratique."
        },
        {
            title: "7. Support Client 24/7",
            text: "Notre équipe de service client dédiée est disponible 24 heures sur 24 pour vous aider avec les réservations, les demandes de renseignements et tout problème imprévu pendant votre voyage."
        },
        {
            title: "8. Système de Paiement Sécurisé",
            text: "TourismA utilise des mesures de sécurité de pointe pour protéger vos informations financières, garantissant des transactions sûres et fiables."
        },
        {
            title: "9. Options de Voyage Éco-responsables",
            text: "Nous promouvons le tourisme durable en proposant des options de véhicules écologiques et des hébergements avec des certifications écologiques."
        },
        {
            title: "10. Axé sur la Communauté",
            text: "TourismA met en relation les voyageurs avec les hôtes locaux, favorisant les échanges culturels et soutenant les petites entreprises dans les destinations de voyage."
        }
    ];

    return (
       <>
            <NavBar />
             <div className="why-tourisma-page">
            <div className="why-tourisma-container">
                <h1>Pourquoi Choisir TourismA ?</h1>
                
                <p className="intro">
                    TourismA révolutionne l'expérience de voyage en proposant une plateforme complète qui vous permet de louer et d'attribuer des maisons et des voitures en toute transparence. Voici pourquoi TourismA est le choix idéal pour les voyageurs, les propriétaires de maisons et les propriétaires de voitures :
                </p>

                <div className="features-timeline">
                    {features.map((feature, index) => (
                        <div key={index} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                            <div className="feature-card">
                                <h2>{feature.title}</h2>
                                <p>{feature.text}</p>
                            </div>
                            <div className="timeline-dot"></div>
                        </div>
                    ))}
                </div>

                <div className="conclusion">
                    <p>Choisissez TourismA et vivez une solution de voyage complète et transparente qui va au-delà de l'hébergement et du transport. Découvrez la liberté d'explorer selon vos conditions, le tout en un seul endroit.</p>
                </div>
            </div>
            <Footer />
        </div>
        </>
    );
};

export default WhyTourisma;