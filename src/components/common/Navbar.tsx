import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { setSearchQuery, setSelectedCategory } from '../../store/slices/productsSlice';
import { setAuthModalOpen, setMobileMenuOpen } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import { CATEGORIES } from '../../data/mockCategories';
import { BookCategory } from '../../types/book';
import {
  BookOpen,
  Search,
  ShoppingCart,
  User as UserIcon,
  MapPin,
  Gift,
  Clock,
  Sparkles,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Package,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { items: cartItems } = useAppSelector((state) => state.cart);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { searchQuery, selectedCategory } = useAppSelector((state) => state.products);
  const { isMobileMenuOpen } = useAppSelector((state) => state.ui);

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.book.price * item.quantity, 0);

  const activeAddress = user?.savedAddresses.find((a) => a.isDefault) || user?.savedAddresses[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearchQuery(localSearch));
    navigate('/catalogue');
  };

  const handleCategorySelect = (cat: BookCategory | 'All') => {
    dispatch(setSelectedCategory(cat));
    navigate('/catalogue');
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100">
      {/* Top Banner / Perks Strip */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-8 border-b border-indigo-900/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              Special Offer: Get 10% off with code <strong className="text-white underline">WELCOME10</strong>
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Free Tentative 2-Day Delivery on orders over $35
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated && user && (
              <span className="inline-flex items-center gap-1.5 bg-indigo-900/80 px-2 py-0.5 rounded-full border border-indigo-700/60 text-amber-300 font-medium">
                <Gift className="w-3 h-3" />
                {user.rewardPoints} Reward Points (${(user.rewardPoints / 100).toFixed(2)})
              </span>
            )}
            <Link to="/orders" className="hover:text-white transition flex items-center gap-1">
              <Package className="w-3 h-3 text-indigo-400" />
              Order Tracking & History
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => dispatch(setMobileMenuOpen(!isMobileMenuOpen))}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-brand-600 hover:bg-gray-100 transition"
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif-heading text-xl sm:text-2xl font-bold tracking-tight text-gray-900 group-hover:text-brand-600 transition-colors">
                  E-BookStore<span className="text-brand-600">.com</span>
                </span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold -mt-1 hidden sm:block">
                  Curated Knowledge Hub
                </span>
              </div>
            </Link>
          </div>

          {/* Delivery Location pill (Desktop) */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 cursor-pointer transition text-xs">
            <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
            <div className="flex flex-col">
              <span className="text-gray-400 leading-tight">Deliver to</span>
              <span className="font-semibold text-gray-800 leading-tight truncate max-w-[120px]">
                {activeAddress ? `${activeAddress.city} ${activeAddress.zipCode}` : 'Select Address'}
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-2xl hidden md:flex items-center rounded-xl border-2 border-gray-200 hover:border-brand-400 focus-within:border-brand-600 transition-all bg-white shadow-sm overflow-hidden"
          >
            {/* Category Dropdown */}
            <div className="relative border-r border-gray-200 bg-gray-50/80">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategorySelect(e.target.value as BookCategory | 'All')}
                aria-label="Filter by category"
                className="appearance-none bg-transparent text-xs font-semibold text-gray-700 py-2.5 pl-3 pr-8 cursor-pointer focus:outline-none"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Input field */}
            <div className="relative flex-1 flex items-center">
              <input
                type="text"
                placeholder="Search by title, author, topic, or ISBN..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full py-2.5 px-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalSearch('');
                    dispatch(setSearchQuery(''));
                  }}
                  className="text-gray-400 hover:text-gray-600 pr-2"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 transition flex items-center justify-center font-medium"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* User Account & Cart Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Orders shortcut */}
            <Link
              to="/orders"
              className="hidden lg:flex flex-col items-start px-2 py-1 rounded-lg hover:bg-gray-50 transition text-xs"
            >
              <span className="text-gray-400 leading-tight">Returns</span>
              <span className="font-bold text-gray-800 leading-tight">& Orders</span>
            </Link>

            {/* User Dropdown */}
            <div className="relative">
              {isAuthenticated && user ? (
                <div>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-200"
                  >
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/20"
                    />
                    <div className="hidden sm:flex flex-col items-start text-xs text-left">
                      <span className="text-gray-400 font-normal leading-tight">Hello,</span>
                      <span className="font-bold text-gray-800 leading-tight max-w-[90px] truncate">
                        {user.name.split(' ')[0]}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserDropdown && (
                    <div
                      className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                      onMouseLeave={() => setShowUserDropdown(false)}
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-xs text-gray-400">Signed in as</p>
                        <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        <div className="mt-2.5 flex items-center justify-between bg-amber-50 rounded-lg p-2 border border-amber-200">
                          <span className="text-xs font-semibold text-amber-900 flex items-center gap-1">
                            <Gift className="w-3.5 h-3.5 text-amber-600" /> Points Balance
                          </span>
                          <span className="text-xs font-bold text-amber-700">{user.rewardPoints} pts</span>
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/orders"
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition"
                        >
                          <Package className="w-4 h-4 text-gray-400" />
                          My Orders & Re-order
                        </Link>
                        <Link
                          to="/catalogue"
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition"
                        >
                          <BookOpen className="w-4 h-4 text-gray-400" />
                          Browse All Books
                        </Link>
                      </div>

                      <div className="border-t border-gray-100 pt-1">
                        <button
                          onClick={() => {
                            dispatch(logout());
                            setShowUserDropdown(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => dispatch(setAuthModalOpen({ isOpen: true, mode: 'login' }))}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-brand-600 hover:bg-brand-50 transition border border-brand-200"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              )}
            </div>

            {/* Shopping Cart button */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2.5 bg-slate-900 hover:bg-brand-600 text-white px-3.5 sm:px-4 py-2 rounded-xl shadow-sm transition-all duration-200 group"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 font-black text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col items-start text-left">
                <span className="text-[10px] text-slate-300 font-medium leading-none">Cart</span>
                <span className="text-xs font-bold leading-tight">
                  {cartSubtotal > 0 ? `$${cartSubtotal.toFixed(2)}` : '$0.00'}
                </span>
              </div>
            </Link>

          </div>
        </div>

        {/* Mobile Search Input */}
        <form onSubmit={handleSearchSubmit} className="mt-3 md:hidden flex items-center rounded-xl border border-gray-300 bg-white overflow-hidden">
          <input
            type="text"
            placeholder="Search books, authors, ISBN..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full py-2 px-3 text-sm focus:outline-none"
          />
          <button type="submit" className="bg-brand-600 text-white px-4 py-2">
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-4">
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Explore Categories</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  handleCategorySelect('All');
                  dispatch(setMobileMenuOpen(false));
                }}
                className="text-left text-xs font-medium p-2 rounded-lg bg-gray-50 hover:bg-brand-50 hover:text-brand-600 transition"
              >
                All Books Catalogue
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    handleCategorySelect(cat.id);
                    dispatch(setMobileMenuOpen(false));
                  }}
                  className="text-left text-xs font-medium p-2 rounded-lg bg-gray-50 hover:bg-brand-50 hover:text-brand-600 transition truncate"
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3 flex flex-col space-y-2">
              <Link
                to="/orders"
                onClick={() => dispatch(setMobileMenuOpen(false))}
                className="flex items-center gap-2 text-sm text-gray-700 py-1"
              >
                <Package className="w-4 h-4 text-brand-600" />
                Track Orders & History
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
