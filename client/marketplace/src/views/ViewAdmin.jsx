// src/views/ViewAdmin.jsx
import React, { useState } from 'react';
import AdminFunction from '../components/Admin/Admin'; // Ajusta según el nombre y la ruta correcta
import ActualizarStock from '../components/Admin/AdminStock'; // Asegúrate de que la ruta sea correcta

const ViewAdmin = () => {
  const [isFuncionesAdminOpen, setIsFuncionesAdminOpen] = useState(false);
  const [isActualizarStockOpen, setIsActualizarStockOpen] = useState(false);

  const handleFuncionesAdminClick = () => {
    setIsFuncionesAdminOpen(true);
  };

  const handleCloseFuncionesAdmin = () => {
    setIsFuncionesAdminOpen(false);
  };

  const openActualizarStockModal = () => {
    setIsActualizarStockOpen(true);
  };

  const closeActualizarStockModal = () => {
    setIsActualizarStockOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-center">
      <h2 className="text-4xl font-bold text-black mb-4">Funciones Admin</h2>
      <p className="text-gray-600 text-lg">
        Aquí puedes gestionar las funciones administrativas de la aplicación.
      </p>
      <img src="./assets/Designer.png" alt="Designer" className="mt-4 w-1/2 h-auto" />

      {/* Botón para abrir AdminFunction */}
      <button
        onClick={handleFuncionesAdminClick}
        className="mt-4 bg-blue-500 text-white p-3 rounded-lg shadow-lg hover:bg-blue-600 transition"
      >
        Agregar Productos
      </button>

      {/* Botón para abrir Actualizar Stock */}
      <button
        onClick={openActualizarStockModal}
        className="mt-4 bg-green-500 text-white p-3 rounded-lg shadow-lg hover:bg-green-600 transition"
      >
        Actualizar Stock de Producto
      </button>

      <AdminFunction isOpen={isFuncionesAdminOpen} onClose={handleCloseFuncionesAdmin} />
      <ActualizarStock isOpen={isActualizarStockOpen} onClose={closeActualizarStockModal} />
    </div>
  );
};

export default ViewAdmin;