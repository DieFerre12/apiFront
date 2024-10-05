// src/App.jsx
import React from "react";
import Navigation from "./components/Navigation";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Home from "./views/Home";
import Contact from "./views/Contact";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    navigate("/contact");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navigation />
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <button 
          onClick={handleClick} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Ir a contacto
        </button>
        <p className="mt-2 text-gray-600">La ruta actual es: {location.pathname}</p>
      </div>
    </div>
  );
};

export default App;
