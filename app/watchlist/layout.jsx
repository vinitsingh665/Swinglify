export const metadata = {
  title: 'Watchlist — Track Your Favourite NSE & BSE Stocks',
  description: 'Create a free stock watchlist for NSE & BSE. Track your favourite Indian stocks with live prices, changes, and quick access to analysis.',
  keywords: [
    'stock watchlist india',
    'nse stock watchlist',
    'free stock watchlist app',
    'track stocks india',
    'favourite stocks list nse',
    'bse watchlist free',
    'my stock watchlist india',
    'create stock watchlist online',
    'multiple watchlist stocks india',
    'stock tracking app nse bse free',
    'share market watchlist today',
    'best stock watchlist india 2026',
    'monitor stocks online india',
    'stock comparison watchlist nse',
    'sector watchlist india free',
  ],
  alternates: { canonical: 'https://swinglify.online/watchlist' },
  openGraph: {
    title: 'Free Stock Watchlist for NSE & BSE — Swinglify',
    description: 'Create and manage your stock watchlist with live prices for Indian markets.',
    url: 'https://swinglify.online/watchlist',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Swinglify Stock Watchlist' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Stock Watchlist for NSE & BSE — Swinglify',
    description: 'Create and manage your stock watchlist with live prices for Indian markets.',
    images: ['/og-image.png'],
  },
};

export default function WatchlistLayout({ children }) {
  return children;
}
