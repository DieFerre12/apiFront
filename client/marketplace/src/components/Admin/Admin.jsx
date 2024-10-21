import React, { useState, useEffect } from "react";

const NuevaVentaExclusiva = ({ isOpen, onClose }) => {
  const [model, setModel] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState("");
  const [categoria, setCategoria] = useState(""); // Para la categoría seleccionada
  const [categories, setCategories] = useState([]); // Para almacenar las categorías
  const [sizeStockMap, setSizeStockMap] = useState({});
  const [marca, setMarca] = useState("");
  const [genero, setGenero] = useState("");
  const [selectedSizes, setSelectedSizes] = useState([]);

  // Fetch categories cuando el componente se monta
  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:4002/categories", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Error al obtener categorías");

      const data = await response.json();
      console.log("Categorías obtenidas:", data); // Debugging line
      setCategories(data.content); // Asigna las categorías obtenidas
    } catch (error) {
      console.error(error.message);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories(); // Llama a la función para obtener categorías
  }, []); // El array vacío significa que se ejecuta solo una vez al montar el componente

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
    const API_URL = "http://localhost:4002/products/new"; // Reemplaza con tu URL de API
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
                <option key={categoria.id} value={categoria.categoryType}>
                  {categoria.categoryType}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Marca:</label>
            <select
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">Seleccione una marca</option>
              <option value="NIKE">NIKE</option>
              <option value="ADIDAS">ADIDAS</option>
              <option value="PUMA">PUMA</option>
              <option value="VANS">VANS</option>
              <option value="CONVERSE">CONVERSE</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Género:</label>
            <select
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">Seleccione un género</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Tallas:</label>
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