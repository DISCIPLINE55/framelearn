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
          'relative w-full overflow-hidden rounded-frame bg-cream border-2 border-sage-300 shadow-subtle',
          aspectClasses[aspectRatio],
          className
        )}
      >
        {/* Loading Spinner / Skeleton Overlay */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-cream-100 animate-pulse">
            <Loader2 className="w-8 h-8 text-sage stroke-[2.5] animate-spin" />
          </div>
        )}

        {/* Error Fallback */}
        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-sage-100 text-navy-950 text-center">
            <ImageOff className="w-8 h-8 text-navy-800 mb-2 stroke-[2.5]" />
            <span className="text-small font-bold text-navy">{fallbackTitle}</span>
            <span className="text-caption font-bold text-navy-800 mt-0.5">{alt || 'Photo preview'}</span>
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
          <div className="absolute inset-0 bg-navy/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 text-cream">
            <span className="text-small font-bold font-display tracking-wide text-cream drop-shadow-md">{overlayText || alt}</span>
          </div>
        )}
      </div>

      {caption && (
        <figcaption className="mt-2 text-caption font-bold text-navy-900 italic px-1">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};
