import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/homepage';
import Connect from './pages/connect';
import SignUp from './pages/signup';
import AddInfos from './pages/add-logement';
import AddCar from './pages/add-voiture';
import CarPage from './pages/CarPage';
import HousePage from './pages/HousePage';
import VoitureListe from './pages/voitureListe';
import MaisonListe from './pages/maisonListe';
import PasswordReset from './pages/recoverpassword';
import VerificationForm from './pages/verification-form';
import ResetPassword from './pages/resetpassword';
import Choose from './pages/choose';
import Moi from './pages/Moi';
import Voiture from './pages/voiture';
import Location from './pages/localisation';
import WhyAlgeria from './pages/whyAlgeria';
import HProfile from './pages/houseProfile';
import CProfile from './pages/carProfile';
import WhyTourisma from './pages/whyTourisma';
import StripePayment from './pages/StripePayement'
import PaymentPage from './pages/PayementPage'
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/payement2" element={<PaymentPage />} />
      <Route path="/payement" element={<StripePayment />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/whyTourisma" element={<WhyTourisma />} />
      <Route path="/whyalgeria" element={<WhyAlgeria />} />
      <Route path="/connect" element={<Connect />} />
      <Route path="/recoverpass" element={<PasswordReset />} />
      <Route path="/reset" element={<ResetPassword />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/verification" element={<VerificationForm />} />
      <Route path="/choose" element={<Choose />} />
      <Route path="/houses/:wilaya" element={<HousePage />} />
      <Route path="/localisation" element={<Location />} />
      <Route path="/cars/:wilaya" element={<CarPage />} />
      <Route path="/voiture" element={<Voiture />} />
      <Route path="/moi" element={<Moi />} />
      <Route path="/voiture-liste" element={<VoitureListe />} />
      <Route path="/car/:id" element={<CProfile />} />
      <Route path="/add-voiture" element={<AddCar />} />
      <Route path="/maison-liste" element={<MaisonListe />} />
      <Route path="/add-logement" element={<AddInfos />} />
      <Route path="/house/:id" element={<HProfile />} />
    </Routes>
  );
}

export default App;