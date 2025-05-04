import React, { useState } from "react";
import Navbar from "../components/NavBar";
import CarList from "../components/car-list";
import Footer from "../components/footer";
import PaymentConfirmation from "../components/PaymentConfirmation";
import SuccessMessage from "../components/SuccessMessage";
import Error from "../components/Erreur";

function Voiture() {
  const [showPayment, setShowPayment] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Voitures disponibles</h1>
        <CarList />
      </div>

      {showPayment && (
        <PaymentConfirmation
          onBack={() => setShowPayment(false)}
          onConfirm={() => {
            setShowPayment(false);
            setShowSuccess(true);
          }}
          onError={() => {
            setShowPayment(false);
            setShowError(true);
          }}
        />
      )}
      {showSuccess && (
        <SuccessMessage onClose={() => setShowSuccess(false)} />
      )}
      {showError && (
        <Error
          onRetry={() => {
            setShowError(false);
            setShowPayment(true);
          }}
          onCancel={() => {
            setShowError(false);
          }}
        />
      )}
      <Footer />
    </div>
  );
}

export default Voiture;