import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer/Footer"; // Importa el Footer
import Home from "./views/Home";
import ProductList from "./components/Product/ProductList"; // Asegúrate de que la ruta sea correcta
import ProductDetail from "./components/Product/ProductDetail"; // Asegúrate de que la ruta sea correcta
import Cart from "./components/Cart/Cart"; // Importa el componente Cart
import Register from "./views/Register";
import Login from "./components/Login/Login"; // Importa el componente Login
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";


const App = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false); // Estado para controlar el modal de login
  const [cart, setCart] = useState([]); // Estado del carrito
  const [user, setUser] = useState(null); // Estado del usuario
  const navigate = useNavigate();

  const handleLoginClick = () => {
    setIsLoginOpen(true); // Abrir el modal de login
  };

  const handleCloseLogin = () => {
    setIsLoginOpen(false); // Cerrar el modal de login
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoginOpen(false); // Cerrar el modal de login después de un inicio de sesión exitoso
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navigation />
      <div className="flex-grow p-4">
        {/* Configuramos las rutas */}
        <Routes>
          <Route path="/" element={<Home />} /> {/* Ruta principal */}
          <Route path="/product" element={<ProductList />} /> {/* Ruta de productos */}
          <Route path="/product/:model" element={<ProductDetail cart={cart} setCart={setCart} />} /> {/* Ruta de detalles por modelo */}
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} /> {/* Ruta del carrito */}
          <Route path="/login" element={<Login isOpen={true} onClose={() => navigate('/')} onLogin={handleLogin} />} /> {/* Ruta para login */}
          <Route path="/views/register" element={<Register />} /> {/* Ruta de registro */}
        </Routes>
      </div>
      <Footer />
      <Login isOpen={isLoginOpen} onClose={handleCloseLogin} onLogin={handleLogin} /> {/* Modal de Login */}
    </div>
  );
};

export default App;