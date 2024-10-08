import React from "react";

const Product = ({ name, brand, sizes, price, description, images }) => {
  return (
    <div className="border rounded-lg p-6 mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-white">
      {/* Nombre del producto */}
      <h1 className="text-2xl font-bold mb-2 text-gray-800">{name}</h1>
      
      {/* Marca */}
      <h2 className="text-lg text-gray-600 mb-2">Marca: <span className="font-medium">{brand}</span></h2>
      
      {/* Descripción */}
      <p className="mb-4 text-gray-700">{description}</p>
      
      {/* Precio */}
      <p className="text-lg font-semibold text-green-600 mb-4">Precio: {price}</p>

      {/* Talles disponibles */}
      <h3 className="text-md font-semibold mb-2 text-gray-800">Talles disponibles:</h3>
      <div className="flex flex-wrap space-x-2 mb-4">
        {sizes.map((size) => (
          <span key={size} className="py-1 px-3 border rounded-full bg-gray-100 text-gray-800">
            {size}
          </span>
        ))}
      </div>

      {/* Imágenes del producto */}
      <div className="flex space-x-4">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${name} ${index + 1}`}
            className="w-24 h-24 object-cover border rounded-lg"
          />
        ))}
      </div>
    </div>
  );
};

export default Product;
