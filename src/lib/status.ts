import { OrderStatus } from '@/types';

/** Customer-facing status labels and badge styles, shared by account, tracking and staff views. */
export const STATUS_META: Record<OrderStatus, { label: string; badge: string }> = {
  received: { label: 'Received', badge: 'bg-brand-50 text-brand-dark' },
  confirmed: { label: 'Confirmed', badge: 'bg-brand-100 text-brand-dark' },
  preparing: { label: 'Preparing', badge: 'bg-warn-soft text-warn' },
  ready: { label: 'Ready for pickup', badge: 'bg-success-soft text-success' },
  collected: { label: 'Collected', badge: 'bg-canvas text-muted' },
  cancelled: { label: 'Cancelled', badge: 'bg-danger-soft text-danger' },
};

export const TIMELINE: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'received', label: 'Order received', desc: 'Your order is in the branch queue.' },
  { status: 'confirmed', label: 'Confirmed by store', desc: 'The team has accepted your order.' },
  { status: 'preparing', label: 'Preparing', desc: 'Your drinks are being made fresh.' },
  { status: 'ready', label: 'Ready for pickup', desc: 'Head to the express pickup point.' },
  { status: 'collected', label: 'Collected', desc: 'Enjoy your Bing Chun!' },
];

export const STATUS_ORDER: OrderStatus[] = ['received', 'confirmed', 'preparing', 'ready', 'collected'];
