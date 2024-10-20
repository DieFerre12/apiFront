import React, { useState, useEffect } from "react";

const ActualizarStock = ({ isOpen, onClose }) => {
  const [productId, setProductId] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [categorias, setCategorias] = useState([]); // Para almacenar las categorías
  const [selectedCategory, setSelectedCategory] = useState(""); // Para la categoría seleccionada

  // Fetch categories cuando el componente se monta
  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:4002/categories", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Error al obtener categorías");

      const data = await response.json();
      setCategorias(data.content); // Asigna las categorías obtenidas
    } catch (error) {
      console.error(error.message);
      setCategorias([]);
    }
  };

  useEffect(() => {
    fetchCategories(); // Llama a la función para obtener categorías
  }, []); // El array vacío significa que se ejecuta solo una vez al montar el componente

  const handleSubmit = async (e) => {
    e.preventDefault();
    const API_URL = "http://localhost:4002/products/updateProductPrice"; // Reemplaza con tu URL de API

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: productId,
          price: parseFloat(newPrice),
          category: selectedCategory, // Incluye la categoría seleccionada
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
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">ID del Producto:</label>
            <input
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
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
            <label className="block text-gray-700">Categoría:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
 >
              <option value="">Seleccione una categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.name}
                </option>
              ))}
            </select>
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

export default ActualizarStock;