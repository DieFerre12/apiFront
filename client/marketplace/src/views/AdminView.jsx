import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminFunction from '../components/Admin/Admin';
import ActualizarStock from '../components/Admin/ActualizarStock';
import ActualizarPrecio from '../components/Admin/ActualizarPrecio';
import EliminarProducto from '../components/Admin/EliminarProducto';

const AdminView = () => {
  const [isFuncionesAdminOpen, setIsFuncionesAdminOpen] = useState(false);
  const [isActualizarStockOpen, setIsActualizarStockOpen] = useState(false);
  const [isActualizarPrecioOpen, setIsActualizarPrecioOpen] = useState(false);
  const [isEliminarProductoOpen, setIsEliminarProductoOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };

    const handlePopState = (event) => {
      if (location.pathname === '/admin') {
        navigate('/admin');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate, location.pathname]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-xl w-full">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-6">Funciones Admin</h2>
        <p className="text-gray-600 text-lg mb-8">
          Aquí puedes gestionar las funciones administrativas de la aplicación.
        </p>

        {/* Botón para abrir AdminFunction */}
        <button
          onClick={() => setIsFuncionesAdminOpen(true)}
          className="w-full mb-4 bg-blue-500 text-white py-3 rounded-lg shadow-md 
          hover:bg-blue-600 transition-transform duration-300 transform hover:scale-105"
        >
          Agregar Productos
        </button>

        {/* Botón para abrir Actualizar Stock */}
        <button
          onClick={() => setIsActualizarStockOpen(true)}
          className="w-full mb-4 bg-green-500 text-white py-3 rounded-lg shadow-md 
          hover:bg-green-600 transition-transform duration-300 transform hover:scale-105"
        >
          Actualizar Stock de Producto
        </button>

        {/* Botón para abrir Actualizar Precio */}
        <button
          onClick={() => setIsActualizarPrecioOpen(true)}
          className="w-full mb-4 bg-yellow-500 text-white py-3 rounded-lg shadow-md 
          hover:bg-yellow-600 transition-transform duration-300 transform hover:scale-105"
        >
          Actualizar Precio de Producto
        </button>

        {/* Botón para abrir Eliminar Producto */}
        <button
          onClick={() => setIsEliminarProductoOpen(true)}
          className="w-full bg-red-500 text-white py-3 rounded-lg shadow-md 
          hover:bg-red-600 transition-transform duration-300 transform hover:scale-105"
        >
          Eliminar Producto
        </button>

        {/* Modales */}
        <AdminFunction isOpen={isFuncionesAdminOpen} onClose={() => setIsFuncionesAdminOpen(false)} />
        <ActualizarStock isOpen={isActualizarStockOpen} onClose={() => setIsActualizarStockOpen(false)} />
        <ActualizarPrecio isOpen={isActualizarPrecioOpen} onClose={() => setIsActualizarPrecioOpen(false)} />
        <EliminarProducto isOpen={isEliminarProductoOpen} onClose={() => setIsEliminarProductoOpen(false)} />
      </div>
    </div>
  );
};

export default AdminView;
