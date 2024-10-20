import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash } from 'react-icons/fa';
import { createOrder } from '../Order/CreateOrder'; // Importar la función createOrder

const Cart = ({ cart, setCart }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        console.log("Datos del carrito:", data); // Verificar los datos del carrito
        setCart(data.products);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate, setCart]);

  const removeFromCart = async (product) => {
    try {
      const { model, size } = product;
      if (!model || !size) {
        throw new Error('Model or size is undefined');
      }
      console.log("Product Model:", model); // Verificar el model
      console.log("Product Size:", size); // Verificar el size
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

      // Eliminar el producto de localStorage
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
      console.log("Product Model:", model); // Verificar el model
      console.log("Product Size:", size); // Verificar el size
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

      // Actualizar el producto en localStorage
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

      console.log("Token JWT:", token); // Verificar el token JWT
      console.log("Datos del usuario:", user); // Verificar los datos

      const orderDate = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD
      const paymentMethod = "mercado_pago"; // Puedes cambiar según el método de pago seleccionado

      const data = await createOrder(user.id, token, paymentMethod, orderDate);
      console.log('Respuesta del servidor:', data); // Verificar la respuesta del servidor
      alert('Orden creada exitosamente');
      setCart([]);

      // Guardar los datos de la orden en localStorage
      localStorage.setItem('lastOrder', JSON.stringify(data));

      // Redirigir a la vista de órdenes
      navigate('/order');
    } catch (error) {
      console.error('Error:', error);
      alert(`Hubo un error al crear la orden: ${error.message}`);
    }
  };

  const total = cart.reduce((acc, product) => acc + (product.price * product.quantity), 0);

  if (loading) {
    return <div>Cargando carrito...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg mt-8 max-w-5xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Carrito de Compras</h2>
      {cart.length === 0 ? (
        <p className="text-lg text-gray-600">El carrito está vacío.</p>
      ) : (
        <>
          <ul>
            {cart.map((product) => (
              <li key={`${product.model}-${product.size}`} className="mb-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <img src={product.image} alt={product.model} className="w-16 h-16 object-cover mr-4" />
                    <div>
                      <p className="text-lg text-gray-800">{product.model}</p>
                      <p className="text-sm text-gray-600">{product.description}</p>
                      <p className="text-sm text-gray-600">Talle: SIZE_{product.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <p className="text-lg text-gray-800 mr-4">${product.price}</p>
                    <select
                      value={product.quantity}
                      onChange={(e) => updateQuantity(product, e.target.value)}
                      className="w-16 p-1 border rounded mr-4"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeFromCart(product)} // Llamar a removeFromCart con el producto completo
                      className="bg-red-500 text-white p-2 rounded"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <div className="flex justify-between items-center">
              <p className="text-lg text-gray-800">Total de la compra:</p>
              <p className="text-lg text-gray-800">${total.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={handleCheckout}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
            >
              Finalizar Compra
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;