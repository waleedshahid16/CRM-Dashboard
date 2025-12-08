import { createSlice } from "@reduxjs/toolkit";

const uiSLice = createSlice({
  name: "ui",
  initialState: {
    sidebarOpen: false, // Closed by default for mobile-first experience
    modalOpen: false,
    theme: "light",
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    openModal: (state) => {
      state.modalOpen = true;
    },
    closeModal: (state) => {
      state.modalOpen = false;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});
export const {
  toggleSidebar,
  setSidebarOpen,
  openModal,
  closeModal,
  setTheme,
} = uiSLice.actions;

// Selectors
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectModalOpen = (state) => state.ui.modalOpen;
export const selectTheme = (state) => state.ui.theme;

export default uiSLice.reducer;
