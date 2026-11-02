import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/store';
import { setSelectedCategory } from '../../store/slices/productsSlice';
import { Sparkles, ArrowRight, Truck, Gift, ShieldCheck, Flame, BookOpen } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleExploreTech = () => {
    dispatch(setSelectedCategory('Technology & AI'));
    navigate('/catalogue');
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl shadow-2xl border border-indigo-900/40 my-6">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-400/30 text-brand-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Next-Gen Online Bookstore Experience</span>
            </div>

            <h1 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight sm:leading-none">
              Expand Your Mind with <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                World-Class Books & AI Hub
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Explore thousands of curated titles across Technology, Artificial Intelligence, Business, Literature, and Science. Enjoy guaranteed tentative 2-day delivery, earn gift rewards, and order with 48h cancellation protection.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                to="/catalogue"
                className="bg-brand-600 hover:bg-brand-500 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-brand-600/30 transition-all flex items-center gap-2 group text-sm"
              >
                <span>Browse Full Catalogue</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                onClick={handleExploreTech}
                className="bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold px-5 py-3.5 rounded-xl transition text-sm flex items-center gap-2"
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>AI & Tech Specials</span>
              </button>
            </div>

            {/* Quick feature pill row */}
            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Tentative 2-Day Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Gift className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Earn Gift Points</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Cancel within 48h</span>
              </div>
            </div>
          </div>

          {/* Right Featured Spotlight Column */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-purple-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-75 transition duration-500" />
              <div className="relative bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 backdrop-blur-xl flex flex-col items-center max-w-xs text-center">
                <span className="text-[10px] font-black tracking-widest uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full mb-3">
                  Editor's Choice of the Week
                </span>
                
                <img
                  src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400"
                  alt="Designing Data-Intensive Applications"
                  className="w-36 h-52 object-cover rounded-md shadow-2xl mb-4 group-hover:scale-105 transition-transform duration-300"
                />

                <h3 className="font-bold text-slate-100 text-sm line-clamp-2">
                  Designing Data-Intensive Applications
                </h3>
                <p className="text-xs text-slate-400 mt-1">by Martin Kleppmann</p>

                <div className="mt-3 flex items-center justify-between w-full pt-3 border-t border-slate-800">
                  <span className="text-base font-extrabold text-white">$42.99</span>
                  <Link
                    to="/product/book-1"
                    className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
                  >
                    View Book <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
