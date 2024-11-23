import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder, setAddress, setInstallments } from '../Redux/slices/orderSlice';
import { showSuccessAlert, showErrorAlert } from '../PreOrder/Alerts';


const UserDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const address = useSelector((state) => state.order.address);
  const installments = useSelector((state) => state.order.installments);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({
    address: address || '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
    cardType: '',
    installments: installments || '',
  });
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [discountedTotal, setDiscountedTotal] = useState(0);
  const [originalTotal, setOriginalTotal] = useState(0);

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));  // Intentamos cargar desde localStorage
      const storedCart = JSON.parse(localStorage.getItem('cart'));  // Intentamos cargar el carrito

      if (storedUser && storedUser.id) {
        setUser(storedUser);
      } else {
        alert('No se encontró el ID del usuario. Por favor, inicia sesión.');
        navigate('/login');
      }

      if (storedCart) {
        setCart(storedCart);
        // Aquí podrías calcular el total original si tienes los productos
        setOriginalTotal(storedCart.reduce((acc, item) => acc + item.price * item.quantity, 0)); // Ejemplo de cálculo
      }
    } catch (error) {
      console.error('Error al acceder a localStorage:', error);
      setError('Error al cargar los datos desde localStorage');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Validaciones específicas para campos de número y formato
    if (name === 'cardNumber' || name === 'cardCVC') {
      if (!/^\d*$/.test(value)) return; // Permitir solo números
    }
    if (name === 'cardExpiry') {
      if (!/^\d{0,2}(\/\d{0,2})?$/.test(value)) return; // Validar formato mm/yy
    }
    setFormData({
      ...formData,
      [name]: value,
    });

    // Guardar los datos en el estado de Redux
    if (name === 'address') {
      dispatch(setAddress(value));
    }
    if (name === 'installments') {
      dispatch(setInstallments(value));
    }
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    const discount = calculateDiscount(e.target.value);
    setDiscountedTotal(originalTotal - originalTotal * discount);
  };

  const calculateDiscount = (paymentMethod) => {
    if (paymentMethod === 'mercado_pago') {
      return 0.10;
    } else if (paymentMethod === 'Tarjeta de debito') {
      return 0.05;
    } else if (paymentMethod === 'Tarjeta de credito') {
      return -0.10; // Recargo del 10%
    }
    return 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!user || !user.id) {
        alert('No se encontró el ID del usuario.');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        alert('Token de autenticación no encontrado. Por favor, inicia sesión.');
        navigate('/login');
        return;
      }

      // Recopilamos todos los datos en un solo objeto
      const orderData = {
        userId: user.id,                       // Usamos el ID del usuario recuperado
        token,                                 // Token de autenticación
        paymentMethod,                         // Método de pago
        orderDate: new Date().toISOString(),   // Fecha de la orden
        discountedTotal,                       // Total con descuento
        originalTotal,                         // Total original
        address: formData.address,             // Dirección del formulario
        installments: formData.installments,   // Cantidad de cuotas
        products: cart,                        // Productos del carrito
      };

      console.log('Enviando datos de la orden:', orderData);  // Verifica los datos

      // Llamamos a la acción createOrder pasándole el objeto con todos los datos
      const resultAction = await dispatch(createOrder(orderData));

      if (createOrder.fulfilled.match(resultAction)) {
        // Si la orden se crea correctamente
        showSuccessAlert(); 
        localStorage.removeItem('cart');  // Limpiamos el carrito
        localStorage.setItem('lastOrder', JSON.stringify({
          ...resultAction.payload,
          address: formData.address,
          installments: formData.installments,
        }));  // Guardamos la orden creada

        // Redirigimos al usuario a la página de orden
        navigate('/order');
      } else {
        throw new Error(resultAction.payload || 'Error al crear la orden');
      }
    } catch (error) {
      showErrorAlert(); // Muestra la alerta de error
      setError(`Hubo un error al crear la orden: ${error.message}`);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Detalles del Usuario</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="address" className="block text-gray-600 font-medium">
            Domicilio:
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label htmlFor="paymentMethod" className="block text-gray-600 font-medium">
            Método de Pago:
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={paymentMethod}
            onChange={handlePaymentMethodChange}
            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          >
            <option value="">Seleccione un método de pago</option>
            <option value="mercado_pago">Mercado Pago</option>
            <option value="tarjeta_debito">Tarjeta de Débito</option>
            <option value="tarjeta_credito">Tarjeta de Crédito</option>
          </select>
        </div>
        <div>
          <label htmlFor="installments" className="block text-gray-600 font-medium">
            Cantidad de Cuotas:
          </label>
          <select
            id="installments"
            name="installments"
            value={formData.installments}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          >
            <option value="">Seleccione cantidad de cuotas</option>
            <option value="1">1 cuota</option>
            <option value="3">3 cuotas</option>
            <option value="6">6 cuotas</option>
            <option value="12">12 cuotas</option>
          </select>
        </div>
        <div>
          <label htmlFor="cardNumber" className="block text-gray-600 font-medium">
            Número de Tarjeta:
          </label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label htmlFor="cardExpiry" className="block text-gray-600 font-medium">
            Fecha de Expiración (MM/YY):
          </label>
          <input
            type="text"
            id="cardExpiry"
            name="cardExpiry"
            value={formData.cardExpiry}
            onChange={handleChange}
            placeholder="MM/YY"
            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label htmlFor="cardCVC" className="block text-gray-600 font-medium">
            CVV:
          </label>
          <input
            type="text"
            id="cardCVC"
            name="cardCVC"
            value={formData.cardCVC}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Finalizar compra
        </button>
      </form>
    </div>
  );
};

export default UserDetails;