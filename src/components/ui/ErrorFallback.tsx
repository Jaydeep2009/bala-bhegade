import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export interface ErrorFallbackProps {
  title?: string;
  message?: string;
  error?: Error | null;
  onRetry?: () => void;
  fullScreen?: boolean;
  showDetails?: boolean;
  className?: string;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while loading this section. Please try again.',
  error,
  onRetry,
  fullScreen = false,
  showDetails = process.env.NODE_ENV === 'development',
  className = '',
}) => {
  const containerClasses = fullScreen
    ? 'min-h-[70vh] flex items-center justify-center p-6 bg-ivory-50/50'
    : 'w-full py-12 px-4 flex items-center justify-center';

  return (
    <div className={`${containerClasses} ${className}`} role="alert">
      <div className="w-full max-w-md rounded-2xl border border-charcoal-200 bg-white p-8 text-center shadow-sm">
        {/* Warning Icon Badge */}
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600 border border-amber-200">
          <AlertTriangle className="h-7 w-7 stroke-[2]" aria-hidden="true" />
        </div>

        {/* Title */}
        <h3 className="font-heading text-xl sm:text-2xl font-semibold text-charcoal-900">
          {title}
        </h3>

        {/* Message */}
        <p className="mt-2.5 text-sm text-charcoal-600 leading-relaxed">
          {message}
        </p>

        {/* Development Error Details */}
        {showDetails && error && (
          <div className="mt-4 text-left">
            <details className="rounded-lg bg-charcoal-50 p-3 text-xs text-charcoal-700 border border-charcoal-200">
              <summary className="cursor-pointer font-medium text-saffron-700 select-none">
                Technical Details
              </summary>
              <pre className="mt-2 whitespace-pre-wrap break-all font-mono text-[11px] text-charcoal-800">
                {error.name}: {error.message}
                {error.stack ? `\n\n${error.stack}` : ''}
              </pre>
            </details>
          </div>
        )}

        {/* Retry Button */}
        {onRetry && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={onRetry}
              className="btn-primary inline-flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Try Again</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorFallback;
