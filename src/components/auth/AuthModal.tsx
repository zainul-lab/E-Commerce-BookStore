import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { setAuthModalOpen } from '../../store/slices/uiSlice';
import { login } from '../../store/slices/authSlice';
import { addToast } from '../../store/slices/uiSlice';
import { INITIAL_USER } from '../../data/mockUser';
import { X, Lock, Mail, User as UserIcon, Sparkles, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthModalOpen, authModalMode } = useAppSelector((state) => state.ui);

  const [mode, setMode] = useState<'login' | 'register'>(authModalMode || 'login');
  const [email, setEmail] = useState('sophia.montgomery@example.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Sophia Montgomery');
  const [rememberMe, setRememberMe] = useState(true);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      dispatch(
        login({
          ...INITIAL_USER,
          email: email || INITIAL_USER.email,
          name: name || INITIAL_USER.name,
        })
      );
      dispatch(
        addToast({
          type: 'success',
          message: `Welcome back, ${INITIAL_USER.name}!`,
          subMessage: 'You are signed in to your E-BookStore account.',
        })
      );
    } else {
      dispatch(
        login({
          ...INITIAL_USER,
          id: `usr-${Date.now()}`,
          name: name || 'New Reader',
          email: email || 'reader@example.com',
          rewardPoints: 500, // Sign up bonus
        })
      );
      dispatch(
        addToast({
          type: 'success',
          message: `Account created successfully!`,
          subMessage: '500 Welcome Bonus Gift Points added to your wallet!',
        })
      );
    }
    dispatch(setAuthModalOpen({ isOpen: false }));
  };

  const handleQuickDemoLogin = (profile: 'sophia' | 'alex') => {
    if (profile === 'sophia') {
      dispatch(login(INITIAL_USER));
      dispatch(
        addToast({
          type: 'success',
          message: `Signed in as ${INITIAL_USER.name}`,
          subMessage: 'Loaded profile with 1,250 points & past orders.',
        })
      );
    } else {
      dispatch(
        login({
          ...INITIAL_USER,
          id: 'usr-902',
          name: 'Alex Rivera (Dev)',
          email: 'alex.rivera@example.com',
          rewardPoints: 850,
        })
      );
      dispatch(
        addToast({
          type: 'success',
          message: 'Signed in as Alex Rivera',
        })
      );
    }
    dispatch(setAuthModalOpen({ isOpen: false }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100">
        
        {/* Close Button */}
        <button
          onClick={() => dispatch(setAuthModalOpen({ isOpen: false }))}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-3 text-sm font-bold border-b-2 transition ${
              mode === 'login'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-3 text-sm font-bold border-b-2 transition ${
              mode === 'register'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Header */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            {mode === 'login' ? 'Sign in to your account' : 'Join E-BookStore Today'}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {mode === 'login'
              ? 'Access saved addresses, points rewards, and order history'
              : 'Earn 500 bonus reward points ($5.00) upon registration'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
              <div className="relative rounded-xl border border-gray-300 focus-within:border-brand-600 overflow-hidden">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-9 pr-3 py-2.5 text-sm text-gray-800 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
            <div className="relative rounded-xl border border-gray-300 focus-within:border-brand-600 overflow-hidden">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 py-2.5 text-sm text-gray-800 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-gray-700">Password</label>
              {mode === 'login' && (
                <button type="button" className="text-[11px] font-semibold text-brand-600 hover:underline">
                  Forgot?
                </button>
              )}
            </div>
            <div className="relative rounded-xl border border-gray-300 focus-within:border-brand-600 overflow-hidden">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-sm text-gray-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded text-brand-600 focus:ring-brand-500 h-4 w-4"
            />
            <label htmlFor="remember" className="ml-2 text-xs text-gray-600">
              Remember me on this browser
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold py-2.5 rounded-xl shadow-md transition duration-200 text-sm"
          >
            {mode === 'login' ? 'Sign In to Account' : 'Create Free Account'}
          </button>
        </form>

        {/* Demo Fast Login shortcuts */}
        <div className="mt-6 pt-5 border-t border-gray-100">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 text-center mb-3">
            Quick 1-Click Demo Profiles
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('sophia')}
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl border border-purple-200 bg-purple-50/70 hover:bg-purple-100 text-purple-900 text-xs font-semibold transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Sophia (1250 pts)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('alex')}
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-900 text-xs font-semibold transition"
            >
              <UserIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>Alex (850 pts)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
