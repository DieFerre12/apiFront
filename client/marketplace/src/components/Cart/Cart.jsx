import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Cart = ({ cart, setCart }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Actualizar los productos seleccionados cada vez que cambie el carrito
    setSelectedProducts(cart.map(product => ({
      model: product.model,
      size: `SIZE_${product.size}`, // Formatear el tamaño
      quantity: product.quantity || 1
    })));
  }, [cart]);

  console.log('Estado del carrito:', cart); // Verificar el estado del carrito
  console.log('Productos seleccionados:', selectedProducts); // Verificar los productos seleccionados

  const removeFromCart = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item, i) =>
        i === index ? { ...item, quantity: parseInt(quantity) } : item
      )
    );
  };

  const total = cart.reduce((acc, product) => acc + (product.price * (product.quantity || 1)), 0);

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem('token'); // Obtener el token JWT del almacenamiento local
      const user = JSON.parse(localStorage.getItem('user')); // Obtener los datos del usuario
      if (!token || !user || !user.id) {
        alert('No se encontró el token de autenticación o el ID del usuario. Por favor, inicia sesión.');
        navigate('/login'); // Redirigir a la página de inicio de sesión
        return;
      }

      console.log('Token JWT:', token); // Depuración: Verificar el token JWT

      const response = await fetch(`http://localhost:4002/shoppingCart/user/${user.id}/addProduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Enviar el token JWT en el encabezado de autorización
        },
        body: JSON.stringify(selectedProducts),
      });

      console.log('Respuesta del servidor:', response); // Depuración: Verificar la respuesta del servidor

      if (response.status === 403) {
        const errorText = await response.text();
        console.error('Error 403:', errorText); // Depuración: Verificar el mensaje de error
        throw new Error('No tienes permiso para realizar esta acción. Por favor, verifica tus credenciales.');
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error:', errorText); // Depuración: Verificar el mensaje de error
        throw new Error(`Error al guardar el carrito en la base de datos: ${errorText}`);
      }

      const data = await response.json();
      console.log('Respuesta del servidor:', data);
      alert('Carrito guardado exitosamente');
    } catch (error) {
      console.error('Error:', error);
      alert(`Hubo un error al guardar el carrito: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg mt-8 max-w-5xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Carrito de Compras</h2>
      {cart.length === 0 ? (
        <p className="text-lg text-gray-600">El carrito está vacío.</p>
      ) : (
        <>
          <ul>
            {cart.map((product, index) => (
              <li key={index} className="mb-4">
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
                      value={product.quantity || 1}
                      onChange={(e) => updateQuantity(index, e.target.value)}
                      className="w-16 p-1 border rounded mr-4"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeFromCart(index)}
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
