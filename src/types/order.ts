import { CartItem } from './cart';
import { Address } from './user';

export type PaymentMethod = 
  | 'credit_card'
  | 'debit_card'
  | 'upi'
  | 'net_banking'
  | 'cash_on_delivery'
  | 'gift_points';

export type OrderStatus = 
  | 'Placed'
  | 'Processing'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string; // ISO date string
  items: CartItem[];
  shippingAddress: Address;
  shippingOption: 'standard' | 'express' | 'overnight';
  shippingCost: number;
  subtotal: number;
  tax: number;
  giftPointsDiscount: number;
  promoDiscount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  orderStatus: OrderStatus;
  tentativeDeliveryDate: string; // ISO date or formatted date
  canCancelUntil: string; // ISO date (createdAt + 48 hours)
  cancellationReason?: string;
  trackingNumber: string;
}
