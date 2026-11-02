import { BookCategory } from '../types/book';

export interface CategoryInfo {
  id: BookCategory;
  name: string;
  icon: string;
  description: string;
  count: number;
  bgGradient: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'Technology & AI',
    name: 'Technology & AI',
    icon: 'Cpu',
    description: 'Artificial Intelligence, Software Engineering, Cloud & Data',
    count: 24,
    bgGradient: 'from-blue-600 to-indigo-700',
  },
  {
    id: 'Business & Finance',
    name: 'Business & Finance',
    icon: 'TrendingUp',
    description: 'Leadership, Economics, Startups & Investing',
    count: 18,
    bgGradient: 'from-emerald-600 to-teal-700',
  },
  {
    id: 'Fiction',
    name: 'Fiction & Literature',
    icon: 'BookOpen',
    description: 'Contemporary, Classics, Sci-Fi & Fantasy',
    count: 32,
    bgGradient: 'from-purple-600 to-pink-700',
  },
  {
    id: 'Non-Fiction',
    name: 'Non-Fiction',
    icon: 'Compass',
    description: 'History, Society, Philosophy & Deep Dives',
    count: 19,
    bgGradient: 'from-amber-600 to-orange-700',
  },
  {
    id: 'Science & Nature',
    name: 'Science & Nature',
    icon: 'Atom',
    description: 'Physics, Biology, Astronomy & Cosmos',
    count: 15,
    bgGradient: 'from-cyan-600 to-blue-700',
  },
  {
    id: 'Self-Help',
    name: 'Self-Help & Mindset',
    icon: 'Sparkles',
    description: 'Productivity, Habits, Psychology & Health',
    count: 21,
    bgGradient: 'from-rose-600 to-red-700',
  },
  {
    id: 'Mystery & Thriller',
    name: 'Mystery & Crime',
    icon: 'Eye',
    description: 'Suspense, Detective, Psychological Thrillers',
    count: 14,
    bgGradient: 'from-slate-700 to-zinc-900',
  },
  {
    id: 'Biography',
    name: 'Biography & Memoir',
    icon: 'UserCheck',
    description: 'Inspiring Lives, Pioneers & True Stories',
    count: 12,
    bgGradient: 'from-violet-600 to-purple-800',
  },
];

export const BRANDS = [
  { id: "O'Reilly Media", name: "O'Reilly Media", booksCount: 16 },
  { id: 'Penguin Random House', name: 'Penguin Random House', booksCount: 28 },
  { id: 'HarperCollins', name: 'HarperCollins', booksCount: 22 },
  { id: 'Packt Publishing', name: 'Packt Publishing', booksCount: 14 },
  { id: 'Simon & Schuster', name: 'Simon & Schuster', booksCount: 19 },
  { id: 'MIT Press', name: 'MIT Press', booksCount: 11 },
  { id: 'Bloomsbury', name: 'Bloomsbury', booksCount: 15 },
  { id: 'McGraw Hill', name: 'McGraw Hill', booksCount: 10 },
];
