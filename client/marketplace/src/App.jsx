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
import AdminView from "./views/AdminView";
import SearchResults from "./components/SearchResults"; // Importa el nuevo componente SearchResults
import UserDetails from "./components/PreOrder/UserDetails"; // Importa el componente UserDetails

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
    // Redirigir a la página de administración si el usuario es admin
    if (userData.role === "ADMIN") {
      navigate("/admin");
    } else {
      navigate("/"); // Redirigir a la página principal o a otra página si no es admin
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navigation onLoginClick={handleLoginClick} user={user} />
      <div className="flex-grow p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<ProductList />} />
          <Route path="/product/:model" element={<ProductDetail cart={cart} setCart={setCart} />} />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
          <Route path="/login" element={<Login isOpen={true} onClose={() => navigate('/')} onLogin={handleLogin} />} />
          <Route path="/views/register" element={<Register />} />
          <Route path="/order" element={<Order />} />
          <Route path="/admin" element={<AdminView />} />
          <Route path="/products/:brand" element={<ProductList />} />
          <Route path="/search-results" element={<SearchResults />} /> {/* Nueva ruta para los resultados de búsqueda */}
          <Route path="/userDetails" element={<UserDetails />} /> {/* Nueva ruta para los detalles del usuario */}
        </Routes>
      </div>
      <Footer />
      <Login isOpen={isLoginOpen} onClose={handleCloseLogin} onLogin={handleLogin} />
    </div>
  );
};

export default App;