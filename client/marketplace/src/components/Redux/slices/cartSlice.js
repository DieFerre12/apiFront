import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch Cart
export const fetchCart = createAsyncThunk('cart/fetchCart', async (userId, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:4002/shoppingCart/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return rejectWithValue(`Error al obtener el carrito: ${errorText}`);
    }

    const text = await response.text();
    if (!text) {
      return [];
    }

    return JSON.parse(text).products || [];
  } catch (error) {
    return rejectWithValue(`Error al obtener el carrito: ${error.message}`);
  }
});

// Add to Cart
export const addToCart = createAsyncThunk('cart/addToCart', async (productWithSize, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await fetch(`http://localhost:4002/shoppingCart/user/${user.id}/addProduct`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(productWithSize),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return rejectWithValue(`Error al agregar al carrito: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    return rejectWithValue(`Error al agregar al carrito: ${error.message}`);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    removeFromCart: (state, action) => {
      const { model, size } = action.payload;
      state.items = state.items.filter(
        (item) => !(item.model === model && item.size === size)
      );
    },
    updateQuantity: (state, action) => {
      const { model, size, quantity } = action.payload;
      const item = state.items.find((item) => item.model === model && item.size === size);
      if (item) {
        item.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
