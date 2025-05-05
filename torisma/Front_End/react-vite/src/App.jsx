import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/homepage'; // Adjust the path as needed
import Connect from './pages/connect';
import SignUp   from './pages/signup';
import Add   from './pages/add';
import AddInfos   from './pages/addinfos';
import CarPage from './pages/CarPage'
import HousePage from './pages/housepage'
import PasswordReset  from './pages/recoverpassword';
import VerificationForm from './pages/verification-form';
import ResetPassword from './pages/resetpassword';
import Choose from './pages/choose';
import Moi from './pages/Moi';
import Localisation from './pages/localisation';
import Voiture from './pages/voiture';
import WhyAlgeria from './pages/WhyAlgeria';

import './App.css';


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/connect" element={<Connect />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/add" element={<Add />} />
      <Route path="/addinfos" element={<AddInfos />} />
      <Route path="/recoverpass" element={<PasswordReset />} />
      <Route path="/verification" element={<VerificationForm />} />
      <Route path="/reset" element={<ResetPassword />} />
      <Route path="/choose" element={<Choose />} />
      <Route path="/houses/:wilaya" element={<HousePage />} />
      <Route path="/cars/:wilaya" element={<CarPage />} />
      <Route path="/houses/:wilaya/:id" element={<HousePage />} />
      <Route path="/location/:wilaya/:id" element={<CarPage />} />
      <Route path="/moi" element={<Moi />} />
      <Route path="/Pourquoi" element={<whyAlgeria />} />
      <Route path="/whyalgeria" element={<WhyAlgeria />} />
      <Route path="/localisation" element={<Localisation />} />
      <Route path="/voiture" element={<Voiture />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;