'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { CheckCircle2, Sparkles } from 'lucide-react';

export default function NotificationToast() {
  const { notification } = useStore();

  if (!notification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className="bg-[#12233F] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-white/10 max-w-md">
        <div className="w-8 h-8 rounded-xl bg-[#0C5CC4] flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5 text-white" />
        </div>
        <p className="text-sm font-medium leading-snug">{notification}</p>
      </div>
    </div>
  );
}
