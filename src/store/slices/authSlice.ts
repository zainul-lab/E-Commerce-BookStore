import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Address } from '../../types/user';
import { INITIAL_USER } from '../../data/mockUser';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  selectedDeliveryAddressId: string | null;
}

const loadUserFromStorage = (): User | null => {
  try {
    const saved = localStorage.getItem('ebookstore_user');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading user from localStorage', e);
  }
  return INITIAL_USER;
};

const initialUser = loadUserFromStorage();

const initialState: AuthState = {
  user: initialUser,
  isAuthenticated: !!initialUser,
  selectedDeliveryAddressId: initialUser?.savedAddresses[0]?.id || null,
};

const saveUserToStorage = (user: User | null) => {
  try {
    if (user) {
      localStorage.setItem('ebookstore_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ebookstore_user');
    }
  } catch (e) {
    console.error('Error saving user to localStorage', e);
  }
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.selectedDeliveryAddressId = action.payload.savedAddresses[0]?.id || null;
      saveUserToStorage(action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.selectedDeliveryAddressId = null;
      saveUserToStorage(null);
    },
    setSelectedDeliveryAddressId: (state, action: PayloadAction<string>) => {
      state.selectedDeliveryAddressId = action.payload;
    },
    addAddress: (state, action: PayloadAction<Omit<Address, 'id'>>) => {
      if (state.user) {
        const newAddress: Address = {
          ...action.payload,
          id: `addr-${Date.now()}`,
        };
        if (newAddress.isDefault) {
          state.user.savedAddresses.forEach((addr) => {
            addr.isDefault = false;
          });
        }
        state.user.savedAddresses.push(newAddress);
        state.selectedDeliveryAddressId = newAddress.id;
        saveUserToStorage(state.user);
      }
    },
    removeAddress: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.savedAddresses = state.user.savedAddresses.filter(
          (addr) => addr.id !== action.payload
        );
        if (state.selectedDeliveryAddressId === action.payload) {
          state.selectedDeliveryAddressId = state.user.savedAddresses[0]?.id || null;
        }
        saveUserToStorage(state.user);
      }
    },
    deductPoints: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.rewardPoints = Math.max(0, state.user.rewardPoints - action.payload);
        saveUserToStorage(state.user);
      }
    },
    awardPoints: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.rewardPoints += action.payload;
        saveUserToStorage(state.user);
      }
    },
  },
});

export const {
  login,
  logout,
  setSelectedDeliveryAddressId,
  addAddress,
  removeAddress,
  deductPoints,
  awardPoints,
} = authSlice.actions;

export default authSlice.reducer;
