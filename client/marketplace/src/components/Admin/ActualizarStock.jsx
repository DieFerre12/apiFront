import React, { useState } from "react";
import Swal from "sweetalert2";

const ActualizarStock = ({ isOpen, onClose }) => {
  const [model, setModel] = useState(""); 
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [sizeStockMap, setSizeStockMap] = useState({}); 
  const [selectedSizes, setSelectedSizes] = useState([]); 

  const handleSizeChange = (size) => {
    setSelectedSizes((prevSizes) =>
      prevSizes.includes(size)
        ? prevSizes.filter((s) => s !== size)
        : [...prevSizes, size]
    );
  };

  const handleStockChange = (size, stock) => {
    setSizeStockMap((prevMap) => ({
      ...prevMap,
      [size]: parseInt(stock, 10),
    }));
  };

  const handleUpdateStock = async (e) => {
    e.preventDefault();
    const API_URL = "http://localhost:4002/products/updateProductSize"; 

    try {
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model,
          sizeStockMap: sizeStockMap,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Error al actualizar el stock");
      }

      const data = await response.json();
      console.log("Stock actualizado exitosamente:", data);
      Swal.fire({
        icon: 'success',
        title: 'Stock actualizado',
        showConfirmButton: false,
        timer: 1500
      });
      setSuccessMessage("Stock actualizado exitosamente");
      setError(""); 
      onClose(); 
    } catch (err) {
      console.error("Error durante la actualización del stock:", err);
      setError(err.message);
      setSuccessMessage(""); 
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Actualizar Stock de Producto</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
        <form onSubmit={handleUpdateStock}>
          <div className="mb-4">
            <label className="block text-gray-700">Modelo del Producto:</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Tallas y Stock:</label>
            <div className="flex flex-wrap">
              {['SIZE_37', 'SIZE_38', 'SIZE_39', 'SIZE_40', 'SIZE_41', 'SIZE_42'].map((size) => (
                <div key={size} className="w-1/2 mb-4">
                  <label className="mr-2">
                    <input
                      type="checkbox"
                      value={size}
                      checked={selectedSizes.includes(size)}
                      onChange={() => handleSizeChange(size)}
                      className="mr-2"
                    />
                    {size}
                  </label>
                  {selectedSizes.includes(size) && (
                    <input
                      type="number"
                      placeholder="Stock"
                      value={sizeStockMap[size] || ""}
                      onChange={(e) => handleStockChange(size, e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition"
          >
            Actualizar Stock
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mt-2 w-full bg-gray-300 text-gray-700 font-semibold py-2 rounded-md hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default ActualizarStock;