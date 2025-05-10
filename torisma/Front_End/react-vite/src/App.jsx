import React from 'react';
import { Analytics } from "@vercel/analytics/react"
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/homepage';
import Connect from './pages/connect';
import SignUp from './pages/signup';
import Add from './pages/add';
import AddInfos from './pages/add-logement';
import AddCar from './pages/add-voiture';
import CarPage from './pages/CarPage';
import HousePage from './pages/HousePage';
import PasswordReset from './pages/recoverpassword';
import VerificationForm from './pages/verification-form';
import ResetPassword from './pages/resetpassword';
import Choose from './pages/choose';
import Moi from './pages/Moi';
import Voiture from './pages/voiture';
import Location from './pages/localisation';
import WhyAlgeria from './pages/whyAlgeria';
import MaisonListe from './pages/maisonListe';
import VoitureListe from './pages/voitureListe';

import RecMsg from './pages/recovermsg';
import CProfile from './pages/carProfile';
import HProfile from './pages/houseProfile';
import PaymentPage from './pages/PayementPage';
import ChatPage from './pages/help';
import Verified from './pages/verified';
import Terms from './pages/terms';
import WhyTourisma from './pages/whyTourisma';

import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/whyToursimA" element={<WhyTourisma />} />
      <Route path="/terms-&-conditions" element={<Terms />} />
      <Route path="/verified/:uidb64/:token" element={<Verified />} />
      <Route path="/help" element={<ChatPage />} />
      <Route path="/car" element={<CProfile />} />
      <Route path="/house" element={<HProfile />} />
      <Route path="/recmsg" element={<RecMsg />} />
      <Route path="/add-voiture" element={<AddCar />} />
      <Route path="/voiture-liste" element={<VoitureListe />} />
      <Route path="/maison-liste" element={<MaisonListe />} />
 <Route path="/add-logement" element={<AddInfos />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/moi" element={<Moi />} />
      <Route path="/voiture" element={<Voiture />} />
      <Route path="/localisation" element={<Location />} />
      <Route path="/whyalgeria" element={<WhyAlgeria />} />
      <Route path="/connect" element={<Connect />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/add" element={<Add />} />
      <Route path="/recoverpass" element={<PasswordReset />} />
      <Route path="/verification" element={<VerificationForm />} />
      <Route path="/reset" element={<ResetPassword />} />
      <Route path="/choose" element={<Choose />} />


        <Route path="/houses/:wilaya" element={<HousePage />} />
      <Route path="/cars/:wilaya" element={<CarPage />} />
      <Route path="/houses/:wilaya/:id" element={<HousePage />} />
      <Route path="/location/:wilaya/:id" element={<CarPage />} />
      <Route path="/house-details/:id" element={<HousePage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
