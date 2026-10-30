import React from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message,
  fullScreen = true,
  className = '',
}) => {
  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-warm-50/95 backdrop-blur-sm'
    : 'w-full py-16 flex flex-col items-center justify-center bg-transparent';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`${containerClasses} ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center text-center px-4">
        {/* Animated Emblem / Spinner */}
        <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
          {/* Outer glowing ring */}
          <div className="absolute inset-0 rounded-full border-2 border-saffron-100 opacity-60" />
          
          {/* Spinning saffron ring */}
          <motion.div
            className="w-16 h-16 rounded-full border-3 border-transparent border-t-saffron-600 border-r-saffron-500 border-b-saffron-200"
            style={{ borderWidth: '3px' }}
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 1.1,
              ease: 'linear',
            }}
          />

          {/* Inner counter-rotating green ring */}
          <motion.div
            className="absolute w-10 h-10 rounded-full border-2 border-transparent border-t-emerald-600 border-l-emerald-500"
            animate={{ rotate: -360 }}
            transition={{
              repeat: Infinity,
              duration: 1.6,
              ease: 'linear',
            }}
          />

          {/* Center core pulse dot */}
          <motion.div
            className="w-3 h-3 rounded-full bg-saffron-600"
            animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.7, 1, 0.7] }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: 'easeInOut',
            }}
          />
        </div>

        {/* Leader Name */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="space-y-1.5"
        >
          <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-wide text-charcoal-950">
            Bala Bhegade
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-saffron-500 via-warm-100 to-green-600 mx-auto rounded-full" />
          <p className="text-xs uppercase tracking-widest text-charcoal-600 font-semibold pt-1">
            {message || 'Dedicated to Public Service'}
          </p>
        </motion.div>

        {/* Screen reader only live announcement */}
        <span className="sr-only">Loading, please wait...</span>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
