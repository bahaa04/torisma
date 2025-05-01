import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import "./App.css";
import Localisation from "./pages/localisation";
import Voiture from "./pages/voiture";
import Whyalgeria from "./pages/whyalgeria";
import Moi from "./pages/moi";

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/localisation" element={<Localisation />} />
      <Route path="/voiture" element={<Voiture />} />
      <Route path="/whyalgeria" element={<Whyalgeria />} />
      <Route path="/moi" element={<Moi />} />
    </Routes>
  </Router>
  );
}

export default App;
