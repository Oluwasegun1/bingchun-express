'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function NotificationToast() {
  const { notification } = useStore();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4" role="status" aria-live="polite">
      {notification && (
        <div className="anim-up pointer-events-auto flex max-w-md items-center gap-3 rounded-ctl bg-ink px-4 py-3 text-white shadow-pop">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-300" aria-hidden />
          <p className="text-sm font-medium leading-snug">{notification}</p>
        </div>
      )}
    </div>
  );
}
