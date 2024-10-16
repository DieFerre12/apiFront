import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaCcVisa, FaCcMastercard } from "react-icons/fa";
import { SiMercadopago } from "react-icons/si";
import { ImCross } from "react-icons/im";

const ProductDetail = () => {
  const { model } = useParams(); // Obtener el modelo desde la URL
  const [products, setProducts] = useState([]);
  const [sizeStockMap, setSizeStockMap] = useState({});
  const [selectedSize, setSelectedSize] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  // Efecto para obtener los productos del modelo
  useEffect(() => {
    const fetchProducts = async () => {
      const API_URL = `http://localhost:4002/products/${model}`;
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Productos no encontrados");

        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("Respuesta de la API no es un array");

        setProducts(data);

        // Agrupar el stock por modelo y talle
        const groupedSizes = data.reduce((acc, product) => {
          const { size, stock } = product;
          if (!acc[size]) {
            acc[size] = 0;
          }
          acc[size] += stock; // Sumar el stock por cada talle
          return acc;
        }, {});

        setSizeStockMap(groupedSizes);
      } catch (error) {
        console.error("Error al obtener los productos:", error.message);
      }
    };

    fetchProducts();
  }, [model]);

  const handleSizeChange = (event) => {
    setSelectedSize(event.target.value);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage("");
  };

  if (products.length === 0) return <p>Cargando detalles del producto...</p>;

  const selectedProduct = products[0]; // Usar el primer producto como referencia

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg mt-8 max-w-5xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        {selectedProduct.model}
      </h1>

      <div className="flex flex-col md:flex-row md:space-x-8">
        <div className="md:w-1/3 mb-4">
          <img
            src={selectedProduct.imageUrl}
            alt={selectedProduct.model}
            className="w-full h-auto object-cover rounded-lg shadow-lg mb-4 cursor-pointer"
            onClick={() => handleImageClick(selectedProduct.imageUrl)}
          />
        </div>

        <div className="flex flex-col justify-center md:w-2/3">
          <p className="text-lg text-gray-600 mb-2">
            <strong>Descripción:</strong> {selectedProduct.description}
          </p>
          <p className="text-lg text-gray-600 mb-2">
            <strong>Marca:</strong> {selectedProduct.brand}
          </p>
          <p className="text-lg text-gray-600 mb-2">
            <strong>Género:</strong> {selectedProduct.genre}
          </p>
          <p className="text-xl text-gray-800 font-semibold mb-2">
            <strong>Precio:</strong> ${selectedProduct.price}
          </p>

          <div className="mt-4">
            <label className="text-lg text-gray-600 mb-2">
              Selecciona tu talle:
            </label>
            <select
              className="ml-2 p-2 border rounded"
              value={selectedSize}
              onChange={handleSizeChange}
            >
              <option value="">Selecciona un talle</option>
              {Object.entries(sizeStockMap).map(([size, stock]) => (
                <option key={size} value={size} disabled={stock === 0}>
                  Talle {size} - {stock > 0 ? `${stock} en stock` : "Agotado"}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white shadow-md rounded-lg p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Métodos de Pago</h2>
        <div className="flex justify-center items-center space-x-12">
          <FaCcVisa size={35} />
          <FaCcMastercard size={35} />
          <SiMercadopago size={35} />
        </div>
      </div>

      {showImageModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white p-4 rounded">
            <button
              onClick={closeImageModal}
              className="absolute top-2 right-2 text-red-600"
            >
              <ImCross size={24} />
            </button>
            <img
              src={selectedImage}
              alt="Imagen seleccionada"
              className="w-full h-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;