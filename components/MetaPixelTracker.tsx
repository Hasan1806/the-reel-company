'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function MetaPixelTracker() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // The initial page load already fires `fbq('track', 'PageView')` from the base script.
    // We only fire for subsequent client-side route changes.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'PageView');
    }
  }, [pathname]);

  return null;
}
