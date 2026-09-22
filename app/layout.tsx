import type { Metadata, Viewport } from 'next';
import './globals.css';
import ConditionalChrome from '@/components/layout/ConditionalChrome';
import Scripts from '@/components/layout/Scripts';

export const metadata: Metadata = {
  metadataBase: new URL('https://seasouthsudan.org'),
  title: {
    default: 'Sudd Environment Agency | Protecting Nature, Empowering Communities',
    template: '%s | Sudd Environment Agency',
  },
  description:
    'Sudd Environment Agency (SEA) is a national NGO advocating for wetlands protection, climate action, wildlife conservation, agroforestry, and humanitarian response in South Sudan.',
  keywords: [
    'Sudd Environment Agency',
    'SEA',
    'South Sudan',
    'environment',
    'climate change',
    'wildlife',
    'Sudd wetlands',
    'conservation',
    'NGO',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://seasouthsudan.org',
    siteName: 'Sudd Environment Agency',
    title: 'Sudd Environment Agency | Protecting Nature, Empowering Communities',
    description:
      'Advocating for wetlands protection, climate resilience, wildlife conservation, and sustainable livelihoods across South Sudan.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sudd Environment Agency',
    description: 'Protecting Nature, Empowering Communities.',
  },
  icons: {
  icon: '/favicon.ico?v=2',
  shortcut: '/favicon.ico?v=2',
  apple: '/apple-icon.png?v=2',
},
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#06283D',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500&family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body>
        <ConditionalChrome>{children}</ConditionalChrome>
        <Scripts />
      </body>
    </html>
  );
}