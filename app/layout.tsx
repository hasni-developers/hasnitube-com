import './globals.css';
import type { Metadata } from 'next';
import { Inter, Noto_Sans_Arabic } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { LanguageProvider } from '@/components/providers/language-provider';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { HeaderAd } from '@/components/ads/google-adsense';
import { Toaster } from '@/components/ui/sonner';
import Script from 'next/script';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const notoSansArabic = Noto_Sans_Arabic({ 
  subsets: ['arabic'],
  variable: '--font-arabic',
});

export const metadata: Metadata = {
  title: 'HasniTube - Latest Breaking News & Updates',
  description: 'Stay updated with the latest breaking news, politics, technology, and world events. Available in English and Urdu.',
  keywords: 'news, breaking news, politics, technology, world news, latest updates, HasniTube',
  authors: [{ name: 'Hasni Tube Team' }],
  openGraph: {
    title: 'HasniTube - Latest Breaking News & Updates',
    description: 'Stay updated with the latest breaking news, politics, technology, and world events.',
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'ur_PK',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HasniTube - Latest Breaking News & Updates',
    description: 'Stay updated with the latest breaking news, politics, technology, and world events.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google AdSense */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.variable} ${notoSansArabic.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <LanguageProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <HeaderAd />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}