import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="w-20 h-20 bg-brand-50 text-brand-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
        <BookOpen className="w-10 h-10" />
      </div>
      <h1 className="text-4xl font-extrabold text-gray-900">Page Not Found</h1>
      <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
        The page you are looking for doesn't exist or has been moved to another shelf in our library.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link
          to="/"
          className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-3 px-6 rounded-xl shadow-md transition flex items-center gap-2"
        >
          <span>Back to Home</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
