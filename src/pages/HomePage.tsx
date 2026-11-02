import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store';
import { setSelectedCategory, setSelectedBrand } from '../store/slices/productsSlice';
import { HeroBanner } from '../components/home/HeroBanner';
import { BuyAgainSection } from '../components/home/BuyAgainSection';
import { RecommendationSection } from '../components/home/RecommendationSection';
import { BookCard } from '../components/book/BookCard';
import { CATEGORIES, BRANDS } from '../data/mockCategories';
import { BookCategory } from '../types/book';
import {
  Flame,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu,
  BookOpen,
  Compass,
  Atom,
  Eye,
  UserCheck,
  Building,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const books = useAppSelector((state) => state.products.books);

  const bestSellers = books.filter((b) => b.bestSeller).slice(0, 4);
  const featuredBooks = books.filter((b) => b.featured).slice(0, 4);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-blue-500" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-emerald-500" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-purple-500" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-amber-500" />;
      case 'Atom':
        return <Atom className="w-5 h-5 text-cyan-500" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-rose-500" />;
      case 'Eye':
        return <Eye className="w-5 h-5 text-slate-700" />;
      case 'UserCheck':
        return <UserCheck className="w-5 h-5 text-violet-500" />;
      default:
        return <BookOpen className="w-5 h-5 text-brand-500" />;
    }
  };

  const handleCategoryClick = (catId: BookCategory) => {
    dispatch(setSelectedCategory(catId));
    dispatch(setSelectedBrand('All'));
    navigate('/catalogue');
  };

  const handleBrandClick = (brandName: string) => {
    dispatch(setSelectedBrand(brandName));
    dispatch(setSelectedCategory('All'));
    navigate('/catalogue');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* 1. Hero Promotional Banner */}
      <HeroBanner />

      {/* 2. Order History "Buy It Again" Section (Slide 5, 8, 10) */}
      <BuyAgainSection />

      {/* 3. Browse By Category Cards */}
      <section className="my-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">Explore by Category</h2>
            <p className="text-xs text-gray-500 mt-0.5">Find books across specialized domains and topics</p>
          </div>
          <Link
            to="/catalogue"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="bg-white hover:bg-brand-50/50 p-4 rounded-2xl border border-gray-200 hover:border-brand-300 hover:shadow-md transition-all text-center flex flex-col items-center group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-gray-50 group-hover:bg-brand-100/60 flex items-center justify-center transition-colors mb-2.5 shadow-sm">
                {getCategoryIcon(cat.icon)}
              </div>
              <span className="text-xs font-bold text-gray-900 group-hover:text-brand-600 line-clamp-1 transition-colors">
                {cat.name}
              </span>
              <span className="text-[10px] text-gray-400 mt-0.5">{cat.count}+ Titles</span>
            </button>
          ))}
        </div>
      </section>

      {/* 4. Recommendations Based on History (Slide 5, 8, 11) */}
      <RecommendationSection />

      {/* 5. Trending Bestsellers Section */}
      <section className="my-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500 text-slate-950 shadow-md">
              <Flame className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">Trending Bestsellers</h2>
              <p className="text-xs text-gray-500 mt-0.5">The most read and acclaimed books this month</p>
            </div>
          </div>
          <Link
            to="/catalogue"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            <span>See All Bestsellers</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* 6. Browse by Brands / Publishers (Slide 5, 8, 10) */}
      <section className="my-12 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-600 text-white shadow-md">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Browse Leading Publishers & Brands
              </h2>
              <p className="text-xs text-gray-500">
                Official publications from world-renowned publishing houses
              </p>
            </div>
          </div>
          <Link
            to="/catalogue"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>Explore All Brands</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {BRANDS.map((brand) => (
            <button
              key={brand.id}
              onClick={() => handleBrandClick(brand.name)}
              className="p-4 rounded-xl border border-gray-100 hover:border-brand-400 bg-gray-50/70 hover:bg-brand-50/50 transition-all text-left flex items-center justify-between group cursor-pointer"
            >
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-brand-600 transition">
                  {brand.name}
                </h4>
                <p className="text-[11px] text-gray-500">{brand.booksCount} published titles</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </section>

      {/* 7. Featured Curations */}
      <section className="my-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-600 text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">Featured Curations</h2>
              <p className="text-xs text-gray-500 mt-0.5">Top-rated books tagged with instant delivery guarantee</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>
    </div>
  );
};
