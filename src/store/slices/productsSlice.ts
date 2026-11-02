import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Book, BookCategory } from '../../types/book';
import { MOCK_BOOKS } from '../../data/mockBooks';

export type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest' | 'discount';

interface ProductsState {
  books: Book[];
  selectedCategory: BookCategory | 'All';
  selectedBrand: string | 'All';
  searchQuery: string;
  sortBy: SortOption;
  priceRange: [number, number];
  minRating: number;
  inStockOnly: boolean;
  quickViewBook: Book | null;
}

const initialState: ProductsState = {
  books: MOCK_BOOKS,
  selectedCategory: 'All',
  selectedBrand: 'All',
  searchQuery: '',
  sortBy: 'featured',
  priceRange: [0, 100],
  minRating: 0,
  inStockOnly: false,
  quickViewBook: null,
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<BookCategory | 'All'>) => {
      state.selectedCategory = action.payload;
    },
    setSelectedBrand: (state, action: PayloadAction<string | 'All'>) => {
      state.selectedBrand = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSortBy: (state, action: PayloadAction<SortOption>) => {
      state.sortBy = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.priceRange = action.payload;
    },
    setMinRating: (state, action: PayloadAction<number>) => {
      state.minRating = action.payload;
    },
    setInStockOnly: (state, action: PayloadAction<boolean>) => {
      state.inStockOnly = action.payload;
    },
    setQuickViewBook: (state, action: PayloadAction<Book | null>) => {
      state.quickViewBook = action.payload;
    },
    resetFilters: (state) => {
      state.selectedCategory = 'All';
      state.selectedBrand = 'All';
      state.searchQuery = '';
      state.sortBy = 'featured';
      state.priceRange = [0, 100];
      state.minRating = 0;
      state.inStockOnly = false;
    },
  },
});

export const {
  setSelectedCategory,
  setSelectedBrand,
  setSearchQuery,
  setSortBy,
  setPriceRange,
  setMinRating,
  setInStockOnly,
  setQuickViewBook,
  resetFilters,
} = productsSlice.actions;

export default productsSlice.reducer;
