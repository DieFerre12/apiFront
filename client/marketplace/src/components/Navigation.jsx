import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import Login from "./Login/Login";
import NavLink from "./NavLink";
import { FaMagnifyingGlass } from "react-icons/fa6";
import shoppingCart from "../assets/shoppingCart.png"; // Importa la imagen del carrito
import profileUser from "../assets/profile-user.png"; // Importa la imagen del login

const Navigation = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleSearch = () => {
    console.log("Buscando:", searchQuery);
  };

  const handleLoginClick = () => {
    setIsLoginOpen(true);
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
                <NavLink to="/product">Producto</NavLink>
              </li>
            </ul>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                className="p-2 rounded-md text-gray-800 w-64"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button onClick={handleSearch} className="p-1 bg-transparent flex items-center">
                <FaMagnifyingGlass />
              </button>
            </div>
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
