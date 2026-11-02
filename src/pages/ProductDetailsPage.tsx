import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store';
import { addToCart } from '../store/slices/cartSlice';
import { addToast } from '../store/slices/uiSlice';
import { RatingStars } from '../components/common/RatingStars';
import { BookCard } from '../components/book/BookCard';
import { getTentativeDeliveryDate } from '../utils/deliveryCalculator';
import {
  Truck,
  ShieldCheck,
  Gift,
  ShoppingCart,
  Zap,
  Check,
  BookOpen,
  FileText,
  MessageSquare,
} from 'lucide-react';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const books = useAppSelector((state) => state.products.books);
  const book = books.find((b) => b.id === id) || books[0];

  const [quantity, setQuantity] = useState(1);
  const [selectedFormat, setSelectedFormat] = useState(book.format);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'reviews'>('details');

  // Review submission state
  const [userReviewRating, setUserReviewRating] = useState(5);
  const [userReviewComment, setUserReviewComment] = useState('');
  const [userReviewName, setUserReviewName] = useState('');
  const [reviewsList, setReviewsList] = useState(book.reviews || []);

  const deliveryInfo = getTentativeDeliveryDate(book.tentativeDeliveryDays);

  // Related products from the same category or publisher
  const relatedBooks = books
    .filter((b) => b.id !== book.id && (b.category === book.category || b.publisher === book.publisher))
    .slice(0, 4);

  const handleAddToCart = () => {
    dispatch(addToCart({ book, quantity, format: selectedFormat }));
    dispatch(
      addToast({
        type: 'success',
        message: `Added ${quantity}x "${book.title}" to your basket!`,
        subMessage: `${deliveryInfo.dateString}`,
      })
    );
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ book, quantity, format: selectedFormat }));
    navigate('/checkout');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userReviewComment.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      userName: userReviewName || 'Reader',
      rating: userReviewRating,
      date: 'Just now',
      comment: userReviewComment,
      verifiedPurchase: true,
    };

    setReviewsList([newRev, ...reviewsList]);
    setUserReviewComment('');
    setUserReviewName('');
    dispatch(
      addToast({
        type: 'success',
        message: 'Thank you for your review!',
        subMessage: 'Your feedback has been published.',
      })
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link to="/" className="hover:text-brand-600 transition">Home</Link>
        <span>/</span>
        <Link to="/catalogue" className="hover:text-brand-600 transition">{book.category}</Link>
        <span>/</span>
        <span className="font-semibold text-gray-800 truncate max-w-xs">{book.title}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Book Image Showcase */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative group bg-gray-50/80 p-8 rounded-3xl border border-gray-100 w-full flex items-center justify-center shadow-inner">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-56 sm:w-64 h-80 sm:h-96 object-cover rounded-xl shadow-2xl transform group-hover:scale-105 transition-transform duration-300"
            />
            
            {book.discountPercentage > 0 && (
              <span className="absolute top-4 left-4 bg-rose-600 text-white font-black text-xs px-3 py-1 rounded-full shadow-md">
                {book.discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Points & Guarantee Pill */}
          <div className="mt-4 w-full grid grid-cols-2 gap-2 text-xs font-semibold">
            <div className="bg-purple-50 text-purple-800 p-3 rounded-2xl border border-purple-200 flex items-center gap-2">
              <Gift className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Earn +{book.giftPoints} Reward Points</span>
            </div>
            <div className="bg-emerald-50 text-emerald-800 p-3 rounded-2xl border border-emerald-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>48h Return Guarantee</span>
            </div>
          </div>
        </div>

        {/* Center & Right Column: Info & Buy Box */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Header Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                {book.publisher}
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs font-medium text-gray-600">{book.category}</span>
            </div>

            <h1 className="font-serif-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
              {book.title}
            </h1>
            {book.subtitle && (
              <p className="text-sm text-gray-500 font-medium mt-1">
                {book.subtitle}
              </p>
            )}

            <p className="text-sm text-gray-700 mt-2">
              by <strong className="text-gray-900 underline">{book.author}</strong>
            </p>

            <div className="mt-3 flex items-center gap-4">
              <RatingStars rating={book.rating} showNumber reviewCount={book.reviewCount} size="md" />
              <span className="text-xs text-gray-400">|</span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> In Stock ({book.stock} copies left)
              </span>
            </div>
          </div>

          {/* Pricing Row */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-baseline justify-between">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-gray-900">
                ${book.price.toFixed(2)}
              </span>
              {book.originalPrice > book.price && (
                <span className="text-base text-gray-400 line-through">
                  ${book.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              Save ${(book.originalPrice - book.price).toFixed(2)} ({book.discountPercentage}%)
            </span>
          </div>

          {/* Tentative Delivery Date Tag (Slide 5, 8, 10 requirement) */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-1">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-900">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{deliveryInfo.dateString}</span>
            </div>
            <p className="text-xs text-emerald-700">
              Order within <strong>4 hrs 20 mins</strong> to receive it by {deliveryInfo.formattedDay} with standard express shipping.
            </p>
          </div>

          {/* Format Selection */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-2">
              Select Book Format
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { name: 'Paperback', price: book.price },
                { name: 'Hardcover', price: Number((book.price * 1.3).toFixed(2)) },
                { name: 'E-Book / Kindle', price: Number((book.price * 0.7).toFixed(2)) },
                { name: 'Audiobook', price: Number((book.price * 0.85).toFixed(2)) },
              ].map((fmt) => (
                <button
                  key={fmt.name}
                  type="button"
                  onClick={() => setSelectedFormat(fmt.name as any)}
                  className={`p-3 rounded-xl border text-left transition ${
                    selectedFormat === fmt.name
                      ? 'border-brand-600 bg-brand-50 text-brand-900 shadow-sm ring-1 ring-brand-600'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <span className="text-xs font-bold block truncate">{fmt.name}</span>
                  <span className="text-xs font-extrabold text-gray-900 mt-0.5 block">${fmt.price}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Action CTA Buttons */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 font-bold transition"
                >
                  -
                </button>
                <span className="px-4 py-2.5 text-sm font-bold text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 font-bold transition"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-slate-900 hover:bg-brand-600 active:bg-brand-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Basket</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold py-3 px-6 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm"
              >
                <Zap className="w-4 h-4" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Tabs Section: Description, Specifications, Reviews */}
      <div className="my-10 bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm">
        
        {/* Tab Headers */}
        <div className="flex border-b border-gray-200 space-x-6 mb-6">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'details'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Description & Synopsis</span>
          </button>

          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'specs'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Product Details & Specs</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'reviews'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Customer Reviews ({reviewsList.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'details' && (
          <div className="space-y-4 max-w-3xl text-sm leading-relaxed text-gray-700">
            <h3 className="font-bold text-gray-900 text-base">About This Book</h3>
            <p>{book.description}</p>
            <h4 className="font-bold text-gray-900 text-sm pt-2">Key Synopsis</h4>
            <p>{book.synopsis}</p>
            <div className="pt-2 flex flex-wrap gap-2">
              {book.tags.map((tag) => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="max-w-xl">
            <table className="w-full text-xs text-left">
              <tbody className="divide-y divide-gray-100">
                <tr className="py-2.5">
                  <td className="font-bold text-gray-500 py-2.5 w-1/3">Publisher / Brand</td>
                  <td className="text-gray-900 font-semibold py-2.5">{book.publisher}</td>
                </tr>
                <tr>
                  <td className="font-bold text-gray-500 py-2.5">ISBN-13</td>
                  <td className="text-gray-900 py-2.5">{book.isbn}</td>
                </tr>
                <tr>
                  <td className="font-bold text-gray-500 py-2.5">Print Length</td>
                  <td className="text-gray-900 py-2.5">{book.pages} pages</td>
                </tr>
                <tr>
                  <td className="font-bold text-gray-500 py-2.5">Language</td>
                  <td className="text-gray-900 py-2.5">{book.language}</td>
                </tr>
                <tr>
                  <td className="font-bold text-gray-500 py-2.5">Publication Date</td>
                  <td className="text-gray-900 py-2.5">{book.publicationDate}</td>
                </tr>
                <tr>
                  <td className="font-bold text-gray-500 py-2.5">Dimensions</td>
                  <td className="text-gray-900 py-2.5">6 x 1.4 x 9 inches</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-8">
            {/* Review form */}
            <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-5 rounded-2xl border border-gray-200 max-w-2xl space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">Write a Customer Review</h4>
              
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-600">Your Rating:</span>
                <RatingStars
                  rating={userReviewRating}
                  interactive
                  onRatingChange={(r) => setUserReviewRating(r)}
                  size="md"
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Your Name / Title"
                  value={userReviewName}
                  onChange={(e) => setUserReviewName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-600 bg-white"
                />
              </div>

              <div>
                <textarea
                  rows={3}
                  required
                  placeholder="Share your thoughts on the writing, clarity, and takeaways..."
                  value={userReviewComment}
                  onChange={(e) => setUserReviewComment(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-600 bg-white"
                />
              </div>

              <button
                type="submit"
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-2 px-4 rounded-xl transition"
              >
                Submit Review
              </button>
            </form>

            {/* Existing reviews */}
            <div className="space-y-4 max-w-2xl">
              {reviewsList.length === 0 ? (
                <p className="text-xs text-gray-500 italic">No reviews yet. Be the first to share your review!</p>
              ) : (
                reviewsList.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900">{rev.userName}</span>
                        {rev.verifiedPurchase && (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400">{rev.date}</span>
                    </div>
                    <RatingStars rating={rev.rating} size="sm" />
                    <p className="text-xs text-gray-700 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

      {/* Related Products Carousel (Slide 5, 8, 10: "Related products appear for selection") */}
      {relatedBooks.length > 0 && (
        <section className="my-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">
                Related Books & Recommendations
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Customers who viewed this book also considered these titles
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedBooks.map((relBook) => (
              <BookCard key={relBook.id} book={relBook} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
