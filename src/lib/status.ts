import { OrderStatus, IceCreamPrepStatus } from '@/types';

/** Customer-facing status labels and badge styles, shared by account, tracking and staff views. */
export const STATUS_META: Record<OrderStatus, { label: string; badge: string }> = {
  received: { label: 'Received', badge: 'bg-brand-50 text-brand-dark' },
  confirmed: { label: 'Confirmed', badge: 'bg-brand-100 text-brand-dark' },
  preparing: { label: 'Preparing', badge: 'bg-warn-soft text-warn' },
  ready: { label: 'Ready for pickup', badge: 'bg-success-soft text-success' },
  collected: { label: 'Collected', badge: 'bg-canvas text-muted' },
  cancelled: { label: 'Cancelled', badge: 'bg-danger-soft text-danger' },
};

export const ICE_CREAM_STATUS_META: Record<IceCreamPrepStatus, { label: string; badge: string; desc: string }> = {
  awaiting_arrival: {
    label: 'Awaiting Arrival',
    badge: 'bg-amber-500/15 text-amber-800 border border-amber-300 font-bold',
    desc: 'Prepaid · Prepare & scoop upon customer arrival',
  },
  preparing: {
    label: 'Preparing',
    badge: 'bg-purple-500/15 text-purple-800 border border-purple-300 font-bold',
    desc: 'Customer arrived · Scooping fresh now',
  },
  ready: {
    label: 'Ready',
    badge: 'bg-emerald-500/15 text-emerald-800 border border-emerald-300 font-bold',
    desc: 'Scooped and ready to hand over',
  },
  collected: {
    label: 'Collected',
    badge: 'bg-slate-100 text-slate-700 border border-slate-300 font-bold',
    desc: 'Handed to customer',
  },
};

export const TIMELINE: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'received', label: 'Order received', desc: 'Your order is in the branch queue.' },
  { status: 'confirmed', label: 'Confirmed by store', desc: 'The team has accepted your order.' },
  { status: 'preparing', label: 'Preparing', desc: 'Your drinks are being made fresh.' },
  { status: 'ready', label: 'Ready for pickup', desc: 'Head to the express pickup point.' },
  { status: 'collected', label: 'Collected', desc: 'Enjoy your Bing Chun!' },
];

export const STATUS_ORDER: OrderStatus[] = ['received', 'confirmed', 'preparing', 'ready', 'collected'];

