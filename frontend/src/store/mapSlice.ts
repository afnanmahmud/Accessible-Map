// src/store/mapSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  features: [],
  selectedFeature: null,
  loading: false,
  error: null
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setFeatures: (state, action) => {
      state.features = action.payload;
    },
    setSelectedFeature: (state, action) => {
      state.selectedFeature = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { 
  setFeatures, 
  setSelectedFeature, 
  setLoading, 
  setError 
} = mapSlice.actions;

export default mapSlice.reducer;