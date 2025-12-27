import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Base metadata - more specific metadata in page.tsx via metadata.ts
export const metadata: Metadata = {
  title: {
    template: "%s | Keystone Notary Group",
    default: "Keystone Notary Group | Executive Notary Services",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${inter.variable} antialiased bg-charcoal text-platinum`}
      >
        {children}
      </body>
    </html>
  );
}
