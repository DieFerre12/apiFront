import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash } from 'react-icons/fa';
import { createOrder } from '../Order/CreateOrder';

const Cart = ({ cart, setCart }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("mercado_pago");
  const [discountedTotal, setDiscountedTotal] = useState(0);
  const [images, setImages] = useState({});

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        if (!token || !user || !user.id) {
          alert('No se encontró el token de autenticación o el ID del usuario. Por favor, inicia sesión.');
          navigate('/login');
          return;
        }

        const response = await fetch(`http://localhost:4002/shoppingCart/user/${user.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error al obtener el carrito: ${errorText}`);
        }

        const data = await response.json();
        console.log("Datos del carrito:", data);
        setCart(data.products);

        for (const product of data.products) {
          fetchImageForModel(product.model);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate, setCart]);

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
      setImages((prevImages) => ({
        ...prevImages,
        [model]: URL.createObjectURL(blob),
      }));
    } catch (error) {
      console.error(error.message);
    }
  };

  const removeFromCart = async (product) => {
    try {
      const { model, size } = product;
      if (!model || !size) {
        throw new Error('Model or size is undefined');
      }
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      if (!token || !user || !user.id) {
        alert('No se encontró el token de autenticación o el ID del usuario. Por favor, inicia sesión.');
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:4002/shoppingCart/user/${user.id}/removeProduct/${model}/${size}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al eliminar el producto del carrito: ${errorText}`);
      }

      const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
      const updatedCart = currentCart.filter((p) => p.model !== model || p.size !== size);
      localStorage.setItem('cart', JSON.stringify(updatedCart));

      setCart((prevCart) => prevCart.filter((p) => p.model !== model || p.size !== size));
    } catch (error) {
      setError(error.message);
    }
  };

  const updateQuantity = async (product, quantity) => {
    try {
      const { model, size } = product;
      if (!model || !size) {
        throw new Error('Model or size is undefined');
      }
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      if (!token || !user || !user.id) {
        alert('No se encontró el token de autenticación o el ID del usuario. Por favor, inicia sesión.');
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:4002/shoppingCart/user/${user.id}/updateProduct`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ model, size, quantity })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al actualizar la cantidad del producto: ${errorText}`);
      }

      setCart((prevCart) =>
        prevCart.map((p) =>
          p.model === model && p.size === size ? { ...p, quantity } : p
        )
      );

      const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
      const updatedCart = currentCart.map((p) =>
        p.model === model && p.size === size ? { ...p, quantity } : p
      );
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      if (!token || !user || !user.id) {
        alert('No se encontró el token de autenticación o el ID del usuario. Por favor, inicia sesión.');
        navigate('/login');
        return;
      }

      const orderDate = new Date().toISOString().split('T')[0];

      const data = await createOrder(user.id, token, paymentMethod, orderDate, discountedTotal);
      alert('Orden creada exitosamente');
      setCart([]);

      localStorage.setItem('lastOrder', JSON.stringify(data));

      navigate('/order');
    } catch (error) {
      console.error('Error:', error);
      alert(`Hubo un error al crear la orden: ${error.message}`);
    }
  };

  const calculateDiscountedTotal = (total, paymentMethod) => {
    let discount = 0;
    if (paymentMethod === "mercado_pago") {
      discount = -0.10;
    } else if (paymentMethod === "tarjeta_debito") {
      discount = -0.05;
    } else if (paymentMethod === "tarjeta_credito") {
      discount = 0.10;
    }
    return total + (total * discount);
  };

  const total = cart.reduce((acc, product) => acc + (product.price * product.quantity), 0);

  useEffect(() => {
    setDiscountedTotal(calculateDiscountedTotal(total, paymentMethod));
  }, [total, paymentMethod]);

  if (loading) {
    return <div>Cargando carrito...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md mt-8 max-w-5xl animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Carrito de Compras</h2>
      {cart.length === 0 ? (
        <p className="text-lg text-gray-600">El carrito está vacío.</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-300">
            {cart.map((product) => (
              <li key={`${product.model}-${product.size}`} className="py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={images[product.model]}
                    alt={product.model}
                    className="w-20 h-20 object-cover mr-4 shadow-md rounded"
                  />
                  <div>
                    <p className="text-lg font-semibold text-gray-800">{product.model}</p>
                    <p className="text-sm text-gray-600">{product.description}</p>
                    <p className="text-sm text-gray-600">Talle: {product.size.replace('SIZE_', '')}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <p className="text-lg font-bold text-gray-800 mr-4">
                    ${(product.price * product.quantity).toFixed(2)}
                  </p>
                  <select
                    value={product.quantity}
                    onChange={(e) => updateQuantity(product, e.target.value)}
                    className="w-16 p-1 border rounded mr-4 shadow-sm transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                  <button onClick={() => removeFromCart(product)} className="text-red-500 hover:text-red-700">
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
            <h3 className="text-xl font-bold">Total: ${(total).toFixed(2)}</h3>
            <p className="text-lg font-semibold text-green-600">
              {paymentMethod === "tarjeta_credito" ? "Total con recargo por tarjeta de crédito: $" : "Total con descuento: $" }
              {discountedTotal.toFixed(2)}
            </p>
          </div>
          <div className="mt-6 flex justify-between">
            <button
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-transform duration-300 transform hover:scale-105"
              onClick={() => navigate('/product')}
            >
              Seguir Comprando
            </button>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-transform duration-300 transform hover:scale-105"
              onClick={handleCheckout}
            >
              Finalizar Compra
            </button>
          </div>
          <div className="mt-6">
            <label htmlFor="paymentMethod" className="block text-lg text-gray-800 mb-2 font-semibold">Método de Pago:</label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="border rounded p-2 shadow-md transition-transform duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="mercado_pago">Mercado Pago</option>
              <option value="tarjeta_debito">Tarjeta de Débito</option>
              <option value="tarjeta_credito">Tarjeta de Crédito</option>
            </select>
          </div>
        </>
      )}
    </div>
  );  
};

export default Cart;
