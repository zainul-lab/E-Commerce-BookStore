import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Book } from '../../types/book';
import { CartItem } from '../../types/cart';

interface CartState {
  items: CartItem[];
  giftPointsToRedeem: number; // e.g. 500 points = $5.00
  couponCode: string | null;
  couponDiscountPercentage: number;
  shippingOption: 'standard' | 'express' | 'overnight';
}

const loadCartFromStorage = (): CartItem[] => {
  try {
    const saved = localStorage.getItem('ebookstore_cart');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading cart from localStorage', e);
  }
  return [];
};

const initialState: CartState = {
  items: loadCartFromStorage(),
  giftPointsToRedeem: 0,
  couponCode: null,
  couponDiscountPercentage: 0,
  shippingOption: 'standard',
};

const saveCartToStorage = (items: CartItem[]) => {
  try {
    localStorage.setItem('ebookstore_cart', JSON.stringify(items));
  } catch (e) {
    console.error('Error saving cart to localStorage', e);
  }
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{ book: Book; quantity?: number; format?: string }>
    ) => {
      const { book, quantity = 1, format = book.format } = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.book.id === book.id && item.selectedFormat === format
      );

      if (existingItemIndex > -1) {
        state.items[existingItemIndex].quantity += quantity;
      } else {
        state.items.push({
          book,
          quantity,
          selectedFormat: format,
        });
      }
      saveCartToStorage(state.items);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ bookId: string; format: string; quantity: number }>
    ) => {
      const { bookId, format, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter(
          (item) => !(item.book.id === bookId && item.selectedFormat === format)
        );
      } else {
        const item = state.items.find(
          (item) => item.book.id === bookId && item.selectedFormat === format
        );
        if (item) {
          item.quantity = quantity;
        }
      }
      saveCartToStorage(state.items);
    },
    removeFromCart: (
      state,
      action: PayloadAction<{ bookId: string; format: string }>
    ) => {
      const { bookId, format } = action.payload;
      state.items = state.items.filter(
        (item) => !(item.book.id === bookId && item.selectedFormat === format)
      );
      saveCartToStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      state.giftPointsToRedeem = 0;
      state.couponCode = null;
      state.couponDiscountPercentage = 0;
      saveCartToStorage([]);
    },
    setGiftPointsToRedeem: (state, action: PayloadAction<number>) => {
      state.giftPointsToRedeem = action.payload;
    },
    applyCoupon: (
      state,
      action: PayloadAction<{ code: string; discountPercentage: number }>
    ) => {
      state.couponCode = action.payload.code;
      state.couponDiscountPercentage = action.payload.discountPercentage;
    },
    removeCoupon: (state) => {
      state.couponCode = null;
      state.couponDiscountPercentage = 0;
    },
    setShippingOption: (
      state,
      action: PayloadAction<'standard' | 'express' | 'overnight'>
    ) => {
      state.shippingOption = action.payload;
    },
  },
});

export const {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  setGiftPointsToRedeem,
  applyCoupon,
  removeCoupon,
  setShippingOption,
} = cartSlice.actions;

export default cartSlice.reducer;
