export const createOrder = async (userId, token, paymentMethod, orderDate, discountedTotal) => {
  const orderData = {
    id: userId,
    paymentMethod: paymentMethod,
    orderDate: orderDate,
    totalPrice: discountedTotal,
    discount: calculateDiscount(paymentMethod)
  };

  const response = await fetch(`http://localhost:4002/order/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(orderData)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al crear la orden: ${errorText}`);
  }

  return await response.json();
};

const calculateDiscount = (paymentMethod) => {
  if (paymentMethod === "mercado_pago") {
    return 0.10;
  } else if (paymentMethod === "tarjeta_debito") {
    return 0.05;
  }
  return 0;
};