// app/layout.tsx
import { Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ClerkProvider } from '@clerk/nextjs';
const inter = Inter({ subsets: ['latin'] });

// We can keep your project-specific metadata
export const metadata = {
  metadataBase: new URL('https://www.mongoltrail.com'),
  title: {
    default: 'Mongol Trail | Your Gateway to Adventure',
    template: '%s | Mongol Trail',
  },
  description: 'Experience the ultimate adventure with Mongol Trail. We offer premier tours across Mongolia, Europe, and the world. Book your next hiking, cultural, or overland trip today.',
  keywords: ['Mongol Trail', 'Mongolia Travel', 'Adventure Tours', 'Hiking Mongolia', 'Euro Trails', 'World Travel', 'Overland Trip'],
  authors: [{ name: 'Mongol Trail Team' }],
  creator: 'Mongol Trail',
  openGraph: {
    type: 'website',
    locale: 'mn_MN',
    url: 'https://www.mongoltrail.com',
    title: 'Mongol Trail | Your Gateway to Adventure',
    description: 'Experience the ultimate adventure with Mongol Trail. Premier tours across Mongolia and the world.',
    siteName: 'Mongol Trail',
  },
  alternates: {
    canonical: 'https://www.mongoltrail.com',
    languages: {
      'mn-MN': 'https://www.mongoltrail.com',
      'en-US': 'https://www.mongoltrail.com',
      'ko-KR': 'https://www.mongoltrail.com',
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mongol Trail | Your Gateway to Adventure',
    description: 'Experience the ultimate adventure with Mongol Trail.',
    creator: '@mongoltrail',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Mongol Trail',
    image: 'https://www.mongoltrail.com/try.png',
    url: 'https://www.mongoltrail.com',
    telephone: '+976 7766-1626',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Room 502, 5th Floor, Erkhi Center, West 4 Road',
      addressLocality: 'Ulaanbaatar',
      postalCode: '11000',
      addressCountry: 'MN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 47.9188, // Approx coordinates for Ulaanbaatar West 4 Road
      longitude: 106.9176,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    sameAs: [
      'https://www.facebook.com/profile.php?id=61580867289571',
      'https://www.instagram.com/euro.trails/',
    ],
  };

  return (
    // Clerk: Step 1 - Wrap the entire HTML content with ClerkProvider
    <ClerkProvider signInUrl="/sign-in"
      signUpUrl="/sign-up">
      <html lang="mn">
        <body className={inter.className}>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          {/* Your LanguageProvider can wrap the content inside the body */}
          <LanguageProvider>
            <Navbar />
            <main className="pt-20"> {/* pt-20 likely offsets your fixed Navbar */}
              {children}
            </main>
            <Footer />
          </LanguageProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}