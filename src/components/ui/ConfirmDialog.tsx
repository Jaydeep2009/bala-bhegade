import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, AlertCircle, X, Loader2 } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmText?: string;
  cancelLabel?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
  isDestructive?: boolean;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  confirmText,
  cancelLabel,
  cancelText,
  variant,
  isDestructive,
  isLoading = false,
}) => {
  const [internalLoading, setInternalLoading] = useState(false);
  const effectiveLoading = isLoading || internalLoading;

  const effectiveVariant = variant || (isDestructive ? 'danger' : 'warning');
  const defaultConfirmLabel = confirmLabel || confirmText || (effectiveVariant === 'danger' ? 'Delete' : 'Confirm');
  const effectiveCancelLabel = cancelLabel || cancelText || 'Cancel';

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !effectiveLoading) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, effectiveLoading, onClose]);

  const handleConfirm = async () => {
    try {
      setInternalLoading(true);
      await onConfirm();
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={effectiveLoading ? undefined : onClose}
            className="fixed inset-0 bg-charcoal-950/60 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Dialog Modal Container */}
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-desc"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg rounded-xl border border-charcoal-200 bg-white p-6 shadow-xl z-10"
          >
            {/* Close button (top right) */}
            <button
              type="button"
              onClick={onClose}
              disabled={effectiveLoading}
              className="absolute top-4 right-4 rounded-md p-1.5 text-charcoal-400 hover:text-charcoal-600 hover:bg-charcoal-100 transition-colors disabled:opacity-50"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-start gap-4">
              {/* Icon */}
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                  variant === 'danger'
                    ? 'bg-red-50 text-red-600 border border-red-200'
                    : 'bg-amber-50 text-amber-600 border border-amber-200'
                }`}
              >
                {variant === 'danger' ? (
                  <AlertCircle className="h-6 w-6 stroke-[2]" />
                ) : (
                  <AlertTriangle className="h-6 w-6 stroke-[2]" />
                )}
              </div>

              {/* Text content */}
              <div className="flex-1 pr-6">
                <h3
                  id="confirm-dialog-title"
                  className="font-heading text-lg sm:text-xl font-bold text-charcoal-900"
                >
                  {title}
                </h3>
                <p
                  id="confirm-dialog-desc"
                  className="mt-2 text-sm text-charcoal-600 leading-relaxed"
                >
                  {message}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={effectiveLoading}
                className="btn-secondary w-full sm:w-auto"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={effectiveLoading}
                className={`w-full sm:w-auto ${
                  variant === 'danger' ? 'btn-danger' : 'btn-gold'
                } inline-flex items-center justify-center gap-2`}
              >
                {effectiveLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>{defaultConfirmLabel}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
