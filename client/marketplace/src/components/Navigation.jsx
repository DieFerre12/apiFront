// src/components/Navigation.jsx
import React from "react";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="flex justify-between items-center">
        <div className="text-xl font-bold">Zapas el Tatita</div>
        <ul className="flex space-x-4">
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/contact">Contacto</Link></li>
          <li><Link to="/cart">Carrito</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
