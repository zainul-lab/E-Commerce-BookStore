import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { setSelectedCategory, setSelectedBrand } from '../../store/slices/productsSlice';
import { CATEGORIES } from '../../data/mockCategories';
import { BookCategory } from '../../types/book';
import { Flame, Sparkles, RefreshCw, Layers } from 'lucide-react';

export const CategoryBar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const selectedCategory = useAppSelector((state) => state.products.selectedCategory);

  const handleSelect = (cat: BookCategory | 'All') => {
    dispatch(setSelectedCategory(cat));
    dispatch(setSelectedBrand('All'));
    navigate('/catalogue');
  };

  return (
    <nav className="bg-slate-900 text-slate-200 border-b border-slate-800 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 overflow-x-auto py-1.5 scrollbar-none text-xs font-medium">
          
          <button
            onClick={() => handleSelect('All')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition shrink-0 ${
              selectedCategory === 'All'
                ? 'bg-brand-600 text-white font-semibold'
                : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Books</span>
          </button>

          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat.id)}
              className={`px-3 py-1.5 rounded-lg transition shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-brand-600 text-white font-semibold'
                  : 'hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}

          <div className="h-4 w-px bg-slate-700 mx-2 shrink-0" />

          <button
            onClick={() => {
              dispatch(setSelectedCategory('All'));
              navigate('/catalogue');
            }}
            className="px-3 py-1.5 rounded-lg hover:bg-slate-800 text-amber-300 hover:text-amber-200 flex items-center gap-1 transition shrink-0 font-medium"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Bestsellers</span>
          </button>

          <button
            onClick={() => {
              dispatch(setSelectedCategory('All'));
              navigate('/catalogue');
            }}
            className="px-3 py-1.5 rounded-lg hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition shrink-0 font-medium"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Releases</span>
          </button>

          <button
            onClick={() => navigate('/orders')}
            className="px-3 py-1.5 rounded-lg hover:bg-slate-800 text-indigo-300 hover:text-indigo-200 flex items-center gap-1 transition shrink-0 font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Buy It Again</span>
          </button>

        </div>
      </div>
    </nav>
  );
};
