import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store';
import { addToCart } from '../store/slices/cartSlice';
import { cancelOrder } from '../store/slices/ordersSlice';
import { addToast } from '../store/slices/uiSlice';
import { isWithin48Hours } from '../utils/deliveryCalculator';
import { Book } from '../types/book';
import {
  Package,
  RefreshCw,
  Truck,
  Clock,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  FileText,
} from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.orders);

  const [selectedOrderForCancel, setSelectedOrderForCancel] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('Change of mind / Ordered by mistake');

  const handleBuyAgain = (book: Book) => {
    dispatch(addToCart({ book, quantity: 1, format: book.format }));
    dispatch(
      addToast({
        type: 'success',
        message: `Added "${book.title.slice(0, 25)}..." to your basket!`,
        subMessage: 'Instant re-order from order history.',
      })
    );
  };

  const handleConfirmCancel = () => {
    if (!selectedOrderForCancel) return;
    dispatch(
      cancelOrder({
        orderId: selectedOrderForCancel,
        reason: cancelReason,
      })
    );
    dispatch(
      addToast({
        type: 'info',
        message: 'Order Cancelled',
        subMessage: 'Full refund initiated to original payment method.',
      })
    );
    setSelectedOrderForCancel(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Your Orders & History</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Track packages, initiate instant 1-click reorders, or manage 48-hour order cancellations.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">No Past Orders Found</h2>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            You haven't placed any orders yet. Start exploring our collection of books and AI titles!
          </p>
          <Link
            to="/catalogue"
            className="inline-flex items-center gap-2 bg-brand-600 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-md transition"
          >
            <BookOpen className="w-4 h-4" />
            <span>Browse Book Catalogue</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const cancellationStatus = isWithin48Hours(order.createdAt);
            const isCancelled = order.orderStatus === 'Cancelled';
            const isDelivered = order.orderStatus === 'Delivered';

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden"
              >
                {/* Order Top Bar Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex flex-wrap items-center gap-6">
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Order Placed</span>
                      <span className="font-semibold text-gray-800">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Total Amount</span>
                      <span className="font-extrabold text-gray-900">${order.totalAmount.toFixed(2)}</span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Ship To</span>
                      <span className="font-semibold text-gray-800 truncate max-w-[140px] block">
                        {order.shippingAddress.fullName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 font-mono">#{order.orderNumber}</span>
                    <Link
                      to={`/order-confirmation/${order.id}`}
                      className="text-brand-600 hover:text-brand-700 font-bold flex items-center gap-1 hover:underline"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Invoice</span>
                    </Link>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-6 space-y-6">
                  
                  {/* Status Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl text-white ${
                        isCancelled
                          ? 'bg-rose-600'
                          : isDelivered
                          ? 'bg-emerald-600'
                          : 'bg-brand-600'
                      }`}>
                        {isCancelled ? (
                          <XCircle className="w-5 h-5" />
                        ) : isDelivered ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Truck className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">
                          {isCancelled
                            ? 'Order Cancelled'
                            : isDelivered
                            ? `Delivered on ${order.tentativeDeliveryDate}`
                            : `Estimated Tentative Delivery: ${order.tentativeDeliveryDate}`}
                        </h3>
                        <p className="text-xs text-gray-500">
                          Tracking ID: <span className="font-mono text-gray-700">{order.trackingNumber}</span>
                        </p>
                      </div>
                    </div>

                    {/* 48-Hour Cancel Button if eligible (Slide 5, 8, 14) */}
                    {!isCancelled && cancellationStatus.canCancel && (
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600" />
                          {cancellationStatus.remainingHours}h {cancellationStatus.remainingMinutes}m left to cancel
                        </span>
                        <button
                          onClick={() => setSelectedOrderForCancel(order.id)}
                          className="bg-white hover:bg-rose-50 text-rose-600 border border-rose-300 font-bold text-xs py-1.5 px-3 rounded-lg transition"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Items List with "Buy It Again" (Slide 5, 8, 10) */}
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div
                        key={item.book.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 rounded-2xl bg-gray-50/60 border border-gray-100"
                      >
                        <div className="flex items-center gap-4">
                          <Link to={`/product/${item.book.id}`}>
                            <img
                              src={item.book.coverImage}
                              alt={item.book.title}
                              className="w-14 h-20 object-cover rounded-md shadow"
                            />
                          </Link>
                          <div>
                            <span className="text-[10px] font-bold text-brand-600 uppercase">
                              {item.book.publisher} • {item.selectedFormat}
                            </span>
                            <Link
                              to={`/product/${item.book.id}`}
                              className="text-xs sm:text-sm font-bold text-gray-900 hover:text-brand-600 line-clamp-1 transition"
                            >
                              {item.book.title}
                            </Link>
                            <p className="text-xs text-gray-500">by {item.book.author}</p>
                            <span className="text-xs font-semibold text-gray-800 mt-0.5 block">
                              ${item.book.price.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Buy It Again Action Button */}
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          <button
                            onClick={() => handleBuyAgain(item.book)}
                            className="bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs py-2 px-3.5 rounded-xl transition flex items-center gap-1.5 shadow-sm"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Buy It Again</span>
                          </button>
                          <Link
                            to={`/product/${item.book.id}`}
                            className="text-xs font-semibold text-gray-600 hover:text-brand-600 p-2 rounded-lg hover:bg-gray-100 transition"
                          >
                            View Item
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Order Modal */}
      {selectedOrderForCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900">Confirm Order Cancellation</h3>
              <p className="text-xs text-gray-500 mt-1">
                You are cancelling within 48 hours of purchase. You will receive an immediate 100% refund.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 block">Reason for Cancellation</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                aria-label="Reason for Cancellation"
                className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-600 bg-white"
              >
                <option value="Change of mind / Ordered by mistake">Change of mind / Ordered by mistake</option>
                <option value="Found a better price elsewhere">Found a better price elsewhere</option>
                <option value="Need to change delivery address">Need to change delivery address</option>
                <option value="Delivery date is too late">Delivery date is too late</option>
                <option value="Other reason">Other reason</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedOrderForCancel(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2 px-5 rounded-xl shadow-md transition"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
