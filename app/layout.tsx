import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Atatürk ile Röportaj',
  description: 'Kurtuluş Savaşı dönemi hakkında Atatürk ile sohbet edin.',
  openGraph: {
    title: 'Atatürk ile Röportaj',
    description: 'Kurtuluş Savaşı dönemi hakkında Atatürk ile sohbet edin.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Atatürk ile Röportaj',
    description: 'Kurtuluş Savaşı dönemi hakkında Atatürk ile sohbet edin.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="tr">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
