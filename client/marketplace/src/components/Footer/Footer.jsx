// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white text-center p-4">
      <div className="flex justify-evenly mt-2 space-x-4">
      <div>
        <h4 className="font-bold">Empresa</h4>
        <p className="text-gray-300 text-xs">Ofrecemos calzado de alta calidad.</p>
        <p className="text-gray-300 text-xs">Nuestro enfoque está en la comodidad y el estilo.</p>
        <p className="text-gray-300 text-xs">Comprometidos con la satisfacción del cliente.</p>
        </div>
        <div>
          <h4 className="font-bold">Explora</h4>
          <ul className="text-gray-300">
            <li><a href="/about" className="hover:underline">Acerca de</a></li>
            <li><a href="/contact" className="hover:underline">Contacto</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold">Seguinos</h4>
          <ul className="text-gray-300">
            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Twitter</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</a></li>
          </ul>
        </div>
      </div>
      <p className="mt-8 text-center">&copy; {new Date().getFullYear()} Zapas el Tatita. Todos los derechos reservados.</p>{/* Añadido mt-4 */}
    </footer>
  );
};

export default Footer;
