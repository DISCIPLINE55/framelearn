import React, { useEffect, useState, useRef } from 'react';
import { PortfolioItem } from '../types';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../app/providers/ToastContext';
import { X, ChevronLeft, ChevronRight, Camera, Sliders, Sun, Share2, ImageOff, Loader2 } from 'lucide-react';
import { cn } from '../../../utils/cn';

export interface PortfolioLightboxProps {
  item: PortfolioItem | null;
  items: PortfolioItem[];
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (item: PortfolioItem) => void;
}

export const PortfolioLightbox: React.FC<PortfolioLightboxProps> = ({
  item,
  items,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { toast } = useToast();
  const [isImgLoading, setIsImgLoading] = useState(true);
  const [hasImgError, setHasImgError] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const currentIndex = item ? items.findIndex((i) => i.id === item.id) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < items.length - 1;

  const handlePrev = () => {
    if (hasPrev) {
      setIsImgLoading(true);
      setHasImgError(false);
      onNavigate(items[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      setIsImgLoading(true);
      setHasImgError(false);
      onNavigate(items[currentIndex + 1]);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, hasPrev, hasNext, currentIndex, onClose]);

  // Reset loading state whenever active item changes
  useEffect(() => {
    if (item) {
      setIsImgLoading(true);
      setHasImgError(false);
    }
  }, [item?.id]);

  if (!isOpen || !item) return null;

  const handleShare = async () => {
    try {
      const url = `${window.location.origin}${window.location.pathname}#portfolio-${item.id}`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        toast.success(`Share link copied: ${item.title}`);
      } else {
        toast.info(`Portfolio item: ${item.title}`);
      }
    } catch {
      toast.error('Unable to copy share link automatically.');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy-950/90 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Lightbox Dialog Container */}
      <div
        className={cn(
          'relative w-full max-w-5xl bg-white rounded-frame shadow-elevated border-2 border-sage-300 z-10 flex flex-col max-h-[95vh] overflow-hidden',
          'animate-in fade-in zoom-in-95 duration-200 motion-reduce:animate-none'
        )}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b-2 border-sage-300 bg-surface-light">
          <div className="flex items-center gap-3">
            <Badge variant="sage" size="sm">
              {item.categoryLabel}
            </Badge>
            <span className="text-caption font-bold text-navy-800">
              Photo {currentIndex + 1} of {items.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              leftIcon={<Share2 className="w-3.5 h-3.5" />}
              aria-label="Share photo"
            >
              Share
            </Button>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              aria-label="Close photo preview"
              className="rounded-full w-9 h-9 flex items-center justify-center text-navy hover:bg-navy/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Main Lightbox Body (Image & Technical Details) */}
        <div className="flex flex-col lg:flex-row overflow-y-auto flex-1">
          {/* Image Display Area */}
          <div className="relative flex-1 bg-navy flex items-center justify-center min-h-[300px] sm:min-h-[420px] lg:min-h-[520px] p-2 sm:p-4 overflow-hidden">
            {/* Loading Indicator */}
            {isImgLoading && !hasImgError && (
              <div className="absolute inset-0 flex items-center justify-center bg-navy/60 z-10">
                <Loader2 className="w-10 h-10 text-cream animate-spin stroke-[2.5]" />
              </div>
            )}

            {/* Error Fallback */}
            {hasImgError ? (
              <div className="flex flex-col items-center justify-center p-8 text-cream text-center">
                <ImageOff className="w-12 h-12 text-sage-300 mb-3 stroke-[2.5]" />
                <span className="text-body font-bold text-cream">Unable to load image preview</span>
                <span className="text-small text-cream/70 mt-1">{item.alt}</span>
              </div>
            ) : (
              <img
                src={item.src}
                alt={item.alt}
                onLoad={() => setIsImgLoading(false)}
                onError={() => {
                  setIsImgLoading(false);
                  setHasImgError(true);
                }}
                className={cn(
                  'max-h-[60vh] lg:max-h-[70vh] w-auto max-w-full object-contain rounded shadow-lg transition-opacity duration-300',
                  isImgLoading ? 'opacity-0' : 'opacity-100'
                )}
              />
            )}

            {/* Left Nav Button */}
            {hasPrev && (
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-navy-900/80 hover:bg-navy text-white flex items-center justify-center border border-sage-400 transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
              >
                <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
              </button>
            )}

            {/* Right Nav Button */}
            {hasNext && (
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-navy-900/80 hover:bg-navy text-white flex items-center justify-center border border-sage-400 transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
              >
                <ChevronRight className="w-6 h-6 stroke-[2.5]" />
              </button>
            )}
          </div>

          {/* Metadata Sidebar / Info Panel */}
          <div className="w-full lg:w-80 p-6 flex flex-col justify-between bg-white border-t-2 lg:border-t-0 lg:border-l-2 border-sage-300">
            <div className="flex flex-col gap-4">
              <div>
                <h3 id="lightbox-title" className="text-h3 font-display font-bold text-navy">
                  {item.title}
                </h3>
                <p className="text-small font-medium text-navy-800 mt-1 italic">
                  {item.caption}
                </p>
              </div>

              {/* Technical Specifications */}
              <div className="flex flex-col gap-2.5 pt-2 border-t border-sage-200">
                <span className="text-caption font-bold text-navy tracking-wide">
                  Technical Capture Notes
                </span>

                {item.details.sessionType && (
                  <div className="flex items-center gap-2 text-small text-navy-950 font-semibold">
                    <Sliders className="w-4 h-4 text-sage-600 stroke-[2.5] flex-shrink-0" />
                    <span>{item.details.sessionType}</span>
                  </div>
                )}

                {item.details.camera && (
                  <div className="flex items-center gap-2 text-small text-navy-950 font-semibold">
                    <Camera className="w-4 h-4 text-sage-600 stroke-[2.5] flex-shrink-0" />
                    <span>{item.details.camera} {item.details.lens ? `• ${item.details.lens}` : ''}</span>
                  </div>
                )}

                {item.details.lighting && (
                  <div className="flex items-center gap-2 text-small text-navy-950 font-semibold">
                    <Sun className="w-4 h-4 text-sage-600 stroke-[2.5] flex-shrink-0" />
                    <span>{item.details.lighting}</span>
                  </div>
                )}
              </div>

              {/* Academic Sample Attribution Disclaimer */}
              <div className="p-3 bg-cream rounded-frame border border-sage-300 text-[12px] font-medium text-navy-900 leading-snug">
                * Sample presentation image demonstrating high-resolution lightbox viewing and technical EXIF metadata.
              </div>
            </div>

            {/* Keyboard shortcuts helper */}
            <div className="pt-4 border-t border-sage-200 text-caption font-bold text-navy-700 flex items-center justify-between">
              <span>Use ← → to navigate</span>
              <span>ESC to close</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
