import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SiNike, SiAdidas, SiPuma } from "react-icons/si";
import { GiAlliedStar } from "react-icons/gi";
import vans from '../assets/vans.png';

const Brands = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleBrandClick = async (brand) => {
    try {
      const response = await fetch(`http://localhost:4002/products/brand/${brand}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(`Error al obtener productos para la marca ${brand}`);

      const data = await response.json();
      console.log(`Productos obtenidos para la marca ${brand}:`, data);

      // Navegar a la página de productos con los datos obtenidos
      navigate(`/products/${brand}`, { state: { products: data } });
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="flex justify-center space-x-20 my-4">
      {error && <p className="text-red-500">{error}</p>}
      <Link to="#" onClick={() => handleBrandClick('NIKE')}>
        <SiNike className="h-16 w-auto"/>
      </Link>
      <Link to="#" onClick={() => handleBrandClick('ADIDAS')}>
        <SiAdidas className="h-16 w-auto" />
      </Link>
      <Link to="#" onClick={() => handleBrandClick('CONVERSE')}>
        <GiAlliedStar className="h-16 w-auto" />
      </Link>
      <Link to="#" onClick={() => handleBrandClick('VANS')}>
        <img src={vans} alt="Vans" className="h-16 w-auto" />
      </Link>
      <Link to="#" onClick={() => handleBrandClick('PUMA')}>
        <SiPuma className="h-16 w-auto" />
      </Link>
    </div>
  );
};

export default Brands;