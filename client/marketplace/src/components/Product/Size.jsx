import React from "react";

const SizeSelector = ({ sizesWithStock, selectedSize, setSelectedSize }) => {
  const handleSizeChange = (event) => {
    setSelectedSize(event.target.value);
  };

  return (
    <div className="mt-4">
      <label htmlFor="size" className="block text-lg font-semibold mb-2">
        Selecciona un Talle:
      </label>
      <select
        id="size"
        value={selectedSize}
        onChange={handleSizeChange}
        className="w-full p-2 border rounded-md"
      >
        <option value="">-- Seleccionar --</option>
        {Object.entries(sizesWithStock).map(([size, stock]) => (
          <option key={size} value={size} disabled={stock === 0}>
            Talle {size} (Stock: {stock})
          </option>
        ))}
      </select>

      {selectedSize && (
        <p className="mt-2 text-green-600">
          Has seleccionado el talle <strong>{selectedSize}</strong>.
        </p>
      )}
    </div>
  );
};

export default SizeSelector;
