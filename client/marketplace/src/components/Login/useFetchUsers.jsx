import { useState, useEffect } from 'react';

const useFetchUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token'); // Obtener el token JWT del almacenamiento local
      if (!token) {
        // No hacer nada si no hay token
        return;
      }

      try {
        const response = await fetch('http://localhost:4002/users/all', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Enviar el token JWT en el encabezado de autorización
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error al obtener usuarios: ${errorText}`);
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUsers();
  }, []);

  return { users, error };
};

export default useFetchUsers;