import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Crear Orden
export const createOrder = createAsyncThunk('order/createOrder', async (orderData, { rejectWithValue }) => {
  const { userId, token, paymentMethod, orderDate, discountedTotal, originalTotal, address, installments } = orderData;
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
    installments: installments,
  };

  console.log('Payload de la orden:', orderPayload); // Agregar detalles de depuración

  try {
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
      console.error('Error al crear la orden:', errorText); // Agregar detalles de depuración
      return rejectWithValue(`Error al crear la orden: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al crear la orden:', error.message); // Agregar detalles de depuración
    return rejectWithValue(`Error al crear la orden: ${error.message}`);
  }
});

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

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    order: null,
    loading: false,
    error: null,
    address: '',
    installments: '',
  },
  reducers: {
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    setInstallments: (state, action) => {
      state.installments = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setAddress, setInstallments } = orderSlice.actions;
export default orderSlice.reducer;