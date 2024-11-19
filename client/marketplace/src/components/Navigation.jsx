import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import Login from "./Login/Login";
import NavLink from "./NavLink";
import { FaMagnifyingGlass } from "react-icons/fa6";
import shoppingCart from "../assets/shoppingCart.png";
import profileUser from "../assets/profile-user.png";

const Navigation = ({ onLoginClick, user }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);
  const navigate = useNavigate();

  const BRANDS = ["NIKE", "ADIDAS", "PUMA", "CONVESE", "VANS"]; // Lista de marcas
  const LOWERCASE_BRANDS = BRANDS.map(brand => brand.toLowerCase()); // Lista de marcas en minúsculas

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setLoggedInUser(JSON.parse(userData));
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        const normalizedSearchQuery = searchQuery.trim().toLowerCase(); // Normaliza la búsqueda a minúsculas
        const isBrandSearch = LOWERCASE_BRANDS.includes(normalizedSearchQuery); // Comprueba si está en la lista de marcas

        let data;
        if (isBrandSearch) {
          const brand = normalizedSearchQuery.toUpperCase(); // Convierte a mayúsculas para la búsqueda
          const response = await fetch(`http://localhost:4002/products/brand/${encodeURIComponent(brand)}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });

          if (!response.ok) throw new Error(`Error al obtener productos para la marca ${brand}`);
          
          data = await response.json();
          console.log(`Productos obtenidos para la marca ${brand}:`, data);
          navigate(`/products/${brand}`, { state: { products: data } });
        } else {
          const response = await fetch(`http://localhost:4002/products/${encodeURIComponent(searchQuery)}`);
          if (!response.ok) throw new Error('Producto no encontrado');
          
          data = await response.json();
          navigate(`/product/${searchQuery}`);
        }
      } catch (error) {
        console.error("Error en la búsqueda:", error);
        alert(error.message || "Producto no encontrado. Por favor, intente con otro modelo o marca.");
      }
    }
  };

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      setIsLoginOpen(true);
    }
  };

  const closeLogin = () => {
    setIsLoginOpen(false);
    const userData = localStorage.getItem("user");
    if (userData) {
      setLoggedInUser(JSON.parse(userData));
    }
  };

  const handleLogin = (userData) => {
    setLoggedInUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLoggedInUser(null);
    setIsUserMenuOpen(false);
    setShowLogoutMessage(true);
    setTimeout(() => setShowLogoutMessage(false), 3000); // Ocultar el mensaje después de 3 segundos
    navigate("/");
  };

  return (
    <>
      <nav className="bg-gray-800 text-white p-4 shadow-xl">
        <div className="flex justify-between items-center">
          <NavLink to="/">
            <img src={logo} alt="Zapas el Tatita" className="h-20 w-auto" />
          </NavLink>
          <div className="flex items-center space-x-8">
            <ul className="flex space-x-8 text-lg font-semibold">
              <li>
                <NavLink to="/product">Producto</NavLink>
              </li>
            </ul>
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <input
                type="text"
                className="p-2 rounded-md text-gray-800 w-64"
                placeholder="Buscar por modelo o marca (ej. NIKE para marca)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="p-1 bg-transparent flex items-center">
                <FaMagnifyingGlass />
              </button>
            </form>
          </div>
          <div className="flex items-center space-x-8">
            <NavLink to="/cart" className="flex items-center">
              <img src={shoppingCart} alt="Carrito" className="h-8 w-8" />
            </NavLink>
            {loggedInUser ? (
              <div className="relative">
                <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center">
                  <img src={profileUser} alt="User" className="h-8 w-8" />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
                    <p className="px-4 py-2 text-gray-800">Nombre: {loggedInUser.first_name}</p>
                    <p className="px-4 py-2 text-gray-800">Email: {loggedInUser.email}</p>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={handleLoginClick} className="flex items-center">
                <img src={profileUser} alt="Login" className="h-8 w-8" />
              </button>
            )}
          </div>
        </div>
      </nav>
      {showLogoutMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
          Sesión cerrada correctamente
        </div>
      )}
      <Login isOpen={isLoginOpen} onClose={closeLogin} onLogin={handleLogin} />
    </>
  );
};

export default Navigation;