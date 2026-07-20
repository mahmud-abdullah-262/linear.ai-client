'use client';

/**
 * PageTransition.tsx
 * Client-side wrapper used by Server Component layout to apply
 * the per-page entry animation without converting layout.tsx to a Client Component.
 */

import React from 'react';
import { PageTransitionWrapper } from '@/components/shared/MotionWrapper';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <PageTransitionWrapper className="flex flex-col flex-1 min-h-0">
      {children}
    </PageTransitionWrapper>
  );
}
