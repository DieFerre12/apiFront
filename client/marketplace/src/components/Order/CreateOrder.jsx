export const createOrder = async (orderData) => {
  const { userId, token, paymentMethod, orderDate, discountedTotal, originalTotal, address } = orderData;
  const discount = calculateDiscount(paymentMethod);
  const orderPayload = {
    id: userId,
    paymentMethod: paymentMethod,
    orderDate: orderDate,
    totalPrice: discountedTotal,
    originalTotal: originalTotal,
    discount: discount,
    withSurcharge: discount < 0 ? true : false,
    address: address,
  };

  const response = await fetch(`http://localhost:4002/order/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(orderPayload)
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
  } else if (paymentMethod === "Tarjeta de debito") {
    return 0.05;
  } else if (paymentMethod === "Tarjeta de credito") {
    return -0.10; // Recargo del 10%
  }
  return 0;
};