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

const App = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    setIsLoginOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginOpen(false);
  };

  const handleLogin = (userData) => {
    setUser(userData);
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
        </Routes>
      </div>
      <Footer />
      <Login isOpen={isLoginOpen} onClose={handleCloseLogin} onLogin={handleLogin} />
    </div>
  );
};

export default App;