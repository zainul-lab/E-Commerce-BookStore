import React from 'react';
import { Star, StarHalf } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  reviewCount?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxStars = 5,
  size = 'md',
  showNumber = false,
  reviewCount,
  interactive = false,
  onRatingChange,
}) => {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const renderStar = (index: number) => {
    const starValue = index + 1;
    const isFull = rating >= starValue;
    const isHalf = !isFull && rating >= index + 0.5;

    return (
      <button
        type="button"
        key={index}
        disabled={!interactive}
        onClick={() => interactive && onRatingChange && onRatingChange(starValue)}
        className={`${interactive ? 'cursor-pointer hover:scale-110 transition' : 'cursor-default'}`}
      >
        {isFull ? (
          <Star className={`${sizeClasses[size]} fill-amber-400 text-amber-400`} />
        ) : isHalf ? (
          <div className="relative">
            <Star className={`${sizeClasses[size]} text-gray-300`} />
            <div className="absolute top-0 left-0 overflow-hidden w-1/2">
              <Star className={`${sizeClasses[size]} fill-amber-400 text-amber-400`} />
            </div>
          </div>
        ) : (
          <Star className={`${sizeClasses[size]} text-gray-300`} />
        )}
      </button>
    );
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center space-x-0.5">
        {Array.from({ length: maxStars }).map((_, i) => renderStar(i))}
      </div>
      {showNumber && (
        <span className="text-xs font-bold text-gray-800">
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className="text-xs text-gray-500 font-medium">
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
};
