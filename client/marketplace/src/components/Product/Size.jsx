// src/components/SizeSelector.jsx
import React from "react";

const SizeSelector = ({ sizes, selectedSize, setSelectedSize }) => {
  return (
    <div className="mb-4">
      <label className="block text-lg font-semibold mb-2">Seleccionar Talle:</label>
      <select
        value={selectedSize}
        onChange={(e) => setSelectedSize(e.target.value)}
        className="p-2 border rounded-md"
      >
        <option value="" disabled>Selecciona un talle</option>
        {sizes.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SizeSelector;
