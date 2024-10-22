import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const SearchResults = () => {
  const location = useLocation();
  const results = location.state?.results || [];

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Resultados de la búsqueda</h2>
      {results.length === 0 ? (
        <p>No se encontraron resultados.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((product) => (
            <li key={product.id} className="border rounded-lg overflow-hidden shadow-lg">
              <Link to={`/product/${product.model}`} className="block">
                <img src={product.image} alt={product.model} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{product.model}</h3>
                  <p className="text-gray-700 text-sm mb-2">{product.description}</p>
                  <p className ="text-green-600 font-bold">${product.price}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResults;