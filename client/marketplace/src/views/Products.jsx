import React from "react";
import { Link } from "react-router-dom";



const Product = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-black mb-4">Productos Disponibles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded-lg shadow-md">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover mb-4 rounded-md"
            />
            <div>
              <Link
                to={`/product/${product.id}`}
                className="text-blue-500 hover:underline font-semibold text-2xl"
              >
                {product.name}
              </Link>
            </div>
            <h2 className="text-xl font-bold text-black">{product.brand}</h2>
            <p className="text-gray-600 mb-2">{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;