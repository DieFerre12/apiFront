import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import ProductGallery from '../components/Home/Products';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000, // 5 segundos
    arrows: true,
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:4002/products", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Error al obtener productos");

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Cargando productos...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-center bg-gray-100 p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6 w-full max-w-4xl">
        <h2 className="text-5xl font-extrabold text-white mb-4">Zapas el tatita</h2>
        <p className="text-gray-300 text-xl mb-6">
          Encuentra las mejores ofertas en zapatillas deportivas y de moda.
        </p>
      </div>
      
      <div className="w-full mb-7 relative max-w-4xl">
        <Slider {...settings}>
          <div>
            <img 
              src="https://tse2.mm.bing.net/th?id=OIG3.DPk295Tju79sqXbVrHLu&pid=ImgGn" 
              alt="Banner 1" 
              className="w-full h-96 object-contain"
            />
          </div>
          <div>
            <img 
              src="https://tse4.mm.bing.net/th?id=OIG2.rwUg99mQ4OYsfh44aCxp&pid=ImgGn" 
              alt="Banner 2" 
              className="w-full h-96 object-contain"
            />
          </div>
          <div>
            <img 
              src="https://tse4.mm.bing.net/th?id=OIG3.2iVybp8pFI0xRrcKgxef&pid=ImgGn" 
              alt="Banner 3" 
              className="w-full h-96 object-contain"
            />
          </div>
          <div>
            <img 
              src="https://tse4.mm.bing.net/th?id=OIG2.kbMHU0Zr3sECl8KqrJQ2&pid=ImgGn" 
              alt="Banner 4" 
              className="w-full h-96 object-contain"
            />
          </div>
        </Slider>
      </div>
      <h1 className="text-3xl font-bold text-black mb-4"> Productos Recomendados </h1>
      <ProductGallery />
    </div>
  );
};

export default Home;
