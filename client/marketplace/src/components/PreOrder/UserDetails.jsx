import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const UserDetails = () => {
  const user = useSelector(state => state.user); // Asumiendo que el estado del usuario está en state.user
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        firstName: user.firstName,
        lastName: user.lastName
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar el envío del formulario, por ejemplo, despachando una acción de Redux
    console.log('Datos del formulario:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="firstName">Nombre:</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="lastName">Apellido:</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="address">Domicilio:</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="cardNumber">Número de Tarjeta:</label>
        <input
          type="text"
          id="cardNumber"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="cardExpiry">Fecha de Expiración:</label>
        <input
          type="text"
          id="cardExpiry"
          name="cardExpiry"
          value={formData.cardExpiry}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="cardCVC">CVC:</label>
        <input
          type="text"
          id="cardCVC"
          name="cardCVC"
          value={formData.cardCVC}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Enviar</button>
    </form>
  );
};

export default UserDetails;