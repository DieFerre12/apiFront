// src/hooks/useFetchProducts.js
import { useState, useEffect } from "react";

const useFetchProducts = (id) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = "http://localhost:4002/products"; // Ruta del backend

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('token'); // Obtén el token del almacenamiento local

      if (!token) {
        setError("No se encontró el token de autorización.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Envía el token en la cabecera Authorization
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error("Error al obtener productos");

        const data = await response.json();

        // Si se pasa un ID, buscar el producto específico
        if (id) {
          const foundProduct = data.find((p) => p.id === parseInt(id));
          if (foundProduct) {
            setProduct(foundProduct);
          } else {
            setError("Producto no encontrado");
          }
        } else {
          setProduct(data); // Setea todos los productos si no hay ID
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id]);

  return { product, loading, error };
};

export default useFetchProducts;
