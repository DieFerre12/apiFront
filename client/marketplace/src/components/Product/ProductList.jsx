import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from "react-router-dom";
import { fetchProducts, fetchCategories } from '../Redux/slices/productsSlice';
import ClipLoader from "react-spinners/ClipLoader";

const ProductList = () => {
  const { brand } = useParams();
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const categories = useSelector((state) => state.products.categories);
  const productStatus = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [images, setImages] = useState({});

  useEffect(() => {
    dispatch(fetchProducts({ categoryType: selectedCategory, brand }));
    dispatch(fetchCategories());
  }, [dispatch, selectedCategory, brand]);

  const fetchImageForModel = async (model) => {
    try {
      const encodedModel = encodeURIComponent(model);
      const response = await fetch(`http://localhost:4002/images/search/${encodedModel}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
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
    if (products.length > 0) {
      const grouped = products.reduce((acc, product) => {
        acc[product.model] = acc[product.model] || [];
        acc[product.model].push(product);
        return acc;
      }, {});

      for (const model of Object.keys(grouped)) {
        fetchImageForModel(model);
      }
    }
  }, [products]);

  const handleCategoryChange = (event) => {
    const categoryType = event.target.value;
    setSelectedCategory(categoryType);
    dispatch(fetchProducts({ categoryType, brand }));
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

      {productStatus === 'loading' ? (
        <div className="flex justify-center items-center">
          <ClipLoader size={70} color={"#123abc"} loading={true} />
        </div>
      ) : productStatus === 'failed' ? (
        <p>Error: {error}</p>
      ) : products.length === 0 ? (
        <p>No hay productos en la categoría seleccionada.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(products.reduce((acc, product) => {
            acc[product.model] = acc[product.model] || [];
            acc[product.model].push(product);
            return acc;
          }, {})).map(([model, products]) => (
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