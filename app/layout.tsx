import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TAMTA Studios — Stories, engineered as experiences.",
  description: "A cinematic creative studio for films, advertising, photography and visual experiences.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}