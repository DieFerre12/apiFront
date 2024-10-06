// src/views/ProductDetail.jsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Product from "../components/Product";

const productDetails = {
  1: {
    name: "Zapatilla Modelo A",
    brand: "Marca 1",
    sizes: ["39", "40", "41", "42"],
    price: "$9500",
    description: "Zapatilla cómoda y ligera, ideal para correr.",
    images: [
      "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_706,h_706/global/397370/02/sv01/fnd/ARG/fmt/png",
      "https://nikearprod.vtexassets.com/arquivos/ids/456833/DH3159_001_A_PREM.jpg?v=638149344611730000",
      "https://media2.solodeportes.com.ar/media/catalog/product/cache/7c4f9b393f0b8cb75f2b74fe5e9e52aa/z/a/zapatillas-adidas-breaknet-2-0-negra-88548378-100010hp9425001-1.jpg",
    ],
  },
  2: {
    name: "Zapatilla Modelo B",
    brand: "Marca 2",
    sizes: ["38", "39", "40"],
    price: "$11500",
    description: "Estilo urbano con excelente soporte y comodidad.",
    images: [
      "/path/to/image4.jpg",
      "/path/to/image5.jpg",
      "/path/to/image6.jpg",
    ],
  },
};

const ProductDetail = () => {
  const { productId } = useParams();
  const product = productDetails[productId];

  // Verifica si el producto existe
  if (!product) {
    return <p>Producto no encontrado.</p>; // Mensaje de error si no se encuentra el producto
  }

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  const handleSizeClick = (size) => {
    setSelectedSize(size);
  };

  const handleAddToCart = () => {
    if (selectedSize) {
      // Aquí puedes añadir la lógica para agregar el producto al carrito (puedes implementar tu propia lógica)
      console.log(`Añadir al carrito: ${product.name}, Talle: ${selectedSize}`);
    }
  };

  return (
    <div className="container mx-auto p-4 flex">
      <div className="flex flex-col items-center">
        <img
          src={selectedImage}
          alt={product.name}
          className="w-96 h-auto object-cover mb-4 transition-transform duration-300 hover:scale-105"
        />
        <div className="flex space-x-2 mb-4">
          {product.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${product.name} ${index + 1}`}
              className="w-20 h-auto object-cover cursor-pointer border"
              onClick={() => setSelectedImage(image)}
            />
          ))}
        </div>
      </div>

      <div className="ml-10">
        <h1 className="text-4xl font-bold text-black mb-4">{product.name}</h1>
        <h2 className="text-2xl text-black mb-4">Marca: {product.brand}</h2>
        
        <div className="mb-4">
          <h3 className="text-xl font-bold text-black mb-4">Talles disponibles:</h3>
          <div className="flex space-x-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => handleSizeClick(size)}
                className={`py-1 px-2 border rounded ${
                  selectedSize === size ? "bg-blue-500 text-white" : "bg-white text-black"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <p className="text-black mb-4">Precio: {product.price}</p>
        <p className="text-black mb-4">Descripción: {product.description}</p>
        
        <button
          onClick={handleAddToCart}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
          disabled={!selectedSize}
        >
          Comprar
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
