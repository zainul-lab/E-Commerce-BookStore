import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { setQuickViewBook } from '../../store/slices/productsSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { addToast } from '../../store/slices/uiSlice';
import { RatingStars } from '../common/RatingStars';
import { getTentativeDeliveryDate } from '../../utils/deliveryCalculator';
import {
  X,
  ShoppingCart,
  Truck,
  ShieldCheck,
  Gift,
  ArrowRight,
  BookOpen,
  Check,
} from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const book = useAppSelector((state) => state.products.quickViewBook);

  const [quantity, setQuantity] = useState(1);
  const [selectedFormat, setSelectedFormat] = useState<string>(book?.format || 'Paperback');

  if (!book) return null;

  const deliveryInfo = getTentativeDeliveryDate(book.tentativeDeliveryDays);

  const handleAddToCart = () => {
    dispatch(addToCart({ book, quantity, format: selectedFormat }));
    dispatch(
      addToast({
        type: 'success',
        message: `Added ${quantity}x "${book.title.slice(0, 25)}..." to your basket!`,
      })
    );
    dispatch(setQuickViewBook(null));
  };

  const handleViewFullDetails = () => {
    dispatch(setQuickViewBook(null));
    navigate(`/product/${book.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
        
        {/* Close button */}
        <button
          onClick={() => dispatch(setQuickViewBook(null))}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
          {/* Book Image */}
          <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center justify-center border border-gray-100">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-44 h-64 object-cover rounded-lg shadow-xl"
            />
            <div className="mt-4 flex items-center gap-1.5 text-xs text-purple-700 bg-purple-50 px-3 py-1 rounded-full font-semibold border border-purple-200">
              <Gift className="w-3.5 h-3.5" />
              <span>Earn +{book.giftPoints} Reward Points</span>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">
                {book.publisher} • {book.category}
              </span>
              <h2 className="text-xl font-bold text-gray-900 mt-1 leading-snug">
                {book.title}
              </h2>
              <p className="text-xs text-gray-600 mt-1">
                by <strong className="text-gray-800">{book.author}</strong>
              </p>

              <div className="mt-2.5">
                <RatingStars rating={book.rating} showNumber reviewCount={book.reviewCount} />
              </div>

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black text-gray-900">
                  ${book.price.toFixed(2)}
                </span>
                {book.originalPrice > book.price && (
                  <span className="text-sm text-gray-400 line-through">
                    ${book.originalPrice.toFixed(2)}
                  </span>
                )}
                {book.discountPercentage > 0 && (
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                    {book.discountPercentage}% OFF
                  </span>
                )}
              </div>

              {/* Tentative Delivery Tag */}
              <div className="mt-3 flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 font-medium">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{deliveryInfo.dateString} (Standard Delivery)</span>
              </div>

              {/* Short synopsis */}
              <p className="mt-3 text-xs text-gray-600 line-clamp-3 leading-relaxed">
                {book.description}
              </p>

              {/* Format selection */}
              <div className="mt-4">
                <label className="text-xs font-bold text-gray-700 mb-1.5 block">Format</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['Paperback', 'Hardcover', 'E-Book / Kindle'].map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setSelectedFormat(fmt)}
                      className={`py-1.5 px-3 rounded-lg border text-left font-medium transition flex items-center justify-between ${
                        selectedFormat === fmt
                          ? 'border-brand-600 bg-brand-50 text-brand-700 font-semibold'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <span>{fmt}</span>
                      {selectedFormat === fmt && <Check className="w-3.5 h-3.5 text-brand-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mt-4 flex items-center gap-3">
                <label className="text-xs font-bold text-gray-700">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-gray-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col gap-2">
              <button
                onClick={handleAddToCart}
                className="w-full bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Basket • ${(book.price * quantity).toFixed(2)}</span>
              </button>

              <button
                onClick={handleViewFullDetails}
                className="w-full text-xs font-semibold text-gray-600 hover:text-brand-600 py-2 transition flex items-center justify-center gap-1.5"
              >
                <span>View Complete Product Details & Reviews</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
