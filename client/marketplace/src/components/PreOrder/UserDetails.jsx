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
      const storedUser = JSON.parse(localStorage.getItem('user'));  
      const storedCart = JSON.parse(localStorage.getItem('cart'));  

      if (storedUser && storedUser.id) {
        setUser(storedUser);
      } else {
        alert('No se encontró el ID del usuario. Por favor, inicia sesión.');
        navigate('/login');
      }

      if (storedCart) {
        setCart(storedCart);
        setOriginalTotal(storedCart.reduce((acc, item) => acc + item.price * item.quantity, 0)); 
      }
    } catch (error) {
      console.error('Error al acceder a localStorage:', error);
      setError('Error al cargar los datos desde localStorage');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'cardNumber') {
      // Eliminar todos los caracteres que no sean dígitos
      const cleanedValue = value.replace(/\D/g, '');
      // Limitar a 16 dígitos
      if (cleanedValue.length > 16) return;
      // Agregar un espacio cada 4 dígitos
      const formattedValue = cleanedValue.replace(/(.{4})/g, '$1 ').trim();
      setFormData({
        ...formData,
        [name]: formattedValue,
      });
      return;
    }
  
    if (name === 'cardCVC') {
      if (!/^\d{0,4}$/.test(value)) return;
    }
  
    if (name === 'cardExpiry') {
      // Eliminar todos los caracteres que no sean dígitos
      const cleanedValue = value.replace(/\D/g, '');
      // Limitar a 4 dígitos
      if (cleanedValue.length > 4) return;
      // Agregar una barra después de los primeros 2 dígitos
      const formattedValue = cleanedValue.replace(/(\d{2})(\d{0,2})/, '$1/$2');
      setFormData({
        ...formData,
        [name]: formattedValue,
      });
      return;
    }
  
    setFormData({
      ...formData,
      [name]: value,
    });
  
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
      return -0.10; 
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

      const [expMonth, expYear] = formData.cardExpiry.split('/').map(Number);
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear() % 100;

      if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        alert('La fecha de expiración de la tarjeta no puede ser una fecha pasada.');
        return;
      }

      const orderData = {
        userId: user.id,                       
        token,                                 
        paymentMethod,                         
        orderDate: new Date().toISOString(),   
        discountedTotal,                       
        originalTotal,                         
        address: formData.address,             
        installments: formData.installments,   
        products: cart,                        
      };

      console.log('Enviando datos de la orden:', orderData);  

      const resultAction = await dispatch(createOrder(orderData));

      if (createOrder.fulfilled.match(resultAction)) {
        showSuccessAlert(); 
        localStorage.removeItem('cart');  
        localStorage.setItem('lastOrder', JSON.stringify({
          ...resultAction.payload,
          address: formData.address,
          installments: formData.installments,
        }));  

        navigate('/order');
      } else {
        throw new Error(resultAction.payload || 'Error al crear la orden');
      }
    } catch (error) {
      showErrorAlert(); 
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