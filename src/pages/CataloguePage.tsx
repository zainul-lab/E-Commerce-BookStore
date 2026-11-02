import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import {
  setSortBy,
  setSearchQuery,
  setSelectedCategory,
  setSelectedBrand,
  setMinRating,
  resetFilters,
  SortOption,
} from '../store/slices/productsSlice';
import { BookCard } from '../components/book/BookCard';
import { FilterSidebar } from '../components/catalogue/FilterSidebar';
import { RatingStars } from '../components/common/RatingStars';
import { addToCart } from '../store/slices/cartSlice';
import { addToast } from '../store/slices/uiSlice';
import { getTentativeDeliveryDate } from '../utils/deliveryCalculator';
import { Link } from 'react-router-dom';
import {
  Filter,
  Grid,
  List,
  X,
  ChevronDown,
  BookOpen,
  Truck,
  ShoppingCart,
} from 'lucide-react';

export const CataloguePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    books,
    selectedCategory,
    selectedBrand,
    searchQuery,
    sortBy,
    priceRange,
    minRating,
    inStockOnly,
  } = useAppSelector((state) => state.products);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter books
  const filteredBooks = books.filter((book) => {
    // Category filter
    if (selectedCategory !== 'All' && book.category !== selectedCategory) {
      return false;
    }
    // Brand filter
    if (selectedBrand !== 'All' && book.publisher !== selectedBrand) {
      return false;
    }
    // Price filter
    if (book.price < priceRange[0] || book.price > priceRange[1]) {
      return false;
    }
    // Rating filter
    if (minRating > 0 && book.rating < minRating) {
      return false;
    }
    // In Stock filter
    if (inStockOnly && !book.inStock) {
      return false;
    }
    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchesTitle = book.title.toLowerCase().includes(q);
      const matchesAuthor = book.author.toLowerCase().includes(q);
      const matchesPublisher = book.publisher.toLowerCase().includes(q);
      const matchesIsbn = book.isbn.toLowerCase().includes(q);
      const matchesTags = book.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchesTitle && !matchesAuthor && !matchesPublisher && !matchesIsbn && !matchesTags) {
        return false;
      }
    }
    return true;
  });

  // Sort books
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'discount':
        return b.discountPercentage - a.discountPercentage;
      case 'newest':
        return (b.newRelease ? 1 : 0) - (a.newRelease ? 1 : 0);
      case 'featured':
      default:
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
  });

  const handleListAddToCart = (book: any, e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(addToCart({ book, quantity: 1, format: book.format }));
    const delivery = getTentativeDeliveryDate(book.tentativeDeliveryDays);
    dispatch(
      addToast({
        type: 'success',
        message: `Added "${book.title}" to basket`,
        subMessage: delivery.dateString,
      })
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Page Title & Breadcrumbs */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <Link to="/" className="hover:text-brand-600 transition">Home</Link>
          <span>/</span>
          <span className="font-semibold text-gray-800">
            {selectedCategory === 'All' ? 'Catalogue' : selectedCategory}
          </span>
          {selectedBrand !== 'All' && (
            <>
              <span>/</span>
              <span className="font-semibold text-brand-600">{selectedBrand}</span>
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {selectedCategory === 'All' ? 'Explore Book Catalogue' : selectedCategory}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Showing {sortedBooks.length} of {books.length} curated publications
            </p>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden flex items-center justify-center gap-2 bg-white border border-gray-300 py-2.5 px-4 rounded-xl text-xs font-bold text-gray-700 shadow-sm"
          >
            <Filter className="w-4 h-4 text-brand-600" />
            <span>Filter Books ({[
              selectedCategory !== 'All' ? 1 : 0,
              selectedBrand !== 'All' ? 1 : 0,
              minRating > 0 ? 1 : 0,
              inStockOnly ? 1 : 0,
            ].reduce((a, b) => a + b, 0)})</span>
          </button>
        </div>
      </div>

      {/* Main Grid with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Filter Sidebar (Desktop) */}
        <div className="hidden lg:block lg:col-span-1 sticky top-28">
          <FilterSidebar />
        </div>

        {/* Mobile Filter Drawer */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm lg:hidden flex justify-end">
            <div className="w-full max-w-xs bg-white h-full p-4 overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-4 pb-2 border-b">
                <span className="font-bold text-sm">Filter Catalogue</span>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-gray-500 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterSidebar onCloseMobile={() => setIsMobileFilterOpen(false)} />
            </div>
          </div>
        )}

        {/* Right Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Controls Bar (Active Filters, Sort, View Toggle) */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Active Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs w-full sm:w-auto">
              <span className="text-gray-400 font-medium">Active:</span>
              {selectedCategory !== 'All' && (
                <span className="bg-brand-50 text-brand-700 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 border border-brand-200">
                  {selectedCategory}
                  <button onClick={() => dispatch(setSelectedCategory('All'))}>
                    <X className="w-3 h-3 hover:text-brand-900" />
                  </button>
                </span>
              )}
              {selectedBrand !== 'All' && (
                <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 border border-indigo-200">
                  {selectedBrand}
                  <button onClick={() => dispatch(setSelectedBrand('All'))}>
                    <X className="w-3 h-3 hover:text-indigo-900" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 border border-amber-200">
                  Search: "{searchQuery}"
                  <button onClick={() => dispatch(setSearchQuery(''))}>
                    <X className="w-3 h-3 hover:text-amber-900" />
                  </button>
                </span>
              )}
              {minRating > 0 && (
                <span className="bg-yellow-50 text-yellow-800 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 border border-yellow-200">
                  ★ {minRating}+
                  <button onClick={() => dispatch(setMinRating(0))}>
                    <X className="w-3 h-3 hover:text-yellow-900" />
                  </button>
                </span>
              )}
              {selectedCategory === 'All' && selectedBrand === 'All' && !searchQuery && minRating === 0 && (
                <span className="text-gray-400 italic text-xs">All titles displayed</span>
              )}
            </div>

            {/* Sort & Grid/List switcher */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <div className="relative flex items-center">
                <span className="text-xs text-gray-500 mr-2 font-medium hidden sm:inline">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => dispatch(setSortBy(e.target.value as SortOption))}
                  aria-label="Sort books by"
                  className="bg-gray-50 border border-gray-200 rounded-xl py-1.5 pl-3 pr-8 text-xs font-bold text-gray-700 focus:outline-none focus:border-brand-500 cursor-pointer appearance-none"
                >
                  <option value="featured">Featured Picks</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="discount">Biggest Discount</option>
                  <option value="newest">New Releases</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 pointer-events-none" />
              </div>

              {/* View Switcher */}
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50 p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === 'grid' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === 'list' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Book Listings */}
          {sortedBooks.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 mx-auto flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No books found</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                We couldn't find any titles matching your selected filters or search keywords.
              </p>
              <button
                onClick={() => dispatch(resetFilters())}
                className="mt-5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-md transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {sortedBooks.map((book) => {
                const deliveryInfo = getTentativeDeliveryDate(book.tentativeDeliveryDays);
                return (
                  <div
                    key={book.id}
                    className="bg-white rounded-2xl p-5 border border-gray-200 hover:border-brand-300 hover:shadow-lg transition-all flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
                  >
                    <div className="flex gap-4 items-center">
                      <Link to={`/product/${book.id}`} className="shrink-0">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-20 h-28 sm:w-24 sm:h-36 object-cover rounded-md shadow"
                        />
                      </Link>
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-brand-600 uppercase">
                          {book.publisher} • {book.category}
                        </span>
                        <Link to={`/product/${book.id}`} className="block">
                          <h3 className="text-base font-bold text-gray-900 hover:text-brand-600 transition">
                            {book.title}
                          </h3>
                        </Link>
                        <p className="text-xs text-gray-500">by {book.author}</p>
                        <div className="pt-1">
                          <RatingStars rating={book.rating} showNumber reviewCount={book.reviewCount} size="sm" />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium pt-1">
                          <Truck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{deliveryInfo.dateString}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 gap-3">
                      <div className="text-right">
                        <span className="text-xl font-black text-gray-900">
                          ${book.price.toFixed(2)}
                        </span>
                        {book.originalPrice > book.price && (
                          <span className="text-xs text-gray-400 line-through block">
                            ${book.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => handleListAddToCart(book, e)}
                        className="bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition flex items-center gap-1.5 shadow-sm"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add to Basket</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
