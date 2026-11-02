import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store';
import {
  setSelectedDeliveryAddressId,
  addAddress,
} from '../store/slices/authSlice';
import { setShippingOption } from '../store/slices/cartSlice';
import { addToast, setAuthModalOpen } from '../store/slices/uiSlice';
import { getTentativeDeliveryDate } from '../utils/deliveryCalculator';
import {
  MapPin,
  Plus,
  CheckCircle2,
  Truck,
  ShieldCheck,
  ArrowRight,
  Building,
  Home,
  X,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { items, giftPointsToRedeem, couponDiscountPercentage, shippingOption } =
    useAppSelector((state) => state.cart);
  const { user, isAuthenticated, selectedDeliveryAddressId } = useAppSelector((state) => state.auth);

  // Redirect unauthenticated users back to cart
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(setAuthModalOpen({ isOpen: true, mode: 'login' }));
      dispatch(addToast({ type: 'info', message: 'Please sign in to continue to checkout.' }));
      navigate('/cart');
    }
  }, [isAuthenticated, dispatch, navigate]);

  // New Address Modal state
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('IL');
  const [zipCode, setZipCode] = useState('');
  const [addressType, setAddressType] = useState<'home' | 'work' | 'other'>('home');

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

  const standardDelivery = getTentativeDeliveryDate(4);
  const expressDelivery = getTentativeDeliveryDate(2);
  const overnightDelivery = getTentativeDeliveryDate(1);

  const handleAddNewAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !street || !city || !zipCode) {
      dispatch(addToast({ type: 'error', message: 'Please complete all required address fields.' }));
      return;
    }

    dispatch(
      addAddress({
        fullName,
        phone,
        street,
        apartment,
        city,
        state: stateVal || 'IL',
        zipCode,
        country: 'United States',
        isDefault: savedAddresses.length === 0,
        type: addressType,
      })
    );

    dispatch(
      addToast({
        type: 'success',
        message: 'Delivery address saved!',
        subMessage: `${city}, ${zipCode} selected for delivery.`,
      })
    );

    setIsAddAddressOpen(false);
    // Reset form
    setFullName('');
    setPhone('');
    setStreet('');
    setApartment('');
    setCity('');
    setZipCode('');
  };

  const handleProceedToPayment = () => {
    if (!selectedAddress && savedAddresses.length === 0) {
      dispatch(
        addToast({
          type: 'error',
          message: 'Please provide a delivery address before proceeding.',
        })
      );
      setIsAddAddressOpen(true);
      return;
    }
    navigate('/payment');
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
          <span className="h-0.5 w-8 bg-brand-600" />
          <div className="flex items-center gap-2 text-brand-600">
            <span className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center">2</span>
            <span>Delivery & Options</span>
          </div>
          <span className="h-0.5 w-8 bg-gray-200" />
          <div className="flex items-center gap-2 text-gray-400">
            <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">3</span>
            <span>Payment & Confirmation</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Delivery Address & Shipping Method */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. Delivery Address Selection (Slide 5, 8, 12: "Select the address for delivery") */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-brand-50 text-brand-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">1. Select Delivery Address</h2>
                  <p className="text-xs text-gray-500">Choose where you'd like your books delivered</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAddAddressOpen(true)}
                className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1.5 p-2 rounded-xl hover:bg-brand-50 transition border border-brand-200"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Address</span>
              </button>
            </div>

            {/* Address Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedAddresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => dispatch(setSelectedDeliveryAddressId(addr.id))}
                  className={`p-5 rounded-2xl border-2 transition cursor-pointer relative flex flex-col justify-between ${
                    (selectedDeliveryAddressId === addr.id || (!selectedDeliveryAddressId && addr.isDefault))
                      ? 'border-brand-600 bg-brand-50/40 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                        {addr.type === 'home' ? <Home className="w-3.5 h-3.5 text-brand-600" /> : <Building className="w-3.5 h-3.5 text-indigo-600" />}
                        {addr.fullName}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold text-brand-700 bg-brand-100 px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed">
                      {addr.street} {addr.apartment && `, ${addr.apartment}`}<br />
                      {addr.city}, {addr.state} {addr.zipCode}<br />
                      {addr.country}
                    </p>
                    <p className="text-xs text-gray-500 mt-2 font-medium">📞 {addr.phone}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-brand-700 flex items-center gap-1">
                      {(selectedDeliveryAddressId === addr.id || (!selectedDeliveryAddressId && addr.isDefault)) && (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-brand-600" /> Selected for Delivery
                        </>
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Tentative Shipping Speed Option */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">2. Choose Delivery Speed</h2>
                <p className="text-xs text-gray-500">Real-time tentative delivery dates dynamically calculated</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'standard',
                  name: 'Standard Ground Delivery',
                  info: standardDelivery.dateString,
                  cost: 'FREE',
                  desc: 'Delivered safely via USPS / UPS Ground',
                },
                {
                  id: 'express',
                  name: 'Tentative Express 2-Day Delivery',
                  info: expressDelivery.dateString,
                  cost: '$4.99',
                  desc: 'Guaranteed 2-day delivery with live courier tracking',
                  recommended: true,
                },
                {
                  id: 'overnight',
                  name: 'Priority Next-Day Air Delivery',
                  info: overnightDelivery.dateString,
                  cost: '$9.99',
                  desc: 'Fastest delivery option for urgent orders',
                },
              ].map((opt) => (
                <label
                  key={opt.id}
                  onClick={() => dispatch(setShippingOption(opt.id as any))}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 transition cursor-pointer ${
                    shippingOption === opt.id
                      ? 'border-brand-600 bg-brand-50/40 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <input
                      type="radio"
                      name="shippingSpeed"
                      checked={shippingOption === opt.id}
                      onChange={() => dispatch(setShippingOption(opt.id as any))}
                      className="accent-brand-600 w-4 h-4"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-gray-900">{opt.name}</span>
                        {opt.recommended && (
                          <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-emerald-700 font-semibold mt-0.5">{opt.info}</p>
                      <p className="text-[11px] text-gray-400">{opt.desc}</p>
                    </div>
                  </div>

                  <span className="text-sm font-extrabold text-gray-900">{opt.cost}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 3. Items In This Delivery summary */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">
              3. Items in This Shipment ({items.length})
            </h3>
            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <div key={item.book.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.book.coverImage}
                      alt={item.book.title}
                      className="w-10 h-14 object-cover rounded shadow-sm"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{item.book.title}</h4>
                      <p className="text-[11px] text-gray-500">
                        Qty: {item.quantity} • {item.selectedFormat}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-gray-900">
                    ${(item.book.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Order Payment Summary */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-5">
            <h3 className="font-bold text-gray-900 text-base pb-3 border-b border-gray-100">
              Payment Summary
            </h3>

            <div className="space-y-2.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
              </div>

              {pointsDiscount > 0 && (
                <div className="flex justify-between text-purple-700 font-medium">
                  <span>Gift Points Discount</span>
                  <span>-${pointsDiscount.toFixed(2)}</span>
                </div>
              )}

              {promoDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Promo Code Savings</span>
                  <span>-${promoDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping & Handling</span>
                <span className="font-semibold text-gray-900">
                  {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span className="font-semibold text-gray-900">${estimatedTax.toFixed(2)}</span>
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-gray-900">Total Payable</span>
                <span className="text-2xl font-black text-gray-900">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Selected Delivery Address Highlight */}
            {selectedAddress && (
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-1">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                  Delivering to
                </span>
                <p className="text-xs font-bold text-gray-900">{selectedAddress.fullName}</p>
                <p className="text-xs text-gray-600 leading-tight">
                  {selectedAddress.street}, {selectedAddress.city} {selectedAddress.zipCode}
                </p>
              </div>
            )}

            {/* Proceed to Payment CTA */}
            <button
              onClick={handleProceedToPayment}
              className="w-full bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-brand-600/30 transition flex items-center justify-center gap-2 text-sm"
            >
              <span>Continue to Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 flex items-center justify-center gap-2 text-xs text-gray-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Full 48h Cancellation Guarantee Included</span>
            </div>
          </div>
        </div>

      </div>

      {/* Add New Address Modal */}
      {isAddAddressOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setIsAddAddressOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-2 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-4">Add Delivery Address</h3>

            <form onSubmit={handleAddNewAddressSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Recipient name"
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Street name and house number"
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-600"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Apt / Suite</label>
                  <input
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    placeholder="Apt 4B"
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Springfield"
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Zip Code *</label>
                  <input
                    type="text"
                    required
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="62704"
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Address Label</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['home', 'work', 'other'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setAddressType(type)}
                      className={`py-2 text-xs font-bold rounded-xl border capitalize transition ${
                        addressType === type
                          ? 'border-brand-600 bg-brand-50 text-brand-700'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddAddressOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-2 px-5 rounded-xl transition"
                >
                  Save & Use Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
