import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store';
import { clearCart } from '../store/slices/cartSlice';
import { deductPoints, awardPoints } from '../store/slices/authSlice';
import { addOrder } from '../store/slices/ordersSlice';
import { addToast, setAuthModalOpen } from '../store/slices/uiSlice';
import { getTentativeDeliveryDate } from '../utils/deliveryCalculator';
import { PaymentMethod, Order } from '../types/order';
import {
  CreditCard,
  QrCode,
  Building2,
  Banknote,
  Gift,
  ShieldCheck,
  Lock,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

export const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { items, giftPointsToRedeem, couponDiscountPercentage, shippingOption } =
    useAppSelector((state) => state.cart);
  const { user, isAuthenticated, selectedDeliveryAddressId } = useAppSelector((state) => state.auth);

  // Redirect unauthenticated users back to cart
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(setAuthModalOpen({ isOpen: true, mode: 'login' }));
      dispatch(addToast({ type: 'info', message: 'Please sign in to continue to payment.' }));
      navigate('/cart');
    }
  }, [isAuthenticated, dispatch, navigate]);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const savedAddresses = user?.savedAddresses || [];
  const selectedAddress =
    savedAddresses.find((a) => a.id === selectedDeliveryAddressId) || savedAddresses[0];

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + item.book.price * item.quantity, 0);
  const pointsDiscount = giftPointsToRedeem / 100;
  const promoDiscount = (subtotal * couponDiscountPercentage) / 100;
  const shippingCost =
    shippingOption === 'standard' ? 0 : shippingOption === 'express' ? 4.99 : 9.99;
  const taxableAmount = Math.max(0, subtotal - pointsDiscount - promoDiscount);
  const estimatedTax = taxableAmount * 0.08;
  const total = taxableAmount + estimatedTax + shippingCost;

  const totalPointsToEarn = items.reduce(
    (acc, item) => acc + item.book.giftPoints * item.quantity,
    0
  );

  // Payment Form States
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('credit_card');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [cardHolder, setCardHolder] = useState(user?.name || 'Sophia Montgomery');
  const [expiryDate, setExpiryDate] = useState('08/28');
  const [cvv, setCvv] = useState('742');
  const [upiId, setUpiId] = useState('sophia@okaxis');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const deliveryDays = shippingOption === 'overnight' ? 1 : shippingOption === 'express' ? 2 : 4;
    const tentativeDate = getTentativeDeliveryDate(deliveryDays);

    const now = new Date();
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: Order = {
      id: orderId,
      orderNumber: `EB-${orderId.split('-')[1]}`,
      createdAt: now.toISOString(),
      items: [...items],
      shippingAddress: selectedAddress || {
        id: 'addr-default',
        fullName: user?.name || 'Customer',
        phone: '+1 555-0199',
        street: '742 Evergreen Terrace',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62704',
        country: 'United States',
        isDefault: true,
        type: 'home',
      },
      shippingOption,
      shippingCost,
      subtotal,
      tax: estimatedTax,
      giftPointsDiscount: pointsDiscount,
      promoDiscount,
      totalAmount: total,
      paymentMethod: selectedMethod,
      paymentStatus: 'Paid',
      orderStatus: 'Placed',
      tentativeDeliveryDate: tentativeDate.formattedDay,
      canCancelUntil: new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString(),
      trackingNumber: `TRK-${Math.floor(100000000 + Math.random() * 900000000)}US`,
    };

    setTimeout(() => {
      // 1. Deduct redeemed points
      if (giftPointsToRedeem > 0) {
        dispatch(deductPoints(giftPointsToRedeem));
      }
      // 2. Award new gift points earned from purchased books
      dispatch(awardPoints(totalPointsToEarn));
      // 3. Add order to store
      dispatch(addOrder(newOrder));
      // 4. Clear shopping cart
      dispatch(clearCart());
      setIsProcessing(false);

      dispatch(
        addToast({
          type: 'success',
          message: 'Payment Authorized & Order Placed Successfully!',
          subMessage: `Order #${newOrder.orderNumber} confirmed.`,
        })
      );

      navigate(`/order-confirmation/${newOrder.id}`);
    }, 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Checkout Progress Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4 sm:space-x-8 text-xs font-bold">
          <div className="flex items-center gap-2 text-emerald-600">
            <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">✓</span>
            <span>Shopping Basket</span>
          </div>
          <span className="h-0.5 w-8 bg-emerald-600" />
          <div className="flex items-center gap-2 text-emerald-600">
            <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">✓</span>
            <span>Delivery & Options</span>
          </div>
          <span className="h-0.5 w-8 bg-brand-600" />
          <div className="flex items-center gap-2 text-brand-600">
            <span className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center">3</span>
            <span>Payment & Confirmation</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Select Payment Option (Slide 5, 8, 12, 13) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-brand-50 text-brand-600">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Choose Payment Method</h2>
                  <p className="text-xs text-gray-500">All transactions are encrypted and secured</p>
                </div>
              </div>

              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit SSL
              </span>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'credit_card', label: 'Credit / Debit', icon: CreditCard },
                { id: 'upi', label: 'UPI / QR Code', icon: QrCode },
                { id: 'net_banking', label: 'Net Banking', icon: Building2 },
                { id: 'cash_on_delivery', label: 'Cash on Delivery', icon: Banknote },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = selectedMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMethod(m.id as PaymentMethod)}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center text-center gap-2 transition ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50/50 text-brand-700 font-bold shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-brand-600' : 'text-gray-400'}`} />
                    <span className="text-xs">{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Form based on selected method */}
            <form onSubmit={handlePaymentSubmit} className="space-y-4 pt-4">
              
              {/* Credit / Debit Card Form */}
              {selectedMethod === 'credit_card' && (
                <div className="space-y-4 bg-gray-50/70 p-5 rounded-2xl border border-gray-200">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="•••• •••• •••• ••••"
                        className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-600 bg-white font-mono"
                      />
                      <CreditCard className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Name on card"
                      className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-600 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Expires (MM/YY)</label>
                      <input
                        type="text"
                        required
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-600 bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-600 bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* UPI Form */}
              {selectedMethod === 'upi' && (
                <div className="space-y-4 bg-gray-50/70 p-5 rounded-2xl border border-gray-200">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Enter UPI ID (VPA)</label>
                    <input
                      type="text"
                      required
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@okhdfcbank"
                      className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-600 bg-white font-mono"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    A payment authorization request will be sent to your Google Pay, PhonePe, or Paytm app.
                  </p>
                </div>
              )}

              {/* Net Banking Form */}
              {selectedMethod === 'net_banking' && (
                <div className="space-y-4 bg-gray-50/70 p-5 rounded-2xl border border-gray-200">
                  <label className="text-xs font-bold text-gray-700 block mb-1">Select Bank</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    aria-label="Select Bank"
                    className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-600 bg-white font-semibold"
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="State Bank of India">State Bank of India</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Chase & Wells Fargo">Chase & Wells Fargo</option>
                    <option value="Citibank">Citibank</option>
                  </select>
                </div>
              )}

              {/* Cash on Delivery Form */}
              {selectedMethod === 'cash_on_delivery' && (
                <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 space-y-2">
                  <h4 className="text-xs font-bold text-amber-900">Cash on Delivery Information</h4>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    You can pay in cash or via QR code directly to the courier partner upon delivery. Please ensure exact cash is available.
                  </p>
                </div>
              )}

              {/* Reward Points Earned Banner */}
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex items-center justify-between text-xs text-purple-900">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Gift className="w-4 h-4 text-purple-600" /> Points Earned on this Order:
                </span>
                <span className="font-extrabold text-purple-700">+{totalPointsToEarn} pts</span>
              </div>

              {/* Submit / Pay CTA Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-brand-600 hover:bg-brand-700 active:bg-brand-800 disabled:bg-gray-400 text-white font-bold py-4 rounded-2xl shadow-xl shadow-brand-600/30 transition flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Authorizing Payment of ${total.toFixed(2)}...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Complete Payment • ${total.toFixed(2)}</span>
                  </>
                )}
              </button>

            </form>

          </div>
        </div>

        {/* Right Summary Column */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 text-base pb-3 border-b border-gray-100">
              Review Final Order
            </h3>

            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Items ({items.length})</span>
                <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
              </div>

              {pointsDiscount > 0 && (
                <div className="flex justify-between text-purple-700 font-medium">
                  <span>Gift Points Redeemed</span>
                  <span>-${pointsDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span className="font-semibold text-gray-900">${estimatedTax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Shipping</span>
                <span className="font-semibold text-emerald-600">
                  {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-gray-900">Total Payable</span>
                <span className="text-2xl font-black text-gray-900">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Delivery address snippet */}
            {selectedAddress && (
              <div className="pt-3 border-t border-gray-100 text-xs">
                <span className="text-gray-400 font-medium block">Shipping To:</span>
                <span className="font-bold text-gray-800">{selectedAddress.fullName}</span>
                <p className="text-gray-500 leading-tight">
                  {selectedAddress.street}, {selectedAddress.city} {selectedAddress.zipCode}
                </p>
              </div>
            )}

            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Full 48-hour order cancellation guarantee</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
