import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Financial Calculators | fin-calcs.com',
  description: 'Free online financial calculators for investment, mortgage, retirement, and more. Make informed financial decisions with our easy-to-use tools.',
  keywords: 'financial calculator, investment calculator, mortgage calculator, retirement calculator, compound interest',
  metadataBase: new URL('https://fin-calcs.com'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
