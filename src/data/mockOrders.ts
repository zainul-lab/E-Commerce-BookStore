import { Order } from '../types/order';
import { MOCK_BOOKS } from './mockBooks';
import { INITIAL_USER } from './mockUser';

const now = new Date();
const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000);
const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-882194',
    orderNumber: 'EB-882194',
    createdAt: fourHoursAgo.toISOString(),
    items: [
      {
        book: MOCK_BOOKS[1], // Generative AI with LLMs
        quantity: 1,
        selectedFormat: 'Paperback',
      },
      {
        book: MOCK_BOOKS[2], // Atomic Habits
        quantity: 1,
        selectedFormat: 'Hardcover',
      },
    ],
    shippingAddress: INITIAL_USER.savedAddresses[0],
    shippingOption: 'express',
    shippingCost: 4.99,
    subtotal: 66.49,
    tax: 5.32,
    giftPointsDiscount: 5.00,
    promoDiscount: 0,
    totalAmount: 66.81,
    paymentMethod: 'credit_card',
    paymentStatus: 'Paid',
    orderStatus: 'Processing',
    tentativeDeliveryDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }),
    canCancelUntil: new Date(fourHoursAgo.getTime() + 48 * 60 * 60 * 1000).toISOString(),
    trackingNumber: 'TRK-984210928US',
  },
  {
    id: 'ORD-764312',
    orderNumber: 'EB-764312',
    createdAt: tenDaysAgo.toISOString(),
    items: [
      {
        book: MOCK_BOOKS[0], // Designing Data-Intensive Applications
        quantity: 1,
        selectedFormat: 'Paperback',
      },
      {
        book: MOCK_BOOKS[4], // The Psychology of Money
        quantity: 1,
        selectedFormat: 'Paperback',
      },
    ],
    shippingAddress: INITIAL_USER.savedAddresses[0],
    shippingOption: 'standard',
    shippingCost: 0,
    subtotal: 61.24,
    tax: 4.90,
    giftPointsDiscount: 0,
    promoDiscount: 5.00,
    totalAmount: 61.14,
    paymentMethod: 'credit_card',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    tentativeDeliveryDate: new Date(tenDaysAgo.getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }),
    canCancelUntil: new Date(tenDaysAgo.getTime() + 48 * 60 * 60 * 1000).toISOString(),
    trackingNumber: 'TRK-109283741US',
  },
];
