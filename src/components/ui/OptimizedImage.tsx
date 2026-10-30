import React, { useState, useEffect } from 'react';
import { ImageOff } from 'lucide-react';

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: '16/9' | '4/3' | '1/1' | '3/4' | '21/9' | string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  containerClassName?: string;
  fallbackSrc?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  aspectRatio,
  objectFit = 'cover',
  objectPosition = 'center',
  containerClassName = 'w-full h-full',
  fallbackSrc,
  loading = 'lazy',
  decoding = 'async',
  onLoad,
  onError,
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(!src);

  // Reset state if src changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(!src);
  }, [src]);

  // Determine aspectRatio style or class
  const getAspectStyle = (): React.CSSProperties | undefined => {
    if (!aspectRatio) return undefined;
    if (aspectRatio.includes('/')) {
      const [w, h] = aspectRatio.split('/');
      return { aspectRatio: `${w} / ${h}` };
    }
    return { aspectRatio };
  };

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.(e);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (fallbackSrc && src !== fallbackSrc) {
      // try fallback if provided
      const target = e.currentTarget;
      target.src = fallbackSrc;
      return;
    }
    setHasError(true);
    setIsLoaded(false);
    onError?.(e);
  };

  return (
    <div
      className={`relative overflow-hidden bg-charcoal-100 ${containerClassName}`}
      style={getAspectStyle()}
    >
      {/* Skeleton / Shimmer background while image is loading */}
      {!isLoaded && !hasError && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-charcoal-100 via-charcoal-200/50 to-charcoal-100 animate-pulse"
          aria-hidden="true"
        />
      )}

      {/* Error Fallback Gradient View */}
      {hasError ? (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-charcoal-100 via-warm-100 to-saffron-50/40 p-4 text-center text-charcoal-500"
          role="img"
          aria-label={alt || 'Image failed to load'}
        >
          <div className="rounded-full bg-charcoal-200/70 p-3 mb-2 text-charcoal-400">
            <ImageOff className="h-6 w-6 stroke-[1.75]" />
          </div>
          <span className="text-xs font-medium text-charcoal-500 line-clamp-2 max-w-[85%]">
            {alt || 'Image unavailable'}
          </span>
        </div>
      ) : (
        /* The actual image */
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding={decoding}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            objectFit,
            objectPosition,
          }}
          className={`w-full h-full transition-all duration-500 ease-out ${
            isLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-sm scale-105'
          } ${className}`}
          {...rest}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
