'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function ConditionalChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  // Admin area: no header, no footer — just the raw page content
  if (isAdmin) {
    return <>{children}</>;
  }

  // Public site: normal header + main + footer
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}