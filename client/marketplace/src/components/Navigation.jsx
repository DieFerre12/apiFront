// src/components/Navigation.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png"; // Asegúrate de que la ruta sea correcta
import Login from "./Login/Login"; // Asegúrate de que la ruta sea correcta
import NavLink from "./NavLink"; // Importa el componente NavLink
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoLogInOutline } from "react-icons/io5";



const Navigation = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false); // Estado para controlar la visibilidad del modal de login

  const handleSearch = () => {
    // Lógica para manejar la búsqueda
    console.log("Buscando:", searchQuery);
  };

  const handleLoginClick = () => {
    setIsLoginOpen(true); // Muestra el modal de login
  };

  const closeLogin = () => {
    setIsLoginOpen(false); // Cierra el modal de login
  };

  return (
    <>
      <nav className="bg-gray-800 text-white p-4 shadow-xl">
        <div className="flex justify-between items-center">
          <NavLink to="/">
            <img src={logo} alt="Zapas el Tatita" className="h-20 w-auto" />
          </NavLink>
          <ul className="flex space-x-8 text-lg font-semibold">
            <li>
              <NavLink to="/product" >
                Producto
              </NavLink>
            </li>
            <li>
              <NavLink to="/cart">
                Carrito
              </NavLink>
            </li>
          </ul>
          <div className="flex items-center space-x-2">
            {/* Barra de búsqueda ajustada */}
            <input
              type="text"
              className="p-2 rounded-md text-gray-800 w-64"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {/* Botón con imagen de búsqueda */}
            <button
              onClick={handleSearch}
              className="p-1 bg-transparent flex items-center"
            >
              <FaMagnifyingGlass />

            </button>
            {/* Botón para abrir el login */}
            <button
              onClick={handleLoginClick}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1.5 px-4 rounded-md flex items-center gap-3 text-md"
            >
              Login 
              <IoLogInOutline 
              size={30}/>
            </button>
          </div>
        </div>
      </nav>

      {/* Modal de Login */}
      <Login isOpen={isLoginOpen} onClose={closeLogin} />
    </>
  );
};

export default Navigation;
