import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const API_URL = "http://localhost:4002/api/v1/auth/authenticate"; // Reemplaza con tu URL de API

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
      localStorage.setItem("token", data.token);
      onLogin(); // Llamar a la función de onLogin para actualizar el estado de autenticación
      onClose(); // Cierra el modal al terminar el proceso
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegisterClick = () => {
    onClose(); // Cierra el modal
    navigate("/views/Register"); // Navega a la página de registro
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Iniciar Sesión</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
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
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Ingresa tu contraseña"
            />
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

export default LoginModal;