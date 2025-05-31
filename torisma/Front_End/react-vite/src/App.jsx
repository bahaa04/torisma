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
import PaymentPage from './pages/PayementPage';
import ChatPage from './pages/ChatPage';
import Terms from './pages/terms';
import Verified from './pages/verified';
import { ProtectedRoute, AuthOnlyRoute } from './components/ProtectedRoute';
import ConfirmationPage from './pages/confirmation';
import CancellationPage from './pages/annulation';
import ChangePassword from './pages/passMod';
import './App.css';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/whyTourisma" element={<WhyTourisma />} />
      <Route path="/whyalgeria" element={<WhyAlgeria />} />
      <Route path="/houses/:wilaya" element={<HousePage />} />
      <Route path="/cars/:wilaya" element={<CarPage />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/help" element={<ChatPage />} />
      <Route path="/verified/:uidb64/:token" element={<Verified />} />
      <Route path="/voiture/:id" element={<Voiture />} />
      <Route path="/localisation/:id" element={<Location />} />
      <Route path="/choose" element={<Choose />} />
      <Route path="/voiture-liste" element={<VoitureListe />} />
      <Route path="/maison-liste" element={<MaisonListe />} />
      <Route path="/confirmation" element={<ConfirmationPage />} />
      <Route path="/annulation" element={<CancellationPage />} />
      <Route path="/reset" element={<ResetPassword />} />
      <Route path="/change" element={<ChangePassword />} />
      <Route path="/reset/:uid/:token" element={<ResetPassword />} />

      {/* Auth-only routes (shouldn't be accessible when logged in) */}
      <Route path="/connect" element={
        <AuthOnlyRoute>
          <Connect />
        </AuthOnlyRoute>
      } />
      <Route path="/signup" element={
        <AuthOnlyRoute>
          <SignUp />
        </AuthOnlyRoute>      } />
      <Route path="/recoverpass" element={
        <AuthOnlyRoute>
          <PasswordReset />
        </AuthOnlyRoute>
      } />
      <Route path="/verification" element={
        <VerificationForm />
      } />

      {/* Protected routes (require authentication) */}
      <Route path="/moi" element={
        <ProtectedRoute>
          <Moi />
        </ProtectedRoute>
      } />
      <Route path="/car/:id" element={
        <ProtectedRoute>
          <CProfile />
        </ProtectedRoute>
      } />
      <Route path="/add-voiture" element={
        <ProtectedRoute>
          <AddCar />
        </ProtectedRoute>
      } />
      <Route path="/add-logement" element={
        <ProtectedRoute>
          <AddInfos />
        </ProtectedRoute>
      } />
      <Route path="/house/:id" element={
        <ProtectedRoute>
          <HProfile />
        </ProtectedRoute>
      } />
      <Route path="/payement" element={
          <PaymentPage />
      } />
      
      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;