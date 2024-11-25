import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetchUsers from "../Login/useFetchUsers";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { users, error: fetchError } = useFetchUsers();
  const navigate = useNavigate();
  

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const API_URL = "http://localhost:4002/api/v1/auth/authenticate";

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Error en el inicio de sesión");
      }

      const data = await response.json();
      console.log("Inicio de sesión exitoso:", data);
      
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        
        const loggedInUser = users.find(user => user.email === email);
        
        if (loggedInUser) {
          const userData = {
            id: loggedInUser.id,
            email: loggedInUser.email,
            nombre: loggedInUser.firstName,
            apellido: loggedInUser.apellido
          };
          
          localStorage.setItem("user", JSON.stringify(userData));
          onClose();
          onLogin(userData);

          
          if (email === "admin@example.com") {
            
            navigate("/");
          } else {
            navigate("/");
          }
          window.location.reload();
        } else {
          throw new Error("Usuario no encontrado.");
        }
      } else {
        throw new Error("Datos de autenticación incompletos");
      }
    } catch (err) {
      console.error("Error durante el inicio de sesión:", err);
      setError(err.message);
    }
  };

  const handleRegisterClick = () => {
    onClose();
    navigate("/views/Register");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Iniciar Sesión</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {fetchError && <p className="text-red-500 text-sm">{fetchError}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Ingresa tu correo"
            />
          </div>
          <div className="mb-4 relative">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Ingresa tu contraseña"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-8 right-0 px-3 py-2 text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 transition duration-300"
            >
              Cancelar
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={handleRegisterClick}
            className="text-blue-500 hover:text-blue-700 transition duration-300"
          >
            Registrarme
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;