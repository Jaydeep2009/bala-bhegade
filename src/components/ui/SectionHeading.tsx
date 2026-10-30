import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export interface SectionHeadingProps {
  title: string;
  subtitle?: string | null;
  badge?: string;
  align?: 'left' | 'center' | 'right';
  light?: boolean;
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  badge,
  align = 'center',
  light = false,
  className = '',
}: SectionHeadingProps) {
  const shouldReduceMotion = useReducedMotion();

  const alignmentClass = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }[align];

  // If user prefers reduced motion, disable transforms
  const containerVariants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const titleMaskVariants = {
    hidden: { y: shouldReduceMotion ? '0%' : '115%', opacity: shouldReduceMotion ? 1 : 0 },
    visible: {
      y: '0%',
      opacity: 1,
      transition: {
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const lineVariants = {
    hidden: { scaleX: shouldReduceMotion ? 1 : 0, opacity: shouldReduceMotion ? 1 : 0 },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: {
        duration: 0.65,
        delay: 0.15,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={`flex flex-col mb-10 md:mb-14 ${alignmentClass} ${className}`}
    >
      {badge && (
        <motion.span
          variants={itemVariants}
          className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 ${
            light
              ? 'bg-white/10 text-saffron-300 border border-saffron-400/30'
              : 'bg-saffron-50 text-saffron-700 border border-saffron-200/80 shadow-xs'
          }`}
        >
          {badge}
        </motion.span>
      )}

      {/* Cinematic Masked Title Reveal */}
      <div className={`overflow-hidden py-1 w-full flex ${alignmentClass}`}>
        <motion.h2
          variants={titleMaskVariants}
          className={`font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance ${
            light ? 'text-white' : 'text-charcoal-900'
          }`}
        >
          {title}
        </motion.h2>
      </div>

      {/* BJP Tri-Color Inspired Accent Divider */}
      <motion.div
        variants={lineVariants}
        style={{ transformOrigin: align === 'center' ? 'center' : align === 'right' ? 'right' : 'left' }}
        className={`flex items-center gap-1.5 mt-4 ${
          align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : ''
        }`}
      >
        <div className={`w-12 h-1 rounded-full ${light ? 'bg-saffron-400' : 'bg-saffron-500'}`} />
        <div className={`w-3 h-1 rounded-full ${light ? 'bg-white' : 'bg-charcoal-300'}`} />
        <div className={`w-3 h-1 rounded-full ${light ? 'bg-green-400' : 'bg-green-600'}`} />
      </motion.div>

      {subtitle && (
        <motion.p
          variants={itemVariants}
          className={`mt-4 max-w-2xl text-base sm:text-lg leading-relaxed ${
            light ? 'text-warmWhite-300' : 'text-charcoal-600'
          }`}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}

export default SectionHeading;
