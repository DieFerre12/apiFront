// src/slices/productsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (categoryType = "") => {
  let url = "http://localhost:4002/products";
  if (categoryType) {
    url = `http://localhost:4002/products/category/${categoryType}`;
  }
  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  return Array.isArray(data) ? data : data.content;
});

export const fetchCategories = createAsyncThunk('products/fetchCategories', async () => {
  const response = await fetch("http://localhost:4002/categories", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  return data.content;
});

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    categories: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export default productsSlice.reducer;