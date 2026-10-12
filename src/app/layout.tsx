import type { Metadata, Viewport } from 'next';
import { Inter, Baloo_2 } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/context/StoreContext';
import NotificationToast from '@/components/NotificationToast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const baloo2 = Baloo_2({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-baloo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Bing Chun Express — Nigeria Pre-Order & Express Pickup',
  description: 'Skip the counter queue. Fresh fruit tea, bubble milk tea, milkshakes, and soft-serve ice cream made to order across Lagos branches.',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#0C5CC4',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${baloo2.variable} antialiased`}>
      <body className="min-h-screen bg-[#F4F8FD] text-[#12233F] font-sans flex flex-col selection:bg-[#0C5CC4] selection:text-white">
        <StoreProvider>
          {children}
          <NotificationToast />
        </StoreProvider>
      </body>
    </html>
  );
}
