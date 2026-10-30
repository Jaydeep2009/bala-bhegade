import React, { useState } from 'react';
import { Info, X } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

export interface DevModeBannerProps {
  className?: string;
}

export const DevModeBanner: React.FC<DevModeBannerProps> = ({ className = '' }) => {
  // If Supabase is configured, do not show the banner
  if (isSupabaseConfigured) {
    return null;
  }

  const [dismissed, setDismissed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('bb-dev-banner-dismissed') === 'true';
    }
    return false;
  });

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('bb-dev-banner-dismissed', 'true');
    }
  };

  if (dismissed) {
    return null;
  }

  return (
    <aside
      role="status"
      aria-label="Development environment preview"
      className={`relative z-50 w-full bg-gradient-to-r from-saffron-50 via-warm-100 to-saffron-50 border-b border-saffron-200 px-4 py-1.5 text-xs text-saffron-950 shadow-xs transition-all ${className}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 shrink-0 text-saffron-600" aria-hidden="true" />
          <p className="font-medium">
            <span className="font-semibold text-saffron-900">Development Preview</span>
            <span className="mx-1.5 text-saffron-400">—</span>
            <span>Using placeholder data</span>
          </p>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          className="rounded p-0.5 text-saffron-800 hover:bg-saffron-200/70 hover:text-saffron-950 focus:outline-none focus:ring-1 focus:ring-saffron-500 transition-colors"
          aria-label="Dismiss development mode notice"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </aside>
  );
};

export default DevModeBanner;
