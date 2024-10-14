import React, { useEffect, useState } from "react";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const API_URL = "http://localhost:4002/products";
      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Error al obtener productos");

        const data = await response.json();
        // Asegúrate de acceder al array dentro de 'content'
        setProducts(Array.isArray(data.content) ? data.content : []);
      } catch (error) {
        console.error(error.message);
        setProducts([]); // En caso de error, define un array vacío
      }
    };

    fetchProducts();
  }, []); // Asegúrate de incluir el array de dependencias vacío

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-black mb-4">Lista de Productos</h1>
      {products.length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg shadow-md">
              <h1>{product.model}</h1>
              <p>Precio: ${product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
