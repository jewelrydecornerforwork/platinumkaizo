import type { Metadata } from 'next';
import { SidebarProvider } from '@/components/providers/SidebarProvider';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import '@/globals.css';

export const metadata: Metadata = {
  title: 'Platinum Kaizo Wiki',
  description: 'A comprehensive guide for Pokemon Platinum Kaizo challenge',
  keywords: ['Pokemon', 'Platinum', 'Kaizo', 'Wiki', 'Guide'],
  authors: [{ name: 'Platinum Kaizo Community' }],
  viewport: 'width=device-width, initial-scale=1.0',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps): React.ReactElement {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#030712" />
      </head>
      <body className="bg-slate-950 text-slate-100">
        <SidebarProvider>
          {/* Mobile Header */}
          <Header />

          {/* Layout Container */}
          <div className="flex h-screen pt-16 md:pt-0">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 ml-0 md:ml-sidebar">
              <div className="min-h-full">
                {children}
              </div>
            </main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
