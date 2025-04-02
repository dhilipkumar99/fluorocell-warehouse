import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/ui/Navbar';
import { SessionProvider } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'FluoroCell Warehouse - Data Transfer Platform',
  description: 'Upload and receive your image labels with ease.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <Navbar />
          <main className="min-h-screen bg-gray-50 py-6">
            {children}
          </main>
          <footer className="bg-white border-t py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} FluoroCell. All rights reserved.
              </p>
            </div>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}