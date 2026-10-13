import React from 'react';
import { PortfolioCategory, PortfolioCategoryMeta } from '../types';
import { cn } from '../../../utils/cn';

export interface CategoryFilterProps {
  categories: PortfolioCategoryMeta[];
  activeCategory: PortfolioCategory;
  onSelectCategory: (category: PortfolioCategory) => void;
  categoryCounts: Record<PortfolioCategory, number>;
  className?: string;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  categoryCounts,
  className,
}) => {
  return (
    <nav
      aria-label="Portfolio category filters"
      className={cn('flex flex-wrap items-center gap-2 sm:gap-3', className)}
    >
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        const count = categoryCounts[cat.id] ?? 0;

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            aria-pressed={isActive}
            className={cn(
              'px-4 py-2.5 rounded-frame font-bold text-small transition-all duration-200',
              'flex items-center gap-2 border-2',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2',
              isActive
                ? 'bg-navy text-white border-navy shadow-sm'
                : 'bg-white text-navy-950 border-sage-300 hover:bg-sage-100 hover:border-sage-400'
            )}
          >
            <span>{cat.label}</span>
            <span
              className={cn(
                'px-1.5 py-0.5 rounded-full text-[11px] font-extrabold',
                isActive
                  ? 'bg-sage text-navy'
                  : 'bg-sage-200 text-navy-900'
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
