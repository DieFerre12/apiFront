// src/App.jsx
import React, { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer/Footer"; // Importa el Footer
import Home from "./views/Home";
import Product from "./components/Product/Product";
import LoginModal from "./components/Login"; // Importa el modal de Login
import ProductList from "./components/Product/ProductList"; // Asegúrate de que la ruta sea correcta
import ProductDetail from "./components/Product/ProductDetail"; // Asegúrate de que la ruta sea correcta
import SizeSelector from "./components/Product/Size";
import PostList from "./components/PostCarpet/PostList";
import Admin from "./views/Admin";
import Register from "./views/Register";

const App = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false); // Estado para controlar el modal de login
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginClick = () => {
    setIsLoginOpen(true); // Abrir el modal de login
  };

  const handleCloseLogin = () => {
    setIsLoginOpen(false); // Cerrar el modal de login
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navigation />
      <div className="flex-grow p-4">
        {/* Configuramos las rutas */}
        <Routes>
          <Route path="/" element={<Home />} /> {/* Ruta principal */}
          <Route path="/product" element={<ProductList />} /> {/* Ruta de productos */}
          <Route path="/product/:model" element={<ProductDetail />} /> {/* Ruta de detalles por modelo */}
          <Route path="/admin" element={<Admin />} /> {/* Ruta de administración */}
          <Route path="/register" element={<Register />} /> {/* Ruta de registro */}
        </Routes>
      </div>
      <Footer />
      <LoginModal isOpen={isLoginOpen} onClose={handleCloseLogin} /> {/* Modal de Login */}
    </div>
  );
};

export default App;
