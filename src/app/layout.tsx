import type { Metadata, Viewport } from 'next';
import { SidebarProvider } from '@/components/providers/SidebarProvider';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { TacticalFooter } from '@/components/layout/TacticalFooter';
import '@/globals.css';

export const metadata: Metadata = {
  title: 'Platinum Kaizo Tactical Command Grid',
  description: 'Hardcore tactical intelligence support for elite trainers.',
  keywords: ['Pokemon', 'Platinum Kaizo', 'tactical intel', 'pokedex', 'damage calc'],
  authors: [{ name: 'Platinum Kaizo Intelligence Network' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): React.ReactElement {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#020617" />
      </head>
      <body className="bg-slate-950 text-slate-100">
        <SidebarProvider>
          <Header />

          <div className="flex h-screen">
            <Sidebar />

            <main className="ml-0 flex-1 overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 md:ml-sidebar">
              <div className="flex min-h-full flex-col">
                <div className="flex-1">{children}</div>
                <TacticalFooter />
              </div>
            </main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
