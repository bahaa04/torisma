import React from 'react';
import "../styles/terms.css";
import NavBar from "../components/navbar1";
import NavbarC from '../components/navbar1-connected';
import Footer from "../components/footer";

const Terms = () => {
    return (
        <div className="terms-page">
            <NavBar />
            <div className="terms-container">
                <h1>Termes et Conditions</h1>
                
                <p className="intro">
                    Bienvenue sur TourismA ! En accédant ou en utilisant notre plateforme, vous acceptez d'être lié par les termes et conditions suivants. Veuillez les lire attentivement.
                </p>

                <section className="terms-section">
                    <h2>1. Acceptation des Conditions</h2>
                    <p>En accédant ou en utilisant TourismA, vous reconnaissez avoir lu, compris et accepté de respecter ces conditions. Si vous n'êtes pas d'accord avec une partie de ces conditions, vous ne devez pas utiliser nos services.</p>
                </section>

                <section className="terms-section">
                    <h2>2. Utilisation de la Plateforme</h2>
                    <ul>
                        <li>Vous devez avoir au moins 18 ans pour utiliser TourismA ou avoir le consentement d'un tuteur légal.</li>
                        <li>Vous acceptez d'utiliser la plateforme à des fins légales uniquement et de ne pas vous engager dans des activités frauduleuses ou nuisibles.</li>
                    </ul>
                </section>

                <section className="terms-section">
                    <h2>3. Comptes Utilisateur</h2>
                    <ul>
                        <li>Vous êtes responsable de la confidentialité de vos informations de compte.</li>
                        <li>Vous acceptez de nous informer immédiatement de toute utilisation non autorisée de votre compte.</li>
                    </ul>
                </section>

                <section className="terms-section">
                    <h2>4. Réservation et Annulations</h2>
                    <ul>
                        <li>Toutes les réservations sont soumises à disponibilité et à confirmation par les prestataires de services.</li>
                        <li>Les politiques d'annulation peuvent varier et seront précisées au moment de la réservation.</li>
                    </ul>
                </section>

                <section className="terms-section">
                    <h2>5. Paiement</h2>
                    <ul>
                        <li>Les paiements sont traités de manière sécurisée via notre passerelle de paiement désignée.</li>
                        <li>Vous acceptez de fournir des informations de paiement exactes et de nous autoriser à débiter le montant total spécifié.</li>
                    </ul>
                </section>

                <section className="terms-section">
                    <h2>6. Limitation de Responsabilité</h2>
                    <ul>
                        <li>TourismA n'est pas responsable des dommages directs, indirects ou consécutifs résultant de l'utilisation de notre plateforme.</li>
                        <li>Nous ne garantissons pas l'exactitude, l'exhaustivité ou la fiabilité des informations fournies par des prestataires tiers.</li>
                    </ul>
                </section>

                <section className="terms-section">
                    <h2>7. Politique de Confidentialité</h2>
                    <p>Votre utilisation de TourismA est également régie par notre Politique de Confidentialité, qui est intégrée par référence.</p>
                </section>

                <section className="terms-section">
                    <h2>8. Modifications des Conditions</h2>
                    <p>Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications prendront effet immédiatement après leur publication.</p>
                </section>

                <section className="terms-section">
                    <h2>9. Résiliation</h2>
                    <p>Nous pouvons suspendre ou résilier votre compte si vous violez ces conditions ou vous engagez dans des activités frauduleuses.</p>
                </section>

                <section className="terms-section">
                    <h2>10. Loi Applicable</h2>
                    <p>Ces conditions sont régies et interprétées conformément aux lois de [Votre Juridiction].</p>
                </section>
            </div>
            <Footer />
        </div>
    );
};

export default Terms;


