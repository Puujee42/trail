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
  title: 'МСДТ - Сайн Дурын Төв',
  description: 'Монголын ирээдүйг гэрэлтэй болгоорой',
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