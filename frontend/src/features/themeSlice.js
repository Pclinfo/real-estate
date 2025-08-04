

// src/features/themeSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Read from localStorage when app starts (defaults to 'light' if not set)
const savedColorMode = localStorage.getItem('colorMode') || 'light';

const initialState = {
  colorMode: savedColorMode,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleColorMode: (state) => {
      state.colorMode = state.colorMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('colorMode', state.colorMode);
    },
    setColorMode: (state, action) => {
      state.colorMode = action.payload;
      localStorage.setItem('colorMode', action.payload);
    },
  },
});

export const { toggleColorMode, setColorMode } = themeSlice.actions;
export default themeSlice.reducer;
