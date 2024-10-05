import React, { useState, useEffect } from 'react';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    // Aquí harías la llamada a tu API para obtener productos destacados
    fetch('/api/products/featured')
      .then(response => response.json())
      .then(data => setFeaturedProducts(data))
      .catch(error => console.log(error));
  }, []);

  return (
    <div className="home-container">
      <h1>Bienvenido a la tienda de zapatillas</h1>
      <div className="featured-products">
        {featuredProducts.length > 0 ? (
          featuredProducts.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.price}</p>
            </div>
          ))
        ) : (
          <p>Cargando productos...</p>
        )}
      </div>
    </div>
  );
};

export default Home;
