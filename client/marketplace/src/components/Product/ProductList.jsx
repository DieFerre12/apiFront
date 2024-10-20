import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ProductList = () => {
  const [groupedProducts, setGroupedProducts] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [images, setImages] = useState({});

  const fetchProducts = async (categoryType = "") => {
    try {
      let url = "http://localhost:4002/products";
      if (categoryType) {
        url = `http://localhost:4002/products/category/${categoryType}`;
      }

      console.log(`Fetching products from URL: ${url}`); // Debugging line

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Error al obtener productos");

      const data = await response.json();
      console.log("Respuesta completa de productos:", data); // Debugging line

      // Asumimos que la respuesta es un array de productos
      const products = Array.isArray(data) ? data : data.content;
      if (!products) {
        throw new Error("La respuesta de la API no contiene productos");
      }

      console.log("Productos obtenidos:", products); // Debugging line

      const grouped = products.reduce((acc, product) => {
        acc[product.model] = acc[product.model] || [];
        acc[product.model].push(product);
        return acc;
      }, {});

      console.log("Productos agrupados:", grouped); // Debugging line

      setGroupedProducts(grouped);

      for (const model of Object.keys(grouped)) {
        fetchImageForModel(model);
      }
    } catch (error) {
      console.error(error.message);
      setGroupedProducts({});
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:4002/categories", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Error al obtener categorías");

      const data = await response.json();
      setCategories(data.content);
    } catch (error) {
      console.error(error.message);
      setCategories([]);
    }
  };

  const fetchImageForModel = async (model) => {
    try {
      const encodedModel = encodeURIComponent(model);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4002/images/search/${encodedModel}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
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
    fetchCategories();
  }, []);

  const handleCategoryChange = (event) => {
    const categoryType = event.target.value;
    setSelectedCategory(categoryType);
    fetchProducts(categoryType);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-black mb-4">Lista de Productos</h1>

      <div className="mb-4">
        <label htmlFor="category" className="mr-2">
          Filtrar por Categoría:
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="border p-2 rounded"
        >
          <option value="">Todas las Categorías</option>
          {categories.map((category) => (
            <option key={category.id} value={category.categoryType}>
              {capitalizeFirstLetter(category.categoryType)}
            </option>
          ))}
        </select>
      </div>

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
              {images[model] && (
                <img
                  src={images[model]}
                  alt={model}
                  className="w-full h-48 object-cover mt-2"
                />
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;