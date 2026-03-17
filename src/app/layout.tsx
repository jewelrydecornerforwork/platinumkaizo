import type { Metadata, Viewport } from 'next';
import { SidebarProvider } from '@/components/providers/SidebarProvider';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import '@/globals.css';

export const metadata: Metadata = {
  title: 'Platinum Kaizo 数字化作战指挥系统',
  description: '为顶尖训练家定制的硬核数据支持',
  keywords: ['宝可梦', '白金改版', '战术', '图鉴', '伤害计算'],
  authors: [{ name: '白金改版社区' }],
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
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#020617" />
      </head>
      <body className="bg-slate-950 text-slate-100">
        <SidebarProvider>
          <Header />

          <div className="flex h-screen pt-16 md:pt-0">
            <Sidebar />

            <main className="ml-0 flex-1 overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 md:ml-sidebar">
              <div className="min-h-full">{children}</div>
            </main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
