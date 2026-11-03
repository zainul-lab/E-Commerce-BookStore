import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ShieldCheck, Truck, RefreshCw, CreditCard, Gift, Heart, Mail } from 'lucide-react';
import { CATEGORIES } from '../../data/mockCategories';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-sm mt-16 border-t border-slate-900">
      {/* Value Proposition Bar */}
      <div className="border-b border-slate-900 bg-slate-900/60 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-brand-900/40 border border-brand-700/30 text-brand-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-100 text-sm">Tentative 2-Day Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Real-time arrival estimation on all book listings</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-purple-900/40 border border-purple-700/30 text-purple-400 shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-100 text-sm">Reward & Gift Points</h4>
              <p className="text-xs text-slate-400 mt-0.5">Earn points on every book and redeem instantly for discounts</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-900/40 border border-emerald-700/30 text-emerald-400 shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-100 text-sm">Cancel Within 48 Hours</h4>
              <p className="text-xs text-slate-400 mt-0.5">Hassle-free 1-click order cancellation with instant refund</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-900/40 border border-amber-700/30 text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-100 text-sm">Secure Payment Gateway</h4>
              <p className="text-xs text-slate-400 mt-0.5">256-bit encrypted checkout with Cards, UPI, NetBanking & COD</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-serif-heading text-xl font-bold text-white">
                E-BookStore<span className="text-brand-500">.com</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              Your premier online destination for technological, business, academic, and literary works. Built with AI-assisted modern frontend engineering standards.
            </p>

            <div className="pt-2">
              <p className="text-xs font-semibold text-slate-200 mb-2">Subscribe for Book Drops & Discounts</p>
              <div className="flex items-center max-w-sm rounded-xl border border-slate-800 bg-slate-900 overflow-hidden focus-within:border-brand-500">
                <div className="pl-3 text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-transparent py-2 px-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
                <button className="bg-brand-600 hover:bg-brand-700 text-white text-xs px-3.5 py-2 font-medium transition">
                  Join
                </button>
              </div>
            </div>
          </div>

          {/* Book Categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Top Categories</h3>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link to="/catalogue" className="hover:text-white transition">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Journey */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Customer Service</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/orders" className="hover:text-white transition">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-white transition">
                  Buy It Again
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-white transition">
                  48-Hour Cancellation Policy
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition">
                  Redeem Gift Points
                </Link>
              </li>
              <li>
                <span className="text-slate-500">24/7 Support Hotline</span>
              </li>
            </ul>
          </div>

          {/* Payment & Trust */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Accepted Payments</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <CreditCard className="w-4 h-4 text-brand-400" />
                <span>Credit & Debit Cards (Visa / MC / Amex)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="font-bold text-emerald-400 text-xs">UPI</span>
                <span>Google Pay / PhonePe / Paytm</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="font-bold text-amber-400 text-xs">Net</span>
                <span>Net Banking (All Major Banks)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="font-bold text-purple-400 text-xs">COD</span>
                <span>Cash on Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Gift className="w-4 h-4 text-purple-400" />
                <span>E-BookStore Reward Points</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} E-BookStore.com. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> using React, Vite, TypeScript, React Router & Redux
          </p>
        </div>
        <p className="mt-4 text-center text-xs text-slate-500">
          MD Zainul Abiddin ·{' '}
          <a
            href="https://e-commerce-book-store-seven.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            https://e-commerce-book-store-seven.vercel.app/
          </a>
        </p>
      </div>
    </footer>
  );
};
