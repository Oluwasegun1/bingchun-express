import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/context/StoreContext';
import NotificationToast from '@/components/NotificationToast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Bing Chun Express — Order ahead, pick up faster',
  description:
    'Explore the Bing Chun menu, order ahead and pick up your milk tea, fruit tea, milkshakes and ice cream with less waiting. Unofficial product concept.',
};

export const viewport: Viewport = {
  themeColor: '#0C5CC4',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body suppressHydrationWarning className="min-h-screen bg-canvas text-ink font-sans flex flex-col">
        <StoreProvider>
          {children}
          <NotificationToast />
        </StoreProvider>
      </body>
    </html>
  );
}
