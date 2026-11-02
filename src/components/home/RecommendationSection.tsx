import React from 'react';
import { useAppSelector } from '../../store/store';
import { BookCard } from '../book/BookCard';
import { Sparkles, Compass } from 'lucide-react';

export const RecommendationSection: React.FC = () => {
  const books = useAppSelector((state) => state.products.books);
  const orders = useAppSelector((state) => state.orders.orders);
  const user = useAppSelector((state) => state.auth.user);

  // Find dominant category from past orders
  const categoryCounts: Record<string, number> = {};
  orders.forEach((order) => {
    order.items.forEach((item) => {
      categoryCounts[item.book.category] = (categoryCounts[item.book.category] || 0) + 1;
    });
  });

  let topCategory = 'Technology & AI';
  let maxCount = 0;
  Object.entries(categoryCounts).forEach(([cat, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topCategory = cat;
    }
  });

  // Filter recommendations based on topCategory or high ratings
  const recommendedBooks = books
    .filter((b) => b.category === topCategory || b.rating >= 4.8)
    .slice(0, 4);

  return (
    <section className="my-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Personalized AI Curation</span>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">
            Recommended Based on Your Reading History
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {orders.length > 0
              ? `Curated selections tuned to your recent interest in "${topCategory}" and top-rated publications.`
              : 'Handpicked reader favorites tailored to inspire your next reading journey.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendedBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
};
