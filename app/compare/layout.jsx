export const metadata = {
  title: 'Compare Stocks — Side-by-Side Technical Analysis NSE & BSE',
  description: 'Compare multiple Indian stocks side-by-side. Analyze price changes, RSI, volume profiles, and signals for up to 4 stocks on Swinglify.',
  keywords: [
    'compare stocks india',
    'stock comparison tool nse',
    'side-by-side analysis stocks',
    'compare nse share prices',
    'rsi comparison india',
    'stock performance comparison tool',
    'best stocks to buy comparison',
    'sector peer comparison india',
    'multi stock analyzer nse',
    'share market comparison app',
  ],
  alternates: { canonical: 'https://swinglify.online/compare' },
  openGraph: {
    title: 'Side-by-Side Stock Comparison — Swinglify',
    description: 'Analyze and compare multiple Indian stocks in real-time.',
    url: 'https://swinglify.online/compare',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Swinglify Stock Comparison' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Side-by-Side Stock Comparison — Swinglify',
    description: 'Analyze and compare multiple Indian stocks in real-time.',
    images: ['/og-image.png'],
  },
};

export default function CompareLayout({ children }) {
  return children;
}
