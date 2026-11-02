import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '../../types/order';
import { INITIAL_ORDERS } from '../../data/mockOrders';

interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
}

const loadOrdersFromStorage = (): Order[] => {
  try {
    const saved = localStorage.getItem('ebookstore_orders');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading orders from localStorage', e);
  }
  return INITIAL_ORDERS;
};

const initialState: OrdersState = {
  orders: loadOrdersFromStorage(),
  currentOrder: null,
};

const saveOrdersToStorage = (orders: Order[]) => {
  try {
    localStorage.setItem('ebookstore_orders', JSON.stringify(orders));
  } catch (e) {
    console.error('Error saving orders to localStorage', e);
  }
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
      state.currentOrder = action.payload;
      saveOrdersToStorage(state.orders);
    },
    setCurrentOrder: (state, action: PayloadAction<Order | null>) => {
      state.currentOrder = action.payload;
    },
    cancelOrder: (
      state,
      action: PayloadAction<{ orderId: string; reason?: string }>
    ) => {
      const { orderId, reason } = action.payload;
      const order = state.orders.find((o) => o.id === orderId);
      if (order) {
        order.orderStatus = 'Cancelled';
        order.cancellationReason = reason || 'Cancelled by customer within 48h';
        order.paymentStatus = 'Refunded';
        if (state.currentOrder?.id === orderId) {
          state.currentOrder.orderStatus = 'Cancelled';
          state.currentOrder.cancellationReason = order.cancellationReason;
          state.currentOrder.paymentStatus = 'Refunded';
        }
        saveOrdersToStorage(state.orders);
      }
    },
  },
});

export const { addOrder, setCurrentOrder, cancelOrder } = ordersSlice.actions;

export default ordersSlice.reducer;
