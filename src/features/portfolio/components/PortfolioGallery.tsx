import React, { useState, useMemo } from 'react';
import { PORTFOLIO_CATEGORIES, PORTFOLIO_ITEMS, PORTFOLIO_DISCLAIMER } from '../data';
import { PortfolioCategory, PortfolioItem } from '../types';
import { CategoryFilter } from './CategoryFilter';
import { PortfolioLightbox } from './PortfolioLightbox';
import { ImageContainer } from '../../../components/media/ImageContainer';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Badge } from '../../../components/ui/Badge';
import { Sparkles, Maximize2, Info } from 'lucide-react';

export interface PortfolioGalleryProps {
  initialCategory?: PortfolioCategory;
}

export const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({
  initialCategory = 'all',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<PortfolioCategory>(initialCategory);
  const [activeItem, setActiveItem] = useState<PortfolioItem | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Compute item counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<PortfolioCategory, number> = {
      all: PORTFOLIO_ITEMS.length,
      portraits: 0,
      graduation: 0,
      weddings: 0,
      outdoor: 0,
      birthdays: 0,
      product: 0,
    };
    PORTFOLIO_ITEMS.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Filter items based on active category
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') {
      return PORTFOLIO_ITEMS;
    }
    return PORTFOLIO_ITEMS.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  const activeCategoryMeta = useMemo(() => {
    return PORTFOLIO_CATEGORIES.find((c) => c.id === selectedCategory) || PORTFOLIO_CATEGORIES[0];
  }, [selectedCategory]);

  const handleOpenLightbox = (item: PortfolioItem) => {
    setActiveItem(item);
    setIsLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false);
    setActiveItem(null);
  };

  return (
    <section className="flex flex-col gap-8 w-full" aria-label="Interactive Photography Portfolio">
      {/* Category Filter Controls */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-small font-bold text-navy-800 uppercase tracking-wider">
            Filter by Discipline
          </span>
          <span className="text-caption font-bold text-navy-800">
            Showing {filteredItems.length} of {PORTFOLIO_ITEMS.length} photograph{PORTFOLIO_ITEMS.length === 1 ? '' : 's'}
          </span>
        </div>

        <CategoryFilter
          categories={PORTFOLIO_CATEGORIES}
          activeCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categoryCounts={categoryCounts}
        />
      </div>

      {/* Category Information Ribbon */}
      <div className="p-4 bg-white rounded-frame border-2 border-sage-300 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <Badge variant="navy" size="md">
            {activeCategoryMeta.label}
          </Badge>
          <p className="text-small font-medium text-navy-950">
            {activeCategoryMeta.description}
          </p>
        </div>

        {selectedCategory !== 'all' && (
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className="text-small font-bold text-navy hover:text-sage-700 underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-navy rounded"
          >
            Reset to All Works
          </button>
        )}
      </div>

      {/* Academic Disclaimer Notice */}
      <div className="flex items-center gap-2 p-3 bg-cream rounded-frame border border-navy-800 text-small text-navy-900 font-medium">
        <Info className="w-4 h-4 text-navy stroke-[2.5] flex-shrink-0" />
        <span>{PORTFOLIO_DISCLAIMER}</span>
      </div>

      {/* Portfolio Grid */}
      {filteredItems.length === 0 ? (
        <EmptyState
          title="No Photographs in this Discipline"
          message={`There are currently no curated photographs available for "${activeCategoryMeta.label}".`}
          actionLabel="Show All Photographs"
          onAction={() => setSelectedCategory('all')}
          className="my-8"
        />
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          data-testid="portfolio-grid"
        >
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenLightbox(item)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOpenLightbox(item);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Open preview for ${item.title}`}
              className="group text-left cursor-pointer rounded-frame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="relative">
                <ImageContainer
                  src={item.src}
                  alt={item.alt}
                  aspectRatio={item.aspectRatio}
                  caption={`${item.categoryLabel} • ${item.title}`}
                  showOverlay
                  overlayText={item.title}
                />
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-navy/80 text-white p-2 rounded-full shadow-md pointer-events-none">
                  <Maximize2 className="w-4 h-4 stroke-[2.5]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Roadmap Notice Ribbon */}
      <div className="p-6 bg-cream rounded-frame border-2 border-navy-800 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex flex-col">
          <span className="font-bold text-navy">Interactive Portfolio Feature (Completed)</span>
          <span className="text-small text-navy-950 font-medium">
            Category filtering, high-resolution lightbox viewing, and responsive layout are now fully operational.
          </span>
        </div>
        <Badge variant="sage" size="md" icon={<Sparkles className="w-4 h-4" />}>
          Milestone 001-P Active
        </Badge>
      </div>

      {/* Lightbox Modal Component */}
      <PortfolioLightbox
        item={activeItem}
        items={filteredItems}
        isOpen={isLightboxOpen}
        onClose={handleCloseLightbox}
        onNavigate={(item) => setActiveItem(item)}
      />
    </section>
  );
};
