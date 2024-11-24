import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import productsReducer from './slices/productsSlice';
import orderReducer from './slices/orderSlice';
import registerReducer from './slices/registerSlice'; // Importa el slice de registro

const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
    order: orderReducer,
    auth: registerReducer, // Agrega el slice de registro al store
  },
});

export default store;