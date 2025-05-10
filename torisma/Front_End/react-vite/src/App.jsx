import { Routes, Route, Navigate } from 'react-router-dom';
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
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/add-voiture" element={<AddCar />} />
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;