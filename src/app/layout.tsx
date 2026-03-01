import { Metadata } from 'next';

import './globals.css';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/providers/theme-provider';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'BRScans - Leia seus mangás e manhwas favoritos',
    template: `%s - BRScans`,
  },
  description:
    'Explore uma vasta coleção de mangás e manhwas em português. Leia os últimos capítulos de suas séries favoritas em alta qualidade na BRScans.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    siteName: 'BRScans',
    locale: 'pt_BR',
    type: 'website',
  },
};

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <Header />

          <div className="min-h-[calc(100vh-160px)]">{children}</div>

          <Footer />

          <Toaster position="bottom-center" />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

export const experimental_ppr = true;

export default RootLayout;
