import { Metadata } from 'next';

import './globals.css';

import Header from '@/components/Header';
import { Toaster } from '@/components/ui/sonner';
import { SWRProvider } from '@/providers/swr-provider';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: `Página Incial - BRScans`,
  description: ``,
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <Header />

        <SWRProvider>{children}</SWRProvider>

        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
