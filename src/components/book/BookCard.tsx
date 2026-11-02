import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from '../../types/book';
import { useAppDispatch } from '../../store/store';
import { addToCart } from '../../store/slices/cartSlice';
import { setQuickViewBook } from '../../store/slices/productsSlice';
import { addToast } from '../../store/slices/uiSlice';
import { RatingStars } from '../common/RatingStars';
import { getTentativeDeliveryDate } from '../../utils/deliveryCalculator';
import { ShoppingCart, Eye, Truck, Sparkles, Gift } from 'lucide-react';

interface BookCardProps {
  book: Book;
  compact?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({ book, compact = false }) => {
  const dispatch = useAppDispatch();
  const deliveryInfo = getTentativeDeliveryDate(book.tentativeDeliveryDays);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ book, quantity: 1, format: book.format }));
    dispatch(
      addToast({
        type: 'success',
        message: `Added "${book.title.slice(0, 30)}..." to basket!`,
        subMessage: `${deliveryInfo.dateString}`,
      })
    );
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(setQuickViewBook(book));
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-200 hover:border-brand-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Top badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {book.bestSeller && (
          <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm tracking-wider flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 fill-slate-950" /> Best Seller
          </span>
        )}
        {book.discountPercentage > 0 && (
          <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            {book.discountPercentage}% OFF
          </span>
        )}
      </div>

      {/* Quick view button overlay */}
      <button
        onClick={handleQuickView}
        className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-md hover:bg-brand-600 hover:text-white text-gray-700 p-2 rounded-xl shadow-md cursor-pointer duration-200"
        title="Quick View"
      >
        <Eye className="w-4 h-4" />
      </button>

      {/* Book Image */}
      <Link to={`/product/${book.id}`} className="block relative pt-6 px-6 pb-2 text-center bg-gray-50/60 overflow-hidden">
        <div className="relative mx-auto w-36 h-52 sm:w-40 sm:h-56 transform group-hover:-translate-y-1 group-hover:scale-105 transition-transform duration-300 shadow-md group-hover:shadow-xl rounded-md overflow-hidden bg-white">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </Link>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand/Publisher & Category */}
          <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
            <span className="font-semibold text-brand-600 truncate max-w-[120px]">{book.publisher}</span>
            <span className="text-gray-400 truncate max-w-[90px]">{book.category}</span>
          </div>

          {/* Book Title */}
          <Link to={`/product/${book.id}`} className="block group-hover:text-brand-600 transition-colors">
            <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-snug line-clamp-2">
              {book.title}
            </h3>
          </Link>

          {/* Author */}
          <p className="text-xs text-gray-600 mt-1 line-clamp-1">
            by <span className="font-medium text-gray-800">{book.author}</span>
          </p>

          {/* Ratings */}
          <div className="mt-2 flex items-center justify-between">
            <RatingStars rating={book.rating} size="sm" showNumber reviewCount={book.reviewCount} />
          </div>

          {/* Tentative Delivery Date (Req in slide 5, 8, 10) */}
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 font-medium">
            <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{deliveryInfo.dateString}</span>
          </div>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-baseline justify-between mb-2.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-extrabold text-gray-900">
                ${book.price.toFixed(2)}
              </span>
              {book.originalPrice > book.price && (
                <span className="text-xs text-gray-400 line-through">
                  ${book.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            
            <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md font-semibold border border-purple-100 flex items-center gap-1">
              <Gift className="w-2.5 h-2.5" /> +{book.giftPoints} pts
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-slate-900 hover:bg-brand-600 active:bg-brand-700 text-white text-xs sm:text-sm font-semibold py-2.5 px-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Basket</span>
          </button>
        </div>
      </div>
    </div>
  );
};
