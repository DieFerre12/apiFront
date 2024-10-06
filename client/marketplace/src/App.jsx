import React from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Home from "./views/Home";
import Product from "./views/Products"; // Asegúrate de que la ruta esté bien escrita
import ProductDetail from "./views/ProductDetail"; // Añadido para los detalles de producto


const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    navigate("/product");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navigation />
      <div className="flex-grow p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Product />} />
          <Route path="/product/:productId" element={<ProductDetail />} /> {/* Ruta para detalles del producto */}
        </Routes>
        {/* Solo muestra el botón en la página principal */}
        {location.pathname === "/" && (
          <>
            <button
              onClick={handleClick}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Ver Productos {/* Texto del botón */}
            </button>
            <p className="mt-2 text-gray-600">Ruta actual: {location.pathname}</p>
          </>
        )}
      </div>
      <Footer /> {/* Coloca el footer en la parte inferior */}
    </div>
  );
};

export default App;
