// src/components/Product.jsx
import React from "react";

const Product = ({ name, brand, sizes, price, description, images }) => {
  return (
    <div className="border rounded p-4 mb-4">
      <h1 className="text-2xl font-bold mb-2">{name}</h1>
      <h2 className="text-xl mb-2">Marca: {brand}</h2>
      <p className="mb-2">Descripción: {description}</p>
      <p className="mb-2">Precio: {price}</p>
      
      <h3 className="font-semibold mb-2">Talles disponibles:</h3>
      <div className="flex space-x-2 mb-2">
        {sizes.map((size) => (
          <span key={size} className="py-1 px-2 border rounded">
            {size}
          </span>
        ))}
      </div>
      
      <div className="flex space-x-2">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${name} ${index + 1}`}
            className="w-20 h-auto object-cover border"
          />
        ))}
      </div>
    </div>
  );
};

export default Product;
