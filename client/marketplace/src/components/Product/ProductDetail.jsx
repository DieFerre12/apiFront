import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaCcVisa, FaCcMastercard } from "react-icons/fa";
import { SiMercadopago } from "react-icons/si";
import { ImCross } from "react-icons/im";
import { motion } from "framer-motion"; 
import { MdCheckCircle } from "react-icons/md"; 
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedSize } from '../Redux/slices/productsSlice';
import { addToCart } from '../Redux/slices/cartSlice';
import ClipLoader from "react-spinners/ClipLoader";

const ProductDetail = ({ cart, setCart }) => {
  const { model } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [sizeStockMap, setSizeStockMap] = useState({});
  const [selectedSize, setSelectedSize] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [productImage, setProductImage] = useState("");
  const [showPopup, setShowPopup] = useState(false); 
  const dispatch = useDispatch();
  
  useEffect(() => {
    const fetchProducts = async () => {
      const API_URL = `http://localhost:4002/products/${model}`;
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Productos no encontrados");

        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("Respuesta de la API no es un array");

        setProducts(data);

        const groupedSizes = data.reduce((acc, product) => {
          const { size, stock } = product;
          if (!acc[size]) acc[size] = 0;
          acc[size] += stock;
          return acc;
        }, {});

        setSizeStockMap(groupedSizes);
      } catch (error) {
        console.error("Error al obtener los productos:", error.message);
      }
    };

    const fetchImageForModel = async (model) => {
      try {
        const encodedModel = encodeURIComponent(model);
        const response = await fetch(`http://localhost:4002/images/search/${encodedModel}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
        });

        if (!response.ok) throw new Error(`Error al obtener imagen para el modelo ${model}`);
        const blob = await response.blob();
        setProductImage(URL.createObjectURL(blob));
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchProducts();
    fetchImageForModel(model);
  }, [model]);

  const addToCart = async (product) => {  
    if (!selectedSize) {
      alert("Por favor, selecciona un talle antes de agregar al carrito.");
      return;
    }

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (!token || !user?.id) {
      alert('Por favor, inicia sesión.');
      navigate('/login');
      return;
    }

    const productWithSize = { ...product, size: selectedSize, quantity: 1 };

    try {
      const response = await fetch(`http://localhost:4002/shoppingCart/user/${user.id}/addProduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productWithSize)
      });

      if (!response.ok) throw new Error(`Error: ${await response.text()}`);

      const data = await response.json();
      setCart((prevCart) => [...prevCart, data]);

      localStorage.setItem('cart', JSON.stringify([...cart, data]));
      
      
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000); 

      navigate("/cart");
    } catch (error) {
      console.error('Error:', error);
      alert(`Error al agregar al carrito: ${error.message}`);
    }
  };

  const handleSizeChange = (e) => setSelectedSize(e.target.value);
  const handleImageClick = (url) => { setSelectedImage(url); setShowImageModal(true); };
  const closeImageModal = () => { setShowImageModal(false); setSelectedImage(""); };
  const formatSize = (size) => `Talle ${size.replace('SIZE_', '')}`;

  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center">
        <ClipLoader size={70} color={"#123abc"} loading={true} />
      </div>
    );
  }

  const selectedProduct = products[0];

  return (
    <motion.div
      className="container mx-auto p-6 bg-gray-100 rounded-lg mt-8 max-w-5xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        {selectedProduct.model}
      </h1>

      <div className="flex flex-col md:flex-row md:space-x-8">
        <div className="md:w-1/3 mb-4">
          <motion.img
            src={productImage}
            alt={selectedProduct.model}
            className="w-full h-auto object-cover rounded-lg shadow-lg mb-4 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => handleImageClick(productImage)}
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
            <label className="text-lg text-gray-600 mb-2">Selecciona tu talle:</label>
            <select
              className="ml-2 p-2 border rounded"
              value={selectedSize}
              onChange={handleSizeChange}
            >
              <option value="">Selecciona un talle</option>
              {Object.keys(sizeStockMap).map((size) => (
                <option key={size} value={size}>
                  {formatSize(size)}
                </option>
              ))}
            </select>
          </div>

          <motion.button
            onClick={() => addToCart(selectedProduct)}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded shadow-lg"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            Agregar al carrito
          </motion.button>
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

      {/* Pop-up para agregar al carrito */}
      {showPopup && (
        <div className="fixed bottom-10 right-10 bg-white p-4 rounded shadow-lg flex items-center">
          <MdCheckCircle className="text-green-500 mr-2" size={24} />
          <span>Agregado al carrito</span>
        </div>
      )}
    </motion.div>
  );
};

export default ProductDetail;