import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const playfair = localFont({
  variable: "--font-playfair",
  src: [
    {
      path: playfairWoff2,
      path: "./fonts/playfair-display-variable.woff2",
      style: "normal",
    },
  ],
  display: "swap",
});

const inter = localFont({
  variable: "--font-inter",
  src: [
    {
      path: interWoff2,
      weight: "100 900",
      path: "./fonts/inter-variable.woff2",
    },
  ],
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
