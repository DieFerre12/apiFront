import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../assets/logo.png";
import Login from "./Login/Login";
import NavLink from "./NavLink";
import { FaMagnifyingGlass } from "react-icons/fa6";
import shoppingCart from "../assets/shoppingCart.png";
import profileUser from "../assets/profile-user.png";
import { FaTimes } from "react-icons/fa"; 

const Navigation = ({ onLoginClick }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef(null); 
  const navigate = useNavigate();

  const BRANDS = ["NIKE", "ADIDAS", "PUMA", "CONVERSE", "VANS"]; 
  const LOWERCASE_BRANDS = BRANDS.map((brand) => brand.toLowerCase()); 

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        const normalizedSearchQuery = searchQuery.trim().toLowerCase();
        const isBrandSearch = LOWERCASE_BRANDS.includes(normalizedSearchQuery);

        let data;
        if (isBrandSearch) {
          const brand = normalizedSearchQuery.toUpperCase();
          const response = await fetch(
            `http://localhost:4002/products/brand/${encodeURIComponent(brand)}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          );

          if (!response.ok)
            throw new Error(`Error al obtener productos para la marca ${brand}`);

          data = await response.json();
          navigate(`/products/${brand}`, { state: { products: data } });
        } else {
          const response = await fetch(
            `http://localhost:4002/products/${encodeURIComponent(searchQuery)}`
          );
          if (!response.ok) throw new Error("Producto no encontrado");

          data = await response.json();
          navigate(`/product/${searchQuery}`);
        }
      } catch (error) {
        console.error("Error en la búsqueda:", error);
        alert(
          error.message ||
            "Producto no encontrado. Por favor, intente con otro modelo o marca."
        );
      }
    }
  };

  const handleLoginClick = () => {
    setIsLoginOpen(true);
  };

  const closeLogin = () => {
    setIsLoginOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Sesión cerrada correctamente",
      showConfirmButton: false,
      timer: 1000, // Reduce the timer to 1 second
      customClass: {
        popup: "swal2-sm",
      },
    }).then(() => {
      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 1000); // Reduce the delay to 1 second
    });
  };

  let loggedInUser;
  try {
    loggedInUser = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    loggedInUser = null;
  }

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsUserMenuOpen(false); 
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside); 
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); 
    };
  }, []);

  const handleCartClick = () => {
    if (loggedInUser) {
      navigate("/cart");
    } else {
      Swal.fire({
        title: 'Iniciar sesión',
        text: 'Por favor, inicia sesión para continuar.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Iniciar sesión',
        cancelButtonText: 'Cancelar',
        customClass: {
          popup: 'swal2-sm',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          setIsLoginOpen(true);
        }
      });
    }
  };

  const handleLoginSuccess = (userData) => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Inicio de sesión exitoso",
      showConfirmButton: false,
      timer: 1000, // Reduce the timer to 1 second
      customClass: {
        popup: "swal2-sm",
      },
    }).then(() => {
      setTimeout(() => {
        window.location.reload();
      }, 1000); // Reduce the delay to 1 second
    });
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
            <button onClick={handleCartClick} className="flex items-center">
              <img src={shoppingCart} alt="Carrito" className="h-8 w-8" />
            </button>
            {loggedInUser ? (
              <>
                {loggedInUser.email === "admin@example.com" && (
                  <button
                    onClick={() => navigate("/admin")}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-transform duration-300 transform hover:scale-105"
                  >
                    Admin
                  </button>
                )}
                <div ref={menuRef} className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center"
                  >
                    <img src={profileUser} alt="User" className="h-8 w-8" />
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-lg py-4 border border-gray-200">
                      <button
                        onClick={() => setIsUserMenuOpen(false)} // Cierra el menú cuando se hace clic en la cruz
                        className="absolute top-2 right-2 text-gray-500"
                      >
                        <FaTimes />
                      </button>
                      <div className="px-4 py-2 border-b border-gray-300">
                        <h3 className="text-lg font-semibold text-gray-800 font-lato">
                          Perfil de Usuario
                        </h3>
                      </div>
                      <div className="px-4 py-4 space-y-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-bold text-gray-700 font-lato">Nombre:</span>
                          <p className="text-sm text-gray-800 font-roboto-mono">
                            {loggedInUser?.nombre}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-bold text-gray-700 font-lato">Email:</span>
                          <p className="text-sm text-gray-800 font-roboto-mono">
                            {loggedInUser?.email}
                          </p>
                        </div>
                      </div>
                      <div className="px-4 pt-2">
                        <button
                          onClick={handleLogout}
                          className="w-full text-sm font-semibold text-white bg-red-500 hover:bg-red-600 py-2 rounded-lg focus:outline-none transition duration-200"
                        >
                          Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button onClick={handleLoginClick} className="flex items-center">
                <img src={profileUser} alt="Login" className="h-8 w-8" />
              </button>
            )}
          </div>
        </div>
      </nav>
      <Login isOpen={isLoginOpen} onClose={closeLogin} onLoginSuccess={handleLoginSuccess} />
    </>
  );
};

export default Navigation;