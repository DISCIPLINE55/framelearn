import React, { useState, ImgHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import { ImageOff, Loader2 } from 'lucide-react';

export interface ImageContainerProps extends ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: '1:1' | '4:3' | '16:9' | '3:2' | '2:3' | 'auto';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  caption?: string;
  fallbackTitle?: string;
  showOverlay?: boolean;
  overlayText?: string;
}

export const ImageContainer: React.FC<ImageContainerProps> = ({
  src,
  alt,
  aspectRatio = '3:2',
  objectFit = 'cover',
  caption,
  fallbackTitle = 'Image unavailable',
  showOverlay = false,
  overlayText,
  className,
  loading = 'lazy',
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const aspectClasses: Record<string, string> = {
    '1:1': 'aspect-square',
    '4:3': 'aspect-[4/3]',
    '16:9': 'aspect-video',
    '3:2': 'aspect-[3/2]',
    '2:3': 'aspect-[2/3]',
    'auto': 'aspect-auto',
  };

  const objectFitClasses: Record<string, string> = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
  };

  return (
    <figure className="group flex flex-col w-full">
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-frame bg-cream border border-sage-200/80 shadow-subtle',
          aspectClasses[aspectRatio],
          className
        )}
      >
        {/* Loading Spinner / Skeleton Overlay */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-cream-100/90 animate-pulse">
            <Loader2 className="w-8 h-8 text-sage animate-spin" />
          </div>
        )}

        {/* Error Fallback */}
        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-sage-50 text-navy-600 text-center">
            <ImageOff className="w-8 h-8 text-navy-400 mb-2" />
            <span className="text-small font-semibold">{fallbackTitle}</span>
            <span className="text-caption text-navy-400 mt-0.5">{alt || 'Photo preview'}</span>
          </div>
        ) : (
          <img
            src={src}
            alt={alt}
            loading={loading}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            className={cn(
              'w-full h-full transition-transform duration-500 group-hover:scale-105',
              objectFitClasses[objectFit],
              isLoading ? 'opacity-0' : 'opacity-100'
            )}
            {...props}
          />
        )}

        {/* Optional Hover Overlay */}
        {showOverlay && !hasError && !isLoading && (
          <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 text-cream">
            <span className="text-small font-medium font-display tracking-wide">{overlayText || alt}</span>
          </div>
        )}
      </div>

      {caption && (
        <figcaption className="mt-2 text-caption text-navy-600 italic px-1">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};
