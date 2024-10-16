// src/components/Product/ProductList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ProductList = () => {
  const [groupedProducts, setGroupedProducts] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:4002/products", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Error al obtener productos");

        const data = await response.json();

        // Agrupar productos por modelo
        const grouped = data.content.reduce((acc, product) => {
          acc[product.model] = acc[product.model] || [];
          acc[product.model].push(product);
          return acc;
        }, {});

        setGroupedProducts(grouped);
      } catch (error) {
        console.error(error.message);
        setGroupedProducts({}); // En caso de error, limpiar los productos
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-black mb-4">Lista de Productos</h1>
      {Object.keys(groupedProducts).length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(groupedProducts).map(([model, products]) => (
            <Link
              key={model}
              to={`/product/${model}`}
              className="border p-4 rounded-lg shadow-md block"
            >
              <h1 className="text-xl font-semibold">{model}</h1>
              <p>Precio: ${products[0].price}</p>
              <p>Stock: {products[0].stock}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
