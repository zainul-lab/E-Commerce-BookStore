import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store';
import { cancelOrder } from '../store/slices/ordersSlice';
import { addToast } from '../store/slices/uiSlice';
import { isWithin48Hours } from '../utils/deliveryCalculator';
import {
  CheckCircle2,
  Truck,
  Clock,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Package,
  Printer,
} from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const dispatch = useAppDispatch();

  const orders = useAppSelector((state) => state.orders.orders);
  const order = orders.find((o) => o.id === orderId) || orders[0];

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('Found a better price / Ordered by mistake');
  const [timeRemaining, setTimeRemaining] = useState(() => isWithin48Hours(order.createdAt));

  // Live timer tick every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(isWithin48Hours(order.createdAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [order.createdAt]);

  const handleCancelOrder = () => {
    dispatch(
      cancelOrder({
        orderId: order.id,
        reason: cancellationReason,
      })
    );
    dispatch(
      addToast({
        type: 'info',
        message: `Order #${order.orderNumber} Cancelled Successfully`,
        subMessage: 'A full refund has been initiated to your original payment method.',
      })
    );
    setIsCancelModalOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const isCancelled = order.orderStatus === 'Cancelled';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Success Banner */}
      <div className={`rounded-3xl p-6 sm:p-10 border shadow-sm text-center relative overflow-hidden ${
        isCancelled
          ? 'bg-rose-50/70 border-rose-200'
          : 'bg-emerald-50/70 border-emerald-200'
      }`}>
        <div className={`w-16 h-16 rounded-3xl mx-auto flex items-center justify-center shadow-md mb-4 ${
          isCancelled
            ? 'bg-rose-600 text-white'
            : 'bg-emerald-600 text-white'
        }`}>
          {isCancelled ? <XCircle className="w-8 h-8" /> : <CheckCircle2 className="w-8 h-8" />}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          {isCancelled ? 'Order Has Been Cancelled' : 'Thank You! Your Purchase is Confirmed'}
        </h1>
        
        <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-lg mx-auto">
          {isCancelled
            ? `Order #${order.orderNumber} was cancelled. Refund of $${order.totalAmount.toFixed(2)} is being processed.`
            : `We've sent an order confirmation and delivery tracking receipt to your registered email address.`}
        </p>

        {/* Order # and Tracking Number pills */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold">
          <span className="bg-white px-3.5 py-1.5 rounded-xl border border-gray-200 text-gray-800 shadow-sm">
            Order Number: <strong className="text-brand-600 font-mono">{order.orderNumber}</strong>
          </span>
          <span className="bg-white px-3.5 py-1.5 rounded-xl border border-gray-200 text-gray-800 shadow-sm">
            Live Tracking: <strong className="text-emerald-700 font-mono">{order.trackingNumber}</strong>
          </span>
          <span className={`px-3.5 py-1.5 rounded-xl border shadow-sm font-bold ${
            isCancelled
              ? 'bg-rose-100 text-rose-800 border-rose-300'
              : 'bg-emerald-100 text-emerald-800 border-emerald-300'
          }`}>
            Status: {order.orderStatus}
          </span>
        </div>
      </div>

      {/* 48-Hour Order Cancellation Countdown Banner (Slide 5, 8, 14) */}
      {!isCancelled && timeRemaining.canCancel && (
        <div className="mt-6 bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-500/10 border-2 border-amber-300/80 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold shadow-sm">
              <Clock className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-amber-950">
                  Cancel Order Within 48 Hours Guarantee
                </h3>
                <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full">
                  Policy Active
                </span>
              </div>
              <p className="text-xs text-amber-900/80 mt-0.5 font-medium">
                Time remaining: <strong className="text-amber-950 font-bold font-mono">
                  {timeRemaining.remainingHours}h {timeRemaining.remainingMinutes}m {timeRemaining.remainingSeconds}s
                </strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCancelModalOpen(true)}
            className="bg-white hover:bg-rose-50 text-rose-600 border border-rose-300 hover:border-rose-400 font-bold text-xs py-2 px-4 rounded-xl shadow-sm transition shrink-0 flex items-center gap-1.5"
          >
            <XCircle className="w-4 h-4" />
            <span>Cancel Order</span>
          </button>
        </div>
      )}

      {/* Main Order Details Cards */}
      <div className="mt-6 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-8">
        
        {/* Estimated Tentative Delivery Card */}
        <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-600 text-white">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                Tentative Delivery Date
              </span>
              <p className="text-base font-extrabold text-emerald-950">
                Arrives by {order.tentativeDeliveryDate}
              </p>
              <p className="text-xs text-emerald-700">Shipping via {order.shippingOption.toUpperCase()} Express</p>
            </div>
          </div>

          <Link
            to="/orders"
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 bg-white px-3.5 py-2 rounded-xl border border-emerald-200 shadow-sm transition"
          >
            <span>Track Progress</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Purchased Books List */}
        <div>
          <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-4">
            Purchased Books ({order.items.length})
          </h3>
          <div className="divide-y divide-gray-100">
            {order.items.map((item) => (
              <div key={item.book.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Link to={`/product/${item.book.id}`}>
                    <img
                      src={item.book.coverImage}
                      alt={item.book.title}
                      className="w-14 h-20 object-cover rounded-md shadow"
                    />
                  </Link>
                  <div>
                    <span className="text-[10px] font-semibold text-brand-600 uppercase block">
                      {item.book.publisher} • {item.selectedFormat}
                    </span>
                    <Link
                      to={`/product/${item.book.id}`}
                      className="text-sm font-bold text-gray-900 hover:text-brand-600 transition line-clamp-1"
                    >
                      {item.book.title}
                    </Link>
                    <p className="text-xs text-gray-500">by {item.book.author}</p>
                    <p className="text-xs font-medium text-gray-700 mt-1">
                      Qty: {item.quantity} × ${item.book.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                <span className="text-sm font-extrabold text-gray-900">
                  ${(item.book.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery & Payment Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100 text-xs">
          {/* Shipping Address */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
            <span className="font-bold text-gray-500 uppercase tracking-wider block">
              Shipping Address
            </span>
            <p className="font-bold text-gray-900 text-sm">{order.shippingAddress.fullName}</p>
            <p className="text-gray-600 leading-relaxed">
              {order.shippingAddress.street} {order.shippingAddress.apartment && `, ${order.shippingAddress.apartment}`}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
              {order.shippingAddress.country}
            </p>
            <p className="text-gray-500 pt-1 font-medium">📞 {order.shippingAddress.phone}</p>
          </div>

          {/* Payment & Invoice Breakdown */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
            <span className="font-bold text-gray-500 uppercase tracking-wider block">
              Payment Summary
            </span>
            
            <div className="flex justify-between text-gray-600">
              <span>Payment Method:</span>
              <span className="font-bold text-gray-900 uppercase font-mono">{order.paymentMethod.replace('_', ' ')}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span className="font-semibold text-gray-900">${order.subtotal.toFixed(2)}</span>
            </div>

            {order.giftPointsDiscount > 0 && (
              <div className="flex justify-between text-purple-700 font-medium">
                <span>Gift Points:</span>
                <span>-${order.giftPointsDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-gray-600">
              <span>Tax (8%):</span>
              <span className="font-semibold text-gray-900">${order.tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Shipping:</span>
              <span className="font-semibold text-emerald-600">
                {order.shippingCost === 0 ? 'FREE' : `$${order.shippingCost.toFixed(2)}`}
              </span>
            </div>

            <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-sm text-gray-900">
              <span>Total Paid:</span>
              <span className="text-base font-black">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold py-2.5 px-4 rounded-xl transition shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>
            <Link
              to="/orders"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold py-2.5 px-4 rounded-xl transition border border-indigo-200"
            >
              <Package className="w-4 h-4" />
              <span>Order History</span>
            </Link>
          </div>

          <Link
            to="/catalogue"
            className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-3 px-6 rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      {/* Cancel Order Confirmation Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900">Cancel Order #{order.orderNumber}?</h3>
              <p className="text-xs text-gray-500 mt-1">
                This order was placed within the last 48 hours and is eligible for an instant 100% refund.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 block">Select Reason</label>
              <select
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                aria-label="Select Reason for Cancellation"
                className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-600 bg-white"
              >
                <option value="Found a better price / Ordered by mistake">Found a better price / Ordered by mistake</option>
                <option value="Need to change delivery address">Need to change delivery address</option>
                <option value="Delivery date is too late">Delivery date is too late</option>
                <option value="Added incorrect book format">Added incorrect book format</option>
                <option value="Other reason">Other reason</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleCancelOrder}
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
