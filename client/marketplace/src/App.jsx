// src/App.jsx
import React, { useState } from "react";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer/Footer"; // Importa el Footer
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Home from "./views/Home";
import Product from "./views/Productos"; // Cambia esto para importar el componente de productos
import LoginModal from "./components/Login"; // Importa el modal de Login

const App = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false); // Estado para controlar el modal de login
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    navigate("/product"); // Cambia a la ruta de producto
  };

  const handleLoginClick = () => {
    setIsLoginOpen(true); // Abrir el modal de login
  };

  const handleCloseLogin = () => {
    setIsLoginOpen(false); // Cerrar el modal de login
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navigation />
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Product />} /> {/* Ruta para el componente Producto */}
        </Routes>
        <p className="mt-2 text-gray-600">La ruta actual es: {location.pathname}</p>
      </div>
      <Footer />
      <LoginModal isOpen={isLoginOpen} onClose={handleCloseLogin} /> {/* Modal de Login */}
    </div>
  );
};

export default App;
