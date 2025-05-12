import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/connect.css";
import Footer from "../components/footer";
import NavBar2 from "../components/navbar2";

const Connect = () => {
  const navigate = useNavigate();

  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !validateEmail(email.trim())) {
      setError("Format d'email invalide");
      return;
    }
    if (!password.trim()) {
      setError("Veuillez entrer votre mot de passe");
      return;
    }
    if (!termsAccepted) {
      setError("Veuillez accepter les conditions générales");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/users/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim() })
      });

      const data = await res.json();
      if (!res.ok) {
        // if your backend returns { detail: "..." } or similar
        setError(data.detail || 'Échec de la connexion');
        setLoading(false);
        return;
      }
      console.log(data.access);
      console.log(data.refresh);
      // store tokens
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);

      // redirect to home
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Erreur réseau, veuillez réessayer');
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <NavBar2 />
      <main>
        <div className="left-section" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%" }}>
          <div className="content fade-in" style={{ width: "100%", maxWidth: 400, textAlign: "center" }}>
            <p className="tagline">Découvrez la beauté de l'Algérie et au-delà.</p>
            <p className="description">
              Trouvez des destinations époustouflantes, louez des voitures et des maisons facilement, et commencez votre aventure dès aujourd'hui, tout en un seul endroit.
            </p>
            <div className="cta">
              <button className="join-btn" onClick={() => navigate('/signup')}>Rejoindre maintenant !</button>
            </div>
            <div className="illustration">
              <img src="/boy.png" alt="Illustration de tourisme" className="illustration-img" />
            </div>
          </div>
        </div>

        <div className="right-section slide-in">
          <div className="login-container">
            <h2>se connecter</h2>
            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <input
                  id="email-input"
                  type="email"
                  placeholder="Entrez votre email ou téléphone"
                  className="form-control"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                />
              </div>
              <div className="form-group">
                <input
                  id="password-input"
                  type="password"
                  placeholder="Mot de passe"
                  className="form-control"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                />
              </div>
              <div className="terms-checkbox">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={e => setTermsAccepted(e.target.checked)}
                />
                <label htmlFor="terms">
                  J'accepte les <span className="terms-link" onClick={() => navigate('/terms')}>conditions générales</span> du site
                </label>
              </div>
              {error && <p className="error-message">{error}</p>}
              <div className="forgot-password">
                <span className="recover-link" onClick={() => navigate('/recoverpass')}>Récupérer le mot de passe</span>
              </div>
              <button
                type="submit"
                className="signin-btn"
                disabled={loading}
              >
                {loading ? 'Connexion en cours...' : 'se connecter'}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Connect;
