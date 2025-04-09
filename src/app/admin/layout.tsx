import React from 'react';
import { Inter } from 'next/font/google';
import '../globals.css';
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { registerGlobalImageErrorHandler } from '@/lib/image-fix';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Admin Dashboard | Thai Massage',
  description: 'Thai Massage Service Admin Dashboard',
};

// Create admin layout that doesn't depend on internationalization
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Global image error handling
              window.addEventListener('error', function(event) {
                if (event.target instanceof HTMLImageElement) {
                  const img = event.target;
                  // Check if it's a known problematic URL pattern
                  if (!img.src.includes('placeholder-therapist.jpg') && 
                      (img.src.includes('/_next/image') || 
                       img.src.includes('/uploads/therapists') || 
                       img.naturalWidth === 0)) {
                    console.warn('Admin image load failed, using placeholder image:', img.src);
                    img.src = '/images/placeholder-therapist.jpg';
                    img.onerror = null;
                  }
                }
              }, true);
              
              // Disable locale path auto-redirect
              window.__DISABLE_LOCALE_REDIRECT = true;
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <AdminLayoutClient>{children}</AdminLayoutClient>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
