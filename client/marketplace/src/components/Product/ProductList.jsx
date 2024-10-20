import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ProductList = ({ showCategoryFilter = true }) => {
  const [groupedProducts, setGroupedProducts] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchProducts = async (categoryId = "") => {
    try {
      let url = "http://localhost:4002/products";
      if (categoryId) {
        url += `?category=${categoryId}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Error al obtener productos");

      const data = await response.json();

      const grouped = data.content.reduce((acc, product) => {
        acc[product.model] = acc[product.model] || [];
        acc[product.model].push(product);
        return acc;
      }, {});

      setGroupedProducts(grouped);
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
      console.log("Categorías obtenidas:", data);
      setCategories(data.content);
    } catch (error) {
      console.error(error.message);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);
    fetchProducts(categoryId);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-black mb-4">Lista de Productos</h1>

      {showCategoryFilter && (
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
              <option key={category.id} value={category.id}>
                {capitalizeFirstLetter(category.categoryType)}
              </option>
            ))}
          </select>
        </div>
      )}

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
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;