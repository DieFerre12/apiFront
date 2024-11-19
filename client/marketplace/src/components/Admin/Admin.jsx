import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const Admin = ({ isOpen, onClose }) => {
  const [model, setModel] = useState(""); // Estado para el campo 'model'
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState("");
  const [categoria, setCategoria] = useState(""); // Para la categoría seleccionada
  const [categories, setCategories] = useState([]); // Para almacenar las categorías
  const [sizeStockMap, setSizeStockMap] = useState({});
  const [marca, setMarca] = useState("");
  const [genero, setGenero] = useState("");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [image, setImage] = useState(null); // Estado para la imagen
  const [successMessage, setSuccessMessage] = useState(""); // Estado para el mensaje de éxito

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
  }, []);

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

    const productData = { 
      description: descripcion,
      model: model, // Asegúrate de que el campo model se envíe correctamente
      genre: genero,
      brand: marca,
      sizeStockMap,
      price: parseFloat(precio),
      categoryType: categoria, // Usa la categoría seleccionada
    };

    console.log("Enviando producto:", productData); // Línea de depuración

    try {
      // Subir la imagen
      if (image) {
        const formData = new FormData();
        formData.append("file", image);

        const imageResponse = await fetch(`http://localhost:4002/images/add/${model}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!imageResponse.ok) {
          const errorData = await imageResponse.text();
          throw new Error(errorData || "Error al subir la imagen");
        }

        console.log("Imagen subida exitosamente");
      }

      // Crear el producto
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Error al crear el producto");
      }

      const data = await response.json();
      console.log("Producto creado exitosamente:", data);
      Swal.fire({
        icon: 'success',
        title: 'Operación realizada con éxito',
        showConfirmButton: false,
        timer: 1500
      });
      onClose(); // Cierra el modal o ventana al terminar el proceso
    } catch (err) {
      console.error("Error durante la creación del producto:", err);
      setError(err.message);
    }
  };

  if (!isOpen) return null;

  return (
<div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
  <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
    <h2 className="text-xl font-semibold mb-4">Añadir Producto</h2>
    {error && <p className="text-red-500 mb-4">{error}</p>}
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
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
        <div className="mb-4 col-span-2">
          <label className="block text-gray-700">Tallas:</label>
          <div className="flex flex-wrap">
            {['SIZE_37', 'SIZE_38', 'SIZE_39', 'SIZE_40', 'SIZE_41', 'SIZE_42'].map((size) => (
              <div key={size} className="w-1/3 mb-4">
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
        <div className="mb-4 col-span-2">
          <label className="block text-gray-700">Imagen:</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
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

export default Admin;