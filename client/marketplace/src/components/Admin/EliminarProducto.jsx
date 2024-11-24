import React, { useState } from "react";
import Swal from "sweetalert2";

const EliminarProducto = ({ isOpen, onClose }) => {
  const [model, setModel] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleDelete = async (e) => {
    e.preventDefault();
    const API_URL = `http://localhost:4002/products/${model}`; 

    console.log("Enviando solicitud para eliminar producto:", { model }); 

    try {
      const response = await fetch(API_URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Respuesta del servidor:", response); 

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Error al eliminar el producto");
      }

      console.log("Producto eliminado exitosamente");
      Swal.fire({
        icon: 'success',
        title: 'Producto eliminado exitosamente',
        showConfirmButton: false,
        timer: 1500
      });
      setSuccessMessage("Producto eliminado exitosamente");
      setError(""); // Limpiar errores
      onClose(); // Cierra el modal o ventana al terminar el proceso
    } catch (err) {
      console.error("Error durante la eliminación del producto:", err);
      setError(err.message);
      setSuccessMessage(""); 
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Eliminar Producto</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
        <form onSubmit={handleDelete}>
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
          <button
            type="submit"
            className="w-full bg-red-500 text-white font-semibold py-2 rounded-md hover:bg-red-600 transition"
          >
            Eliminar Producto
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

export default EliminarProducto;