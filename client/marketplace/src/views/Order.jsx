import React, { useEffect, useState } from 'react';

const Order = () => {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Recuperar los datos de la orden desde localStorage
    const lastOrder = JSON.parse(localStorage.getItem('lastOrder'));
    if (lastOrder) {
      setOrder(lastOrder);
    }
  }, []);

  if (!order) {
    return <div>No se encontró la orden.</div>;
  }

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4">Ticket de Compra</h1>
      <div className="mb-4">
        <p><strong>Orden ID:</strong> {order.orderId}</p>
        <p><strong>Fecha de Orden:</strong> {order.orderDate}</p>
        <p><strong>Método de Pago:</strong> {order.paymentMethod}</p>
        <p><strong>Usuario:</strong> {order.userName}</p>
      </div>
      <h3 className="text-xl font-semibold mb-2">Productos:</h3>
      <ul className="list-none p-0">
        {order.products.map(product => (
          <li key={product.model} className="border-b border-gray-200 py-2">
            <p><strong>Producto:</strong> {product.model}</p>
            <p><strong>Cantidad:</strong> {product.quantity}</p>
            <p><strong>Precio:</strong> ${product.price}</p>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <p><strong>Descuento:</strong> ${order.discount}</p>
        <p><strong>Precio total:</strong> ${order.totalPrice}</p>
      </div>
    </div>
  );
};

export default Order;