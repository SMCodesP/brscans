import { Metadata, Viewport } from 'next';

import './globals.css';

import Footer from '@/components/footer';
import Header from '@/components/header';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/providers/auth-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { fetcher } from '@/services/api-server';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';

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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

async function RootLayout({
  children,
}: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value || null;

  let user = await fetcher<any>('auth/me').catch(() => null);

  return (
    <html lang="pt-br" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider initialUser={user} initialToken={token}>
            <Header />

            <div className="min-h-[calc(100vh-160px)]">
              {children}
            </div>

            <Footer />

            <Toaster position="bottom-center" />
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

export default RootLayout;
