import { Book } from './book';

export interface CartItem {
  book: Book;
  quantity: number;
  selectedFormat: string;
}

export interface CartState {
  items: CartItem[];
  giftPointsToRedeem: number; // 100 points = $1 discount
  couponCode: string | null;
  discountAmount: number;
  shippingOption: 'standard' | 'express' | 'overnight';
}
