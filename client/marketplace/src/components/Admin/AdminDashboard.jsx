// src/admin/AdminDashboard.js

import React from "react";
import NuevaVentaExclusiva from "./NuevaVentaExclusiva";

const AdminDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <h1>Panel de Administración</h1>
      <button onClick={handleOpen}>Crear Nueva Venta Exclusiva</button>
      <NuevaVentaExclusiva isOpen={isOpen} onClose={handleClose} />
      {/* Aquí podrías agregar otros componentes o secciones del admin */}
    </div>
  );
};

export default AdminDashboard;