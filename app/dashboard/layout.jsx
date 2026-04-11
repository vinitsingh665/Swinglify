export const metadata = {
  title: 'Dashboard — Swinglify Swing Trading App',
  description: 'Manage your swing trading portfolio, access live screeners, and monitor trade signals on the Swinglify dashboard for NSE & BSE.',
  alternates: { canonical: 'https://swinglify.online/dashboard' },
  openGraph: {
    title: 'Swing Trading Dashboard — Swinglify',
    description: 'Manage your swing trading portfolio and monitor trade signals for Indian stocks.',
    url: 'https://swinglify.online/dashboard',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Swinglify Trading Dashboard' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Swing Trading Dashboard — Swinglify',
    description: 'Manage your swing trading portfolio and monitor trade signals for Indian stocks.',
    images: ['/og-image.png'],
  },
};

export default function DashboardLayout({ children }) {
  return (
    <>
      {children}
    </>
  );
}
