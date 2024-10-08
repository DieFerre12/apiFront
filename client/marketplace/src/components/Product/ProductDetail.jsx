// src/components/ProductDetails.jsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import SizeSelector from "./Size"; // Asegúrate de que la ruta sea correcta
import { FaCcVisa, FaCcMastercard } from "react-icons/fa";
import { SiMercadopago } from "react-icons/si";
import { FaShoppingCart } from "react-icons/fa"; // Importa el icono del carrito
import { ImCross } from "react-icons/im"; // Importa el ícono ImCross

const products = [
  {
    id: 1,
    name: "Zapatilla Modelo A",
    brand: "Marca 1",
    sizes: ["39", "40", "41", "42"],
    price: "$9500",
    description: "Zapatilla cómoda y ligera, ideal para correr.",
    images: [
      "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_706,h_706/global/397370/02/sv01/fnd/ARG/fmt/png",
      "https://cdn.shopify.com/s/files/1/0271/0835/1832/products/model_a_side.png?v=1617640914",
      "https://cdn.shopify.com/s/files/1/0271/0835/1832/products/model_a_top.png?v=1617640914"
    ]
  },
  {
    id: 2,
    name: "Nike Air Max SC",
    brand: "NIKE",
    sizes: ["38", "39", "40"],
    price: "$11500",
    description: "Estilo urbano con excelente soporte y comodidad.",
    images: [
      "https://nikearprod.vtexassets.com/arquivos/ids/658094-1200-1200?width=1200&height=1200&aspect=true",
      "https://nikearprod.vtexassets.com/arquivos/ids/665918-1200-1200?width=1200&height=1200&aspect=true",
      "https://nikearprod.vtexassets.com/arquivos/ids/668514-1200-1200?width=1200&height=1200&aspect=true"
    ]
  }
];

const ProductDetails = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));

  const [selectedSize, setSelectedSize] = useState(""); // Estado para el talle seleccionado
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar el modal
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Índice de la imagen actual

  if (!product) {
    return <div className="text-center text-red-500">Producto no encontrado</div>;
  }

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex - 1 + product.images.length) % product.images.length
    );
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg mt-8 max-w-5xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">{product.name}</h1>
      <div className="flex flex-col md:flex-row md:space-x-8">
        <div className="md:w-1/3 mb-4">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-auto object-cover rounded-lg shadow-lg mb-4 transition-transform transform hover:scale-105 duration-300 cursor-pointer"
            onClick={() => openModal(0)}
          />
          <div className="grid grid-cols-3 gap-2">
            {product.images.slice(1).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.name} ${index + 1}`}
                className="w-full h-auto object-cover rounded-lg cursor-pointer shadow-md hover:shadow-lg transition-shadow duration-200 transform hover:scale-105"
                onClick={() => openModal(index + 1)}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center md:w-2/3">
          <p className="text-lg text-gray-600 mb-2"><strong>Marca:</strong> {product.brand}</p>
          <p className="text-lg text-gray-600 mb-2"><strong>Descripción:</strong> {product.description}</p>
          <p className="text-xl text-gray-800 font-semibold mb-2"><strong>Precio:</strong> {product.price}</p>
          <SizeSelector
            sizes={product.sizes}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
          />
          <div className="flex space-x-4 mt-4">
            <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-300 flex items-center">
              <FaShoppingCart className="mr-2" /> Agregar Ahora
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-300">
              Agregar al Carrito
            </button>
          </div>
        </div>
      </div>
      
      {/* Sección de Métodos de Pago */}
      <div className="mt-8 bg-white shadow-md rounded-lg p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Métodos de Pago</h2>
        <div className="flex justify-center items-center space-x-12">
          <FaCcVisa size={35} />
          <FaCcMastercard size={35} />
          <SiMercadopago size={35} />
        </div>
      </div>

      {/* Modal para imágenes */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="relative">
            <img
              src={product.images[currentImageIndex]}
              alt={product.name}
              className="max-w-full max-h-screen object-contain rounded-lg"
            />
            <button 
              onClick={goToPreviousImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-gray-800 bg-opacity-50 rounded-full p-2"
            >
              &#10094;
            </button>
            <button 
              onClick={goToNextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-gray-800 bg-opacity-50 rounded-full p-2"
            >
              &#10095;
            </button>
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-white text-2xl"
            >
              <ImCross /> {/* Usar el icono ImCross */}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
