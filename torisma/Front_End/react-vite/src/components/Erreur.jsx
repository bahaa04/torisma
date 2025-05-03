
import React from 'react';
import './styles/Erreur.css';

function Erreur({ onRetry, onCancel }) {
  return (
    <div className="erreur-overlay">
      <div className="erreur-box">
        <h1>Confirmation échouée</h1>
        <h1>❌</h1>
        <h2>Veuillez réessayer.</h2>
        <p>• Veuillez vérifier le code que vous avez entré Ou la date de réservation, qui ne doit pas déjà être prise </p>
        <div className="button-group">
          <button className="retry-button" onClick={onRetry}>Réessayer</button>
          <button className="cancel-button" onClick={onCancel}>Annuler</button>
        </div>
      </div>
    </div>
  );
}

export default Erreur;