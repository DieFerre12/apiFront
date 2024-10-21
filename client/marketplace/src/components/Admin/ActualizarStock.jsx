import React, { useState, useEffect } from "react";

const ActualizarStock = ({ isOpen, onClose }) => {
  const [model, setModel] = useState(""); // Estado para el campo 'model'
  const [newPrice, setNewPrice] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [sizeStockMap, setSizeStockMap] = useState({}); // Para almacenar el stock por talla
  const [selectedSizes, setSelectedSizes] = useState([]); // Para almacenar las tallas seleccionadas

  const handleSizeChange = (size) => {
    setSelectedSizes((prevSizes) =>
      prevSizes.includes(size)
        ? prevSizes.filter((s) => s !== size)
        : [...prevSizes, size]
    );
  };

  const handleStockChange = (size, stock) => {
    setSizeStockMap((prevMap) => ({
      ...prevMap,
      [size]: parseInt(stock, 10),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const API_URL = "http://localhost:4002/products/updateProductPrice"; // URL correcta para actualizar el precio

    try {
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model,
          price: parseFloat(newPrice),
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Error al actualizar el precio");
      }

      const data = await response.json();
      console.log("Precio actualizado exitosamente:", data);
      setSuccessMessage("Precio actualizado exitosamente");
      setError(""); // Limpiar errores
      onClose(); // Cierra el modal o ventana al terminar el proceso
    } catch (err) {
      console.error("Error durante la actualización del precio:", err);
      setError(err.message);
      setSuccessMessage(""); // Limpiar mensajes de éxito
    }
  };

  const handleUpdateStock = async () => {
    const API_URL = "http://localhost:4002/products/updateProductSize"; // URL correcta para actualizar el stock

    try {
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model,
          sizeStockMap: sizeStockMap,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Error al actualizar el stock");
      }

      const data = await response.json();
      console.log("Stock actualizado exitosamente:", data);
      setSuccessMessage("Stock actualizado exitosamente");
      setError(""); // Limpiar errores
      onClose(); // Cierra el modal o ventana al terminar el proceso
    } catch (err) {
      console.error("Error durante la actualización del stock:", err);
      setError(err.message);
      setSuccessMessage(""); // Limpiar mensajes de éxito
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Actualizar Precio y Stock de Producto</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Modelo del Producto:</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Nuevo Precio:</label>
            <input
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Tallas y Stock:</label>
            <div className="flex flex-wrap">
              {['SIZE_37', 'SIZE_38', 'SIZE_39', 'SIZE_40', 'SIZE_41', 'SIZE_42'].map((size) => (
                <div key={size} className="w-1/2 mb-4">
                  <label className="mr-2">
                    <input
                      type="checkbox"
                      value={size}
                      checked={selectedSizes.includes(size)}
                      onChange={() => handleSizeChange(size)}
                      className="mr-2"
                    />
                    {size}
                  </label>
                  {selectedSizes.includes(size) && (
                    <input
                      type="number"
                      placeholder="Stock"
                      value={sizeStockMap[size] || ""}
                      onChange={(e) => handleStockChange(size, e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition"
          >
            Actualizar Precio
          </button>
          <button
            type="button"
            onClick={handleUpdateStock}
            className="mt-2 w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition"
          >
            Actualizar Stock
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mt-2 w-full bg-gray-300 text-gray-700 font-semibold py-2 rounded-md hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default ActualizarStock;