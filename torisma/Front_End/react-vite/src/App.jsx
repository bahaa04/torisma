import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/homepage'; // Adjust the path as needed
import Connect from './pages/connect'; 
import SignUp   from './pages/signup';
import Add   from './pages/add';
import AddInfos   from './pages/addinfos';
import Maison1   from './pages/maison1';
import Voiture1   from './pages/voiture1';
import CarPage from './location/[id]/page'
import DestPage from './willayat/[id]/page'
import  MaisonAlger  from './pages/maison-alger';
import  VoitureAlger  from './pages/voiture-alger';




import './App.css'; 

function App() {
  return (
    <Routes>
   
      <Route path="/" element={<HomePage />} />

    
      <Route path="/connect" element={<Connect />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/add" element={<Add />} />
      <Route path="/addinfos" element={<AddInfos />} />
      
      <Route path="/maison1" element={<Maison1 />} />
     <Route path="/voiture1" element={<Voiture1 />}  />
     <Route path="/masion-alger" element={<MaisonAlger />}  />
     <Route path="/voiture-alger" element={<VoitureAlger />}  />





        {/* dynamic-location route */}
        <Route path="/location/:id" element={<CarPage />} />
        <Route path="/willayat/:id" element={<DestPage />} />



 

      {/* Fallback: redirect unknown URLs back to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
