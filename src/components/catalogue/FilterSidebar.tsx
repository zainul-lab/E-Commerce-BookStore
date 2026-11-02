import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  setSelectedCategory,
  setSelectedBrand,
  setPriceRange,
  setMinRating,
  setInStockOnly,
  resetFilters,
} from '../../store/slices/productsSlice';
import { CATEGORIES, BRANDS } from '../../data/mockCategories';
import { BookCategory } from '../../types/book';
import { Filter, RotateCcw, Star, Check, ChevronDown } from 'lucide-react';

interface FilterSidebarProps {
  onCloseMobile?: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ onCloseMobile }) => {
  const dispatch = useAppDispatch();
  const {
    selectedCategory,
    selectedBrand,
    priceRange,
    minRating,
    inStockOnly,
  } = useAppSelector((state) => state.products);

  const handleReset = () => {
    dispatch(resetFilters());
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-brand-600" />
          <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Filters</h3>
        </div>
        <button
          onClick={handleReset}
          className="text-xs text-gray-500 hover:text-brand-600 font-semibold flex items-center gap-1 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. Category Filter (Slide 5, 8, 10) */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
          Categories
        </h4>
        <div className="space-y-1">
          <button
            onClick={() => dispatch(setSelectedCategory('All'))}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
              selectedCategory === 'All'
                ? 'bg-brand-50 text-brand-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>All Categories</span>
            {selectedCategory === 'All' && <Check className="w-3.5 h-3.5 text-brand-600" />}
          </button>

          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => dispatch(setSelectedCategory(cat.id))}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center justify-between ${
                selectedCategory === cat.id
                  ? 'bg-brand-50 text-brand-700 font-bold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="truncate">{cat.name}</span>
              {selectedCategory === cat.id ? (
                <Check className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              ) : (
                <span className="text-[10px] text-gray-400">({cat.count})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Brand / Publisher Filter (Slide 5, 8, 10) */}
      <div className="pt-4 border-t border-gray-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
          Publishers & Brands
        </h4>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => dispatch(setSelectedBrand('All'))}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
              selectedBrand === 'All'
                ? 'bg-brand-50 text-brand-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>All Publishers</span>
            {selectedBrand === 'All' && <Check className="w-3.5 h-3.5 text-brand-600" />}
          </button>

          {BRANDS.map((brand) => (
            <button
              key={brand.id}
              onClick={() => dispatch(setSelectedBrand(brand.name))}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center justify-between ${
                selectedBrand === brand.name
                  ? 'bg-brand-50 text-brand-700 font-bold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="truncate">{brand.name}</span>
              {selectedBrand === brand.name ? (
                <Check className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              ) : (
                <span className="text-[10px] text-gray-400">({brand.booksCount})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Price Filter */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">Price Range</h4>
          <span className="text-xs font-extrabold text-brand-600">
            ${priceRange[0]} - ${priceRange[1]}
          </span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          step="5"
          value={priceRange[1]}
          onChange={(e) => dispatch(setPriceRange([priceRange[0], Number(e.target.value)]))}
          className="w-full accent-brand-600 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-gray-400 mt-1">
          <span>Min: $10</span>
          <span>Max: $100</span>
        </div>
      </div>

      {/* 4. Customer Rating Filter */}
      <div className="pt-4 border-t border-gray-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
          Customer Rating
        </h4>
        <div className="space-y-1">
          {[4.8, 4.5, 4.0].map((star) => (
            <button
              key={star}
              onClick={() => dispatch(setMinRating(minRating === star ? 0 : star))}
              className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center justify-between ${
                minRating === star
                  ? 'bg-brand-50 text-brand-700 font-bold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                </div>
                <span>{star} & Above</span>
              </div>
              {minRating === star && <Check className="w-3.5 h-3.5 text-brand-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* 5. In Stock Only Toggle */}
      <div className="pt-4 border-t border-gray-100">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs font-semibold text-gray-700">In Stock Only</span>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => dispatch(setInStockOnly(e.target.checked))}
            className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 accent-brand-600 cursor-pointer"
          />
        </label>
      </div>
    </aside>
  );
};
