import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer/Footer";
import Home from "./views/Home";
import ProductList from "./components/Product/ProductList";
import ProductDetail from "./components/Product/ProductDetail";
import Cart from "./components/Cart/Cart";
import Register from "./views/Register";
import Login from "./components/Login/Login";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Order from "./views/Order";
import AdminView from "./views/AdminView"; // Asegúrate de importar el componente AdminView

const App = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [user, setUser ] = useState(null);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    setIsLoginOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginOpen(false);
  };

  const handleLogin = (userData) => {
    setUser (userData);
    setIsLoginOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navigation />
      <div className="flex-grow p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<ProductList />} />
          <Route path="/product/:model" element={<ProductDetail cart={cart} setCart={setCart} />} />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
          <Route path="/login" element={<Login isOpen={true} onClose={() => navigate('/')} onLogin={handleLogin} />} />
          <Route path="/views/register" element={<Register />} />
          <Route path="/order" element={<Order />} />
          <Route path="/admin" element={<AdminView />} /> {/* Agrega la ruta para AdminView */}
          <Route path="/products/:brand" element={<ProductList />} />

        </Routes>
      </div>
      <Footer />
      <Login isOpen={isLoginOpen} onClose={handleCloseLogin} onLogin={handleLogin} />
      {/* Botón para redirigir a AdminView */}
      <button onClick={() => navigate('/admin')} className="fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition">
        Ir a Admin
      </button>
    </div>
  );
};

export default App;