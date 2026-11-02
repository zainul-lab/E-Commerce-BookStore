export type BookCategory = 
  | 'Fiction'
  | 'Non-Fiction'
  | 'Technology & AI'
  | 'Science & Nature'
  | 'Business & Finance'
  | 'Self-Help'
  | 'Mystery & Thriller'
  | 'Romance'
  | 'Biography';

export type BookFormat = 'Paperback' | 'Hardcover' | 'E-Book / Kindle' | 'Audiobook';

export interface BookReview {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  publisher: string; // Brand/Publisher
  category: BookCategory;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  coverImage: string;
  additionalImages?: string[];
  description: string;
  synopsis: string;
  isbn: string;
  pages: number;
  language: string;
  publicationDate: string;
  format: BookFormat;
  stock: number;
  inStock: boolean;
  featured?: boolean;
  bestSeller?: boolean;
  newRelease?: boolean;
  tentativeDeliveryDays: number; // e.g. 2 for 2-day delivery
  giftPoints: number; // Points earned on purchase
  tags: string[];
  reviews: BookReview[];
}
