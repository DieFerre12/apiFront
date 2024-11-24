import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ProductGallery = () => {
  const [groupedProducts, setGroupedProducts] = useState({});
  const [images, setImages] = useState({});

  const fetchProducts = async () => {
    try {
      const url = "http://localhost:4002/products";
      console.log(`Fetching products from URL: ${url}`); 

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Error al obtener productos");

      const data = await response.json();
      console.log("Respuesta completa de productos:", data); 

      const products = Array.isArray(data) ? data : data.content;
      if (!products) throw new Error("La respuesta de la API no contiene productos");

      console.log("Productos obtenidos:", products); 

      const grouped = products.reduce((acc, product) => {
        acc[product.model] = acc[product.model] || [];
        acc[product.model].push(product);
        return acc;
      }, {});

      console.log("Productos agrupados:", grouped); 

      setGroupedProducts(grouped);

      for (const model of Object.keys(grouped)) {
        fetchImageForModel(model);
      }
    } catch (error) {
      console.error(error.message);
      setGroupedProducts({});
    }
  };

  const fetchImageForModel = async (model) => {
    try {
      const encodedModel = encodeURIComponent(model);
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const response = await fetch(`http://localhost:4002/images/search/${encodedModel}`, {
        method: "GET",
        headers: headers,
      });
      if (!response.ok) throw new Error(`Error al obtener imagen para el modelo ${model}`);

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);

      setImages((prevImages) => ({
        ...prevImages,
        [model]: imageUrl,
      }));
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto p-4">
      {Object.keys(groupedProducts).length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(groupedProducts).slice(0, 3).map(([model, products]) => (
            <Link
              key={model}
              to={`/product/${model}`}
              className="border p-4 rounded-lg shadow-md block transform transition duration-500 hover:scale-105 hover:shadow-lg"
            >
              <h1 className="text-xl font-semibold">{model}</h1>
              <p>Precio: ${products[0].price}</p>
              {images[model] && (
                <div className="overflow-hidden rounded-md mt-2">
                  <img
                    src={images[model]}
                    alt={model}
                    className="w-full h-48 object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                  />
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;