import React from 'react';

// Base pulse block
export interface BaseSkeletonProps {
  className?: string;
}

export const BaseSkeleton: React.FC<BaseSkeletonProps> = ({ className = '' }) => (
  <div
    className={`animate-pulse rounded bg-charcoal-200/80 ${className}`}
    aria-hidden="true"
  />
);

// 1. Text Skeleton
export interface TextSkeletonProps {
  lines?: number;
  className?: string;
  lineClassName?: string;
  lastLineWidth?: string;
}

export const TextSkeleton: React.FC<TextSkeletonProps> = ({
  lines = 3,
  className = '',
  lineClassName = 'h-4',
  lastLineWidth = '65%',
}) => {
  return (
    <div className={`space-y-2.5 ${className}`} role="status" aria-label="Loading text content">
      {Array.from({ length: lines }).map((_, index) => {
        const isLast = index === lines - 1 && lines > 1;
        return (
          <div
            key={index}
            className={`animate-pulse rounded bg-charcoal-200/80 ${lineClassName}`}
            style={{ width: isLast ? lastLineWidth : '100%' }}
          />
        );
      })}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// 2. Image Skeleton
export interface ImageSkeletonProps {
  className?: string;
  aspectRatio?: 'video' | 'square' | 'portrait' | 'wide' | string;
  rounded?: string;
}

export const ImageSkeleton: React.FC<ImageSkeletonProps> = ({
  className = '',
  aspectRatio = 'video',
  rounded = 'rounded-lg',
}) => {
  const aspectClass =
    aspectRatio === 'video'
      ? 'aspect-video'
      : aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'portrait'
      ? 'aspect-[3/4]'
      : aspectRatio === 'wide'
      ? 'aspect-[21/9]'
      : '';

  return (
    <div
      className={`relative overflow-hidden bg-charcoal-200/80 animate-pulse ${aspectClass} ${rounded} ${className}`}
      role="status"
      aria-label="Loading image"
    >
      <div className="absolute inset-0 flex items-center justify-center text-charcoal-300">
        <svg
          className="w-10 h-10 opacity-40"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <span className="sr-only">Loading image...</span>
    </div>
  );
};

// 3. Card Skeleton
export interface CardSkeletonProps {
  className?: string;
  hasImage?: boolean;
  lines?: number;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  className = '',
  hasImage = true,
  lines = 3,
}) => {
  return (
    <div
      className={`rounded-lg border border-charcoal-200 bg-white p-4 shadow-sm space-y-4 ${className}`}
      role="status"
      aria-label="Loading card content"
    >
      {hasImage && <ImageSkeleton aspectRatio="video" rounded="rounded-md" />}
      <div className="space-y-3 pt-1">
        {/* Title placeholder */}
        <div className="h-5 w-3/4 animate-pulse rounded bg-charcoal-200/80" />
        {/* Content lines */}
        <TextSkeleton lines={lines} lineClassName="h-3.5" lastLineWidth="50%" />
      </div>
      <span className="sr-only">Loading card...</span>
    </div>
  );
};

// 4. Article Skeleton
export interface ArticleSkeletonProps {
  className?: string;
}

export const ArticleSkeleton: React.FC<ArticleSkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`max-w-4xl mx-auto space-y-6 ${className}`}
      role="status"
      aria-label="Loading article"
    >
      {/* Category & Date badge */}
      <div className="flex items-center gap-3">
        <div className="h-6 w-24 animate-pulse rounded-full bg-charcoal-200/80" />
        <div className="h-4 w-32 animate-pulse rounded bg-charcoal-200/80" />
      </div>

      {/* Headline */}
      <div className="space-y-3">
        <div className="h-8 sm:h-10 w-11/12 animate-pulse rounded-md bg-charcoal-200/80" />
        <div className="h-8 sm:h-10 w-2/3 animate-pulse rounded-md bg-charcoal-200/80" />
      </div>

      {/* Featured Image */}
      <ImageSkeleton aspectRatio="video" className="w-full my-6" rounded="rounded-xl" />

      {/* Paragraph blocks */}
      <div className="space-y-6 pt-2">
        <TextSkeleton lines={4} lineClassName="h-4" lastLineWidth="75%" />
        <TextSkeleton lines={5} lineClassName="h-4" lastLineWidth="60%" />
        <TextSkeleton lines={3} lineClassName="h-4" lastLineWidth="45%" />
      </div>

      <span className="sr-only">Loading article...</span>
    </div>
  );
};

// Main Unified Skeleton Component
export interface LoadingSkeletonProps {
  variant?: 'text' | 'card' | 'image' | 'article';
  className?: string;
  lines?: number;
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'text',
  className = '',
  lines = 3,
  count = 1,
}) => {
  const renderItem = (index: number) => {
    switch (variant) {
      case 'card':
        return <CardSkeleton key={index} className={className} lines={lines} />;
      case 'image':
        return <ImageSkeleton key={index} className={className} />;
      case 'article':
        return <ArticleSkeleton key={index} className={className} />;
      case 'text':
      default:
        return <TextSkeleton key={index} lines={lines} className={className} />;
    }
  };

  if (count > 1) {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, idx) => renderItem(idx))}
      </div>
    );
  }

  return renderItem(0);
};

export default LoadingSkeleton;
