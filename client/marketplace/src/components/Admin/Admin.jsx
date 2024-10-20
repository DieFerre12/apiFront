import React, { useState, useEffect } from "react";

const NuevaVentaExclusiva = ({ isOpen, onClose }) => {
  const [model, setModel] = useState("");
  const [precio, setPrecio] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState("");
  const [categoria, setCategoria] = useState(""); // Para la categoría seleccionada
  const [categories, setCategories] = useState([]); // Para almacenar las categorías
  const [sizeStockMap, setSizeStockMap] = useState({});
  const [marca, setMarca] = useState("");
  const [genero, setGenero] = useState("");

  // Fetch categories cuando el componente se monta
  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:4002/categories", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Error al obtener categorías");

      const data = await response.json();
      setCategories(data.content); // Asigna las categorías obtenidas
    } catch (error) {
      console.error(error.message);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories(); // Llama a la función para obtener categorías
  }, []); // El array vacío significa que se ejecuta solo una vez al montar el componente

  const handleSubmit = async (e) => {
    e.preventDefault();
    const API_URL = "http://localhost:4002/products/new"; // Reemplaza con tu URL de API

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          description: descripcion,
          model,
          genre: genero,
          brand: marca,
          sizeStockMap,
          price: parseFloat(precio),
          categoryType: categoria, // Usa la categoría seleccionada
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Error al crear la venta");
      }

      const data = await response.json();
      console.log("Venta creada exitosamente:", data);
      onClose(); // Cierra el modal o ventana al terminar el proceso
    } catch (err) {
      console.error("Error durante la creación de la venta:", err);
      setError(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Añadir Producto</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Modelo:</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Precio:</label>
            <input
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Cantidad:</label>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded -md p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Descripción:</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Categoría:</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">Seleccione una categoría</option>
              {categories.map((categoria) => (
                <option key={categoria.id} value={categoria.name}>
                  {categoria.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Marca:</label>
            <input
              type="text"
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Género:</label>
            <input
              type="text"
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Stock por Talla:</label>
            <input
              type="text"
              value={sizeStockMap}
              onChange={(e) => setSizeStockMap({ ...sizeStockMap, [e.target.name]: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder='{"SIZE_37": 30}'
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition"
          >
            Crear Producto
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

export default NuevaVentaExclusiva;