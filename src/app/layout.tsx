import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'JKAnime FLV - Ver Anime Online Gratis en HD',
  description: 'Ver anime online gratis en HD en JKAnime FLV. La mejor plataforma para disfrutar series y películas anime con subtítulos en español, latino y castellano.',
  keywords: 'jkanime, animeflv, jkanimeflv, anime online, ver anime gratis, anime HD, subtítulos español, anime latino, anime castellano, streaming anime',
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const websiteStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'JKAnime FLV',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://jkanimeflv.com',
    description: 'Ver anime online gratis en HD. La mejor plataforma para disfrutar series y películas anime con subtítulos en español.',
    inLanguage: 'es',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://jkanimeflv.com'}/buscar?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}