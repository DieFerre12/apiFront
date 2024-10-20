export const createOrder = async (userId, token, paymentMethod, orderDate) => {
    const orderData = {
      id: userId,
      paymentMethod: paymentMethod,
      orderDate: orderDate
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