import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  subMessage?: string;
  duration?: number;
}

interface UiState {
  toasts: ToastMessage[];
  isAuthModalOpen: boolean;
  isAddressModalOpen: boolean;
  isMobileMenuOpen: boolean;
  authModalMode: 'login' | 'register';
}

const initialState: UiState = {
  toasts: [],
  isAuthModalOpen: false,
  isAddressModalOpen: false,
  isMobileMenuOpen: false,
  authModalMode: 'login',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<Omit<ToastMessage, 'id'>>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      state.toasts.push({
        id,
        duration: 3500,
        ...action.payload,
      });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    setAuthModalOpen: (
      state,
      action: PayloadAction<{ isOpen: boolean; mode?: 'login' | 'register' }>
    ) => {
      state.isAuthModalOpen = action.payload.isOpen;
      if (action.payload.mode) {
        state.authModalMode = action.payload.mode;
      }
    },
    setAddressModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAddressModalOpen = action.payload;
    },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isMobileMenuOpen = action.payload;
    },
  },
});

export const {
  addToast,
  removeToast,
  setAuthModalOpen,
  setAddressModalOpen,
  setMobileMenuOpen,
} = uiSlice.actions;

export default uiSlice.reducer;
