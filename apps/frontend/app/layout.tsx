import '../styles/globals.css';
import type { Metadata } from 'next';
import { ConditionalLayout } from '../components/layout/ConditionalLayout';

export const metadata: Metadata = {
  title: 'Gentong Mas ERP',
  description: 'Enterprise Resource Planning — Gentong Mas',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen antialiased">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
