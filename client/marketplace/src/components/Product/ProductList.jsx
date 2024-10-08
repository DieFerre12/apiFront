// src/components/ProductList.jsx
import React from "react";
import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Zapatilla Modelo A",
    price: "$9500",
    images: [
      "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_706,h_706/global/397370/02/sv01/fnd/ARG/fmt/png"
    ]
  },
  {
    id: 2,
    name: "Zapatilla Modelo B",
    price: "$11500",
    images: [
      "https://nikearprod.vtexassets.com/arquivos/ids/658094-1200-1200?width=1200&height=1200&aspect=true"
    ]
  }
  // Añade más productos aquí
];

const ProductList = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-black mb-4">Lista de Productos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border p-4 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
          >
            <Link to={`/product/${product.id}`}>
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-64 object-cover mb-2 rounded-lg transition-transform duration-300 transform hover:scale-105"
              />
              <h2 className="text-xl font-bold text-gray-800 mb-1">{product.name}</h2>
              <p className="text-lg font-semibold text-gray-600">{product.price}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
