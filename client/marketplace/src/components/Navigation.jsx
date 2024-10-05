// src/components/Navigation.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png"; // Asegúrate de que la ruta sea correcta
import searchIcon from "../assets/buscar.png"; // Tu imagen de botón de búsqueda

const Navigation = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    // Lógica para manejar la búsqueda
    console.log("Buscando:", searchQuery);
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Zapas el Tatita" className="h-20 w-auto" />
        </Link>
        <ul className="flex space-x-8 text-lg font-semibold">
          <li><Link to="/contact" className="text-yellow-300 hover:text-yellow-400">Contacto</Link></li>
          <li><Link to="/cart" className="text-green-300 hover:text-green-400">Carrito</Link></li>
        </ul>
        <div className="flex items-center space-x-2 justify-between">
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
            <img 
              src={searchIcon} 
              alt="Buscar" 
              className="h-6 w-6 object-contain" 
            /> {/* object-contain para evitar distorsión */}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
