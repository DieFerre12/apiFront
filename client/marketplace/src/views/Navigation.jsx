import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/contact">Contacto</Link></li>
        <li><Link to="/cart">Carrito</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation;
