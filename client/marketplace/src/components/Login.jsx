// src/components/LoginModal.jsx
import React, { useState } from "react";
import { ImCross } from "react-icons/im";
import { IoLogInOutline } from "react-icons/io5";




const Login = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Estado para manejar errores

  if (!isOpen) return null; // Si el modal no está abierto, no se renderiza nada

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    if (!email || !password) {
      setError("Por favor, llena todos los campos."); // Mensaje de error si hay campos vacíos
      return;
    }

    // Aquí puedes agregar la lógica para manejar el inicio de sesión
    console.log("Iniciando sesión con:", email, password);
    setError(""); // Limpiar el mensaje de error si la validación pasa
    // Puedes agregar más lógica aquí para manejar el inicio de sesión
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-96">
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          <ImCross />

        </button>

        <h2 className="text-2xl font-bold mb-4">Iniciar Sesión</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>} {/* Mostrar mensaje de error */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="you@example.com"
              value={email} // Vinculando el valor del input con el estado
              onChange={(e) => setEmail(e.target.value)} // Actualiza el estado
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="••••••••"
              value={password} // Vinculando el valor del input con el estado
              onChange={(e) => setPassword(e.target.value)} // Actualiza el estado
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              className="text-blue-500 hover:underline"
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
