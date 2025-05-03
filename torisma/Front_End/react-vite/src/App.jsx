import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/homepage'; // Adjust the path as needed
import Connect from './pages/connect';
import SignUp   from './pages/signup';
import Add   from './pages/add';
import AddInfos   from './pages/addinfos';
import CarPage from './pages/CarPage'
import HousePage from './pages/HousePage'
import PasswordReset  from './pages/recoverpassword';
import VerificationForm from './pages/verification-form';
import ResetPassword from './pages/resetpassword';
import Choose from './pages/choose';

import './App.css';


function App() {
  return (
    <Routes>
   
      <Route path="/" element={<HomePage />} />

    
      <Route path="/connect" element={<Connect />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/add" element={<Add />} />
      <Route path="/addinfos" element={<AddInfos />} />
      
     <Route path="/recoverpass" element={<PasswordReset />}  />
     <Route path="/verification" element={<VerificationForm />}  />
     <Route path="/reset" element={<ResetPassword />}  />
     <Route path="/choose" element={<Choose />} />
     
    
     




        {/* dynamic-location route */}
        <Route path="/houses/:wilaya" element={<HousePage />} />
        <Route path="/cars/:wilaya" element={<CarPage />} />
        <Route path="/houses/:wilaya/:id" element={<HousePage />} />
        <Route path="/location/:wilaya/:id" element={<CarPage />} />



 

      {/* Fallback: redirect unknown URLs back to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
