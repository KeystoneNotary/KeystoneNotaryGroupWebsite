import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mobile Notary Services | Lehigh Valley PA | Keystone Notary Group',
  description: 'Professional mobile notary services in Lehigh Valley, PA. We travel to you for real estate closings, estate planning, business documents. Licensed, bonded, insured. Call (267) 309-9000.',
  keywords: ['mobile notary', 'notary public', 'Lehigh Valley', 'Pennsylvania', 'notary services', 'loan signing', 'estate planning', 'real estate closing'],
  authors: [{ name: 'Keystone Notary Group LLC' }],
  openGraph: {
    title: 'Mobile Notary Services | Keystone Notary Group',
    description: 'Professional mobile notary services in Lehigh Valley, PA. Licensed, bonded, and insured. Same-day appointments available.',
    url: 'https://keystonenotarygroup.com',
    siteName: 'Keystone Notary Group',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Keystone Notary Group - Mobile Notary Services',
    description: 'Professional mobile notary services in Lehigh Valley, PA',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Notary',
  name: 'Keystone Notary Group LLC',
  telephone: '(267) 309-9000',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Lehigh Valley',
    addressRegion: 'PA',
    addressCountry: 'US',
  },
  areaServed: [
    { '@type': 'State', name: 'Pennsylvania' },
  ],
  priceRange: '$$',
  url: 'https://keystonenotarygroup.com',
  description: 'Professional mobile notary services serving Pennsylvania, based in Hellertown (Lehigh Valley). Licensed, bonded, and insured.',
  serviceType: ['Notary Public', 'Mobile Notary', 'Loan Signing', 'Estate Planning', 'Real Estate Closing'],
};
