import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import Login from "./Login/Login";
import NavLink from "./NavLink";
import { FaMagnifyingGlass } from "react-icons/fa6";
import shoppingCart from "../assets/shoppingCart.png";
import profileUser from "../assets/profile-user.png";

const Navigation = ({ onLoginClick, user }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        // Primero intentamos buscar por modelo
        let response = await fetch(`http://localhost:4002/products/${encodeURIComponent(searchQuery)}`);
        
        if (!response.ok) {
          // Si no se encuentra por modelo, intentamos buscar por marca
          response = await fetch(`http://localhost:4002/products/Brands/${encodeURIComponent(searchQuery)}`);
        }

        if (!response.ok) {
          throw new Error('Producto o marca no encontrada');
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          // Si es un array, asumimos que es una búsqueda por marca
          navigate(`/products/${searchQuery}`, { state: { products: data } });
        } else {
          // Si no es un array, asumimos que es un producto individual
          navigate(`/product/${searchQuery}`);
        }
      } catch (error) {
        console.error("Error en la búsqueda:", error);
        alert("Producto o marca no encontrada. Por favor, intente con otro término.");
      }
    }
  };

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      setIsLoginOpen(true);
    }
  };

  const closeLogin = () => {
    setIsLoginOpen(false);
  };

  return (
    <>
      <nav className="bg-gray-800 text-white p-4 shadow-xl">
        <div className="flex justify-between items-center">
          <NavLink to="/">
            <img src={logo} alt="Zapas el Tatita" className="h-20 w-auto" />
          </NavLink>
          <div className="flex items-center space-x-8">
            <ul className="flex space-x-8 text-lg font-semibold">
              <li>
                <NavLink to="/product">Productos</NavLink>
              </li>
            </ul>
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <input
                type="text"
                className="p-2 rounded-md text-gray-800 w-64"
                placeholder="Buscar por modelo o marca..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="p-1 bg-transparent flex items-center">
                <FaMagnifyingGlass />
              </button>
            </form>
          </div>
          <div className="flex items-center space-x-8">
            <NavLink to="/cart" className="flex items-center">
              <img src={shoppingCart} alt="Carrito" className="h-8 w-8" />
            </NavLink>
            <button
              onClick={handleLoginClick}
              className="flex items-center"
            >
              <img src={profileUser} alt="Login" className="h-8 w-8" />
            </button>
          </div>
        </div>
      </nav>
      <Login isOpen={isLoginOpen} onClose={closeLogin} />
    </>
  );
};

export default Navigation;