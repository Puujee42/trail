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
  return (
    // Clerk: Step 1 - Wrap the entire HTML content with ClerkProvider
    <ClerkProvider signInUrl="/sign-in"
      signUpUrl="/sign-up">
      <html lang="mn">
        <body className={inter.className}>
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