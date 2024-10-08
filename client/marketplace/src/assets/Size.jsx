// src/components/Size.jsx
import React from "react";

const SizeSelector = ({ sizes, selectedSize, setSelectedSize }) => {
  return (
    <div className="mt-4">
      <p className="text-lg text-gray-800 font-semibold mb-2">Selecciona tu talla:</p>
      <div className="flex space-x-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => setSelectedSize(size)}
            className={`py-2 px-4 border rounded-lg shadow-md ${
              selectedSize === size
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-800 hover:bg-blue-200"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
      {selectedSize && (
        <p className="mt-2 text-sm text-gray-600">Talla seleccionada: {selectedSize}</p>
      )}
    </div>
  );
};

export default SizeSelector;
