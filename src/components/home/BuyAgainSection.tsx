import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { addToCart } from '../../store/slices/cartSlice';
import { addToast } from '../../store/slices/uiSlice';
import { Book } from '../../types/book';
import { RatingStars } from '../common/RatingStars';
import { getTentativeDeliveryDate } from '../../utils/deliveryCalculator';
import { RefreshCw, ShoppingCart, ArrowRight, Truck, CheckCircle2 } from 'lucide-react';

export const BuyAgainSection: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.orders);

  // Extract unique books from past delivered or completed orders
  const pastBooksMap = new Map<string, Book>();
  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!pastBooksMap.has(item.book.id)) {
        pastBooksMap.set(item.book.id, item.book);
      }
    });
  });

  const buyAgainBooks = Array.from(pastBooksMap.values());

  if (buyAgainBooks.length === 0) return null;

  const handleBuyAgain = (book: Book, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ book, quantity: 1, format: book.format }));
    dispatch(
      addToast({
        type: 'success',
        message: `Added "${book.title.slice(0, 25)}..." to your basket!`,
        subMessage: 'Instant re-order from your past purchase history.',
      })
    );
  };

  return (
    <section className="my-10 bg-gradient-to-r from-indigo-50/70 via-white to-purple-50/70 rounded-3xl p-6 sm:p-8 border border-indigo-100/80 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Buy It Again
            </h2>
            <p className="text-xs text-gray-500">
              Frequently purchased items from your previous orders
            </p>
          </div>
        </div>

        <Link
          to="/orders"
          className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group self-start sm:self-auto"
        >
          <span>View All Past Orders</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {buyAgainBooks.slice(0, 4).map((book) => {
          const deliveryInfo = getTentativeDeliveryDate(book.tentativeDeliveryDays);
          return (
            <div
              key={book.id}
              className="bg-white rounded-2xl p-4 border border-gray-200/80 hover:border-brand-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div className="flex gap-3">
                <Link to={`/product/${book.id}`} className="shrink-0">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-16 h-24 object-cover rounded-md shadow"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-gray-400 font-semibold truncate block">
                    {book.publisher}
                  </span>
                  <Link
                    to={`/product/${book.id}`}
                    className="text-xs font-bold text-gray-900 hover:text-brand-600 line-clamp-2 transition leading-snug"
                  >
                    {book.title}
                  </Link>
                  <p className="text-[11px] text-gray-500 mt-0.5 truncate">{book.author}</p>
                  
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-sm font-extrabold text-gray-900">
                      ${book.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery notice */}
              <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1 truncate">
                  <Truck className="w-3 h-3 shrink-0" />
                  {deliveryInfo.dateString}
                </span>

                <button
                  onClick={(e) => handleBuyAgain(book, e)}
                  className="bg-slate-900 hover:bg-brand-600 text-white text-xs font-semibold py-1.5 px-3 rounded-lg transition flex items-center gap-1.5 shadow-sm shrink-0"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Buy Again</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
