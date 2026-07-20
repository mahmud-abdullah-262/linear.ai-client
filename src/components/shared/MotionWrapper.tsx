'use client';

/**
 * MotionWrapper.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Central animation utility for Linear.ai
 * All framer-motion imports are isolated here so Server Components stay clean.
 *
 * Color System:
 *   Deep Slate  → #1E293B
 *   Vibrant Cyan → #06B6D4
 *   Off-White   → #F8FAFC
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React from 'react';
import { motion, type Variants } from 'motion/react';

// ── Re-export motion so consumers don't need a direct framer-motion import ──
export { motion };

// ── Shared easing presets ────────────────────────────────────────────────────

export const ease = {
  smooth: [0.25, 0.46, 0.45, 0.94] as const,
  out: 'easeOut' as const,
  inOut: 'easeInOut' as const,
};

// ── Variant definitions ───────────────────────────────────────────────────────

/** Page-level fade + lift — wraps full page content */
export const pageVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

/** Container that staggers children in sequence */
export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

/** Individual card / child item fade + lift */
export const cardItemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

/** Section header fade-in with a slight upward drift */
export const sectionHeaderVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
};

/** Fade-in only — for modals, overlays */
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
};

/** Modal pop-in */
export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.22, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 8,
    transition: { duration: 0.15, ease: 'easeInOut' },
  },
};

// ── Interaction presets ───────────────────────────────────────────────────────

/** Primary action button micro-interaction */
export const primaryButtonMotion = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.97 },
  transition: { duration: 0.15, ease: 'easeOut' },
} as const;

/** Secondary / subtle button micro-interaction */
export const secondaryButtonMotion = {
  whileHover: { scale: 1.01 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.15, ease: 'easeOut' },
} as const;

/** Kanban task card hover */
export const taskCardMotion = {
  whileHover: { y: -3, scale: 1.01 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.2, ease: 'easeOut' },
} as const;

// ── Reusable Components ───────────────────────────────────────────────────────

/**
 * PageTransitionWrapper
 * Drop-in wrapper for page-level content (opacity + y slide).
 * Must be a Client Component; use inside Server Component pages only by
 * wrapping the *children* — not the layout itself.
 */
export function PageTransitionWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerList
 * Wraps a list container and staggers its direct children.
 */
export function StaggerList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerItem
 * A single child inside a StaggerList — inherits parent's stagger timing.
 */
export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={cardItemVariants} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * AnimatedSection
 * Viewport-triggered fade+lift — use on landing page sections.
 */
export function AnimatedSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * AnimatedCard
 * Viewport-triggered card with hover lift + subtle scale.
 */
export function AnimatedCard({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, ease: 'easeOut', delay }}
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={className}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
}

/**
 * MotionButton
 * Primary CTA with scale micro-interaction. Accepts all native button props.
 */
export function MotionButton({
  children,
  className,
  onClick,
  type = 'button',
  disabled,
  id,
  title,
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      id={id}
      title={title}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
    >
      {children}
    </motion.button>
  );
}

/**
 * CriticalPulseDot
 * Renders an opacity-pulsing dot for 'Critical' priority tags.
 */
export function CriticalPulseDot({ className }: { className?: string }) {
  return (
    <motion.span
      className={className}
      animate={{ opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}
