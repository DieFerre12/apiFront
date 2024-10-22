import React, { useState } from "react";

const ActualizarPrecio = ({ isOpen, onClose }) => {
  const [model, setModel] = useState(""); // Estado para el campo 'model'
  const [newPrice, setNewPrice] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleUpdatePrice = async (e) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Actualizar Precio de Producto</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
        <form onSubmit={handleUpdatePrice}>
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
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition"
          >
            Actualizar Precio
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

export default ActualizarPrecio;