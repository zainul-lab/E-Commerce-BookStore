import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store';
import {
  updateQuantity,
  removeFromCart,
  clearCart,
  setGiftPointsToRedeem,
  applyCoupon,
  removeCoupon,
} from '../store/slices/cartSlice';
import { addToast, setAuthModalOpen } from '../store/slices/uiSlice';
import { RecommendationSection } from '../components/home/RecommendationSection';
import { getTentativeDeliveryDate } from '../utils/deliveryCalculator';
import {
  ShoppingCart,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  Gift,
  Tag,
  BookOpen,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { items, giftPointsToRedeem, couponCode, couponDiscountPercentage, shippingOption } =
    useAppSelector((state) => state.cart);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [inputCoupon, setInputCoupon] = useState('');
  const [pointsInput, setPointsInput] = useState(giftPointsToRedeem);

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + item.book.price * item.quantity, 0);
  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const pointsDiscount = (giftPointsToRedeem / 100); // 100 pts = $1
  const promoDiscount = (subtotal * couponDiscountPercentage) / 100;

  const shippingCost =
    shippingOption === 'standard' ? 0 : shippingOption === 'express' ? 4.99 : 9.99;

  const taxableAmount = Math.max(0, subtotal - pointsDiscount - promoDiscount);
  const estimatedTax = taxableAmount * 0.08; // 8% tax
  const total = taxableAmount + estimatedTax + shippingCost;

  const freeShippingThreshold = 35;
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = inputCoupon.trim().toUpperCase();
    if (code === 'WELCOME10') {
      dispatch(applyCoupon({ code: 'WELCOME10', discountPercentage: 10 }));
      dispatch(addToast({ type: 'success', message: 'Promo code WELCOME10 applied! 10% discount added.' }));
      setInputCoupon('');
    } else if (code === 'BOOKWORM') {
      dispatch(applyCoupon({ code: 'BOOKWORM', discountPercentage: 15 }));
      dispatch(addToast({ type: 'success', message: 'Promo code BOOKWORM applied! 15% discount added.' }));
      setInputCoupon('');
    } else {
      dispatch(addToast({ type: 'error', message: 'Invalid coupon code. Try WELCOME10 or BOOKWORM' }));
    }
  };

  const handleApplyPoints = () => {
    const maxPointsAllowed = user ? Math.min(user.rewardPoints, Math.floor(subtotal * 100)) : 0;
    const pointsToUse = Math.min(pointsInput, maxPointsAllowed);
    dispatch(setGiftPointsToRedeem(pointsToUse));
    dispatch(
      addToast({
        type: 'success',
        message: `Applied ${pointsToUse} points ($${(pointsToUse / 100).toFixed(2)}) discount!`,
      })
    );
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-10 border border-gray-200 shadow-sm space-y-5">
          <div className="w-20 h-20 rounded-3xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto shadow-inner">
            <ShoppingCart className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Your Basket is Empty</h2>
          <p className="text-xs text-gray-500">
            Looks like you haven't added any books to your shopping cart yet. Browse our top selections!
          </p>
          <Link
            to="/catalogue"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition"
          >
            <BookOpen className="w-4 h-4" />
            <span>Explore Book Catalogue</span>
          </Link>
        </div>

        {/* Personalized recommendations even on empty cart */}
        <div className="mt-16 text-left">
          <RecommendationSection />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Title */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Shopping Basket ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})
          </h1>
          <p className="text-xs text-gray-500 mt-1">Review your selections, apply reward points, and checkout.</p>
        </div>
        <button
          onClick={() => dispatch(clearCart())}
          className="text-xs text-rose-600 hover:text-rose-700 font-semibold self-start sm:self-auto flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Basket</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Free Shipping Progress Bar */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="flex items-center gap-1.5 text-gray-700">
                <Truck className="w-4 h-4 text-emerald-600" />
                {subtotal >= freeShippingThreshold
                  ? '🎉 You unlocked Free Tentative 2-Day Delivery!'
                  : `Add $${(freeShippingThreshold - subtotal).toFixed(2)} more for Free Tentative 2-Day Shipping`}
              </span>
              <span className="text-emerald-600 font-bold">{freeShippingProgress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item Cards */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm divide-y divide-gray-100">
            {items.map((item) => {
              const delivery = getTentativeDeliveryDate(item.book.tentativeDeliveryDays);
              return (
                <div key={`${item.book.id}-${item.selectedFormat}`} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                  
                  {/* Thumbnail & Info */}
                  <div className="flex gap-4 items-start sm:items-center flex-1">
                    <Link to={`/product/${item.book.id}`} className="shrink-0">
                      <img
                        src={item.book.coverImage}
                        alt={item.book.title}
                        className="w-20 h-28 object-cover rounded-lg shadow"
                      />
                    </Link>

                    <div className="space-y-1 min-w-0">
                      <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider block">
                        {item.book.publisher} • {item.selectedFormat}
                      </span>
                      <Link
                        to={`/product/${item.book.id}`}
                        className="text-sm font-bold text-gray-900 hover:text-brand-600 transition line-clamp-2 leading-snug"
                      >
                        {item.book.title}
                      </Link>
                      <p className="text-xs text-gray-500">by {item.book.author}</p>
                      
                      <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium pt-1">
                        <Truck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{delivery.dateString}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Price */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white">
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              bookId: item.book.id,
                              format: item.selectedFormat,
                              quantity: item.quantity - 1,
                            })
                          )
                        }
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 font-bold"
                      >
                        -
                      </button>
                      <span className="px-3 py-1.5 text-xs font-bold text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              bookId: item.book.id,
                              format: item.selectedFormat,
                              quantity: item.quantity + 1,
                            })
                          )
                        }
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 font-bold"
                      >
                        +
                      </button>
                    </div>

                    {/* Line total price */}
                    <div className="text-right min-w-[70px]">
                      <span className="text-base font-extrabold text-gray-900 block">
                        ${(item.book.price * item.quantity).toFixed(2)}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        ${item.book.price.toFixed(2)} each
                      </span>
                    </div>

                    {/* Delete item */}
                    <button
                      onClick={() =>
                        dispatch(
                          removeFromCart({
                            bookId: item.book.id,
                            format: item.selectedFormat,
                          })
                        )
                      }
                      className="text-gray-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition"
                      title="Remove from Cart"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* Right Column: Order Summary & Rewards */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Summary Box */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-5">
            <h3 className="font-bold text-gray-900 text-base pb-3 border-b border-gray-100">
              Order Summary
            </h3>

            {/* Line items */}
            <div className="space-y-2.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal ({totalItemsCount} items)</span>
                <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
              </div>

              {pointsDiscount > 0 && (
                <div className="flex justify-between text-purple-700 font-medium">
                  <span className="flex items-center gap-1">
                    <Gift className="w-3.5 h-3.5" /> Gift Points Redeemed
                  </span>
                  <span>-${pointsDiscount.toFixed(2)}</span>
                </div>
              )}

              {promoDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" /> Coupon ({couponCode})
                  </span>
                  <span>-${promoDiscount.toFixed(2)}</span>
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
                <span className="text-sm font-bold text-gray-900">Total Amount</span>
                <span className="text-2xl font-black text-gray-900">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Redeem Gift Points Widget (Slide 5, 8, 12) */}
            {user && (
              <div className="bg-purple-50/70 rounded-2xl p-4 border border-purple-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-950 flex items-center gap-1">
                    <Gift className="w-3.5 h-3.5 text-purple-600" /> Redeem Reward Points
                  </span>
                  <span className="text-xs font-bold text-purple-700">
                    {user.rewardPoints} available
                  </span>
                </div>
                
                <p className="text-[11px] text-purple-800">
                  100 points = $1.00 instant discount on this order.
                </p>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max={user.rewardPoints}
                    step="100"
                    value={pointsInput}
                    onChange={(e) => setPointsInput(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded-xl border border-purple-300 focus:outline-none focus:border-purple-600 bg-white"
                    placeholder="Points to use"
                  />
                  <button
                    onClick={handleApplyPoints}
                    className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs py-2 px-3.5 rounded-xl transition shrink-0"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}

            {/* Promo Code Input */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="text-xs font-bold text-gray-700 block">Promo or Gift Code</label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="e.g. WELCOME10"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-600 uppercase font-semibold"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition"
                >
                  Apply
                </button>
              </div>
              {couponCode && (
                <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold pt-1">
                  <span>Active Coupon: {couponCode}</span>
                  <button
                    type="button"
                    onClick={() => dispatch(removeCoupon())}
                    className="text-rose-600 hover:underline text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              )}
            </form>

            {/* Proceed to Checkout CTA */}
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  dispatch(setAuthModalOpen({ isOpen: true, mode: 'login' }));
                  dispatch(addToast({ type: 'info', message: 'Please sign in to continue to checkout.' }));
                } else {
                  navigate('/checkout');
                }
              }}
              className="w-full bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-brand-600/30 transition flex items-center justify-center gap-2 text-sm"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Security Guarantee Pill */}
            <div className="pt-2 flex items-center justify-center gap-2 text-xs text-gray-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>256-Bit SSL Encrypted & Protected Checkout</span>
            </div>

          </div>

        </div>

      </div>

      {/* Cross-Sell Recommendations (Slide 5, 8, 11) */}
      <div className="mt-14">
        <RecommendationSection />
      </div>

    </div>
  );
};
