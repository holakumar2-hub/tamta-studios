import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TAMTA Studios — Stories become experiences',
  description: 'A cinematic creative studio for films, advertising, photography and visual experiences.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
