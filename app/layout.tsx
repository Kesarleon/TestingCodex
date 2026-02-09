import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Location Intelligence Core',
  description: 'Starter product con arquitectura hexagonal para análisis geoespacial empresarial',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
