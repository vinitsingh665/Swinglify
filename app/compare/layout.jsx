export const metadata = {
  title: 'Stock Comparison Tool — Compare Stocks Side-by-Side',
  description: 'Use our free stock comparison tool to compare multiple Indian stocks side-by-side. Analyze performance, technical indicators, and make the best stock comparisons for your portfolio.',
  keywords: [
    'stock comparison tool india',
    'compare nse stocks side by side',
    'stock compare tool',
    'compare share price and rsi',
    'peer comparison indian stocks',
    'technical stock comparison nse bse',
    'compare stock returns india',
    'best stocks to buy comparison',
  ],
  alternates: { canonical: 'https://swinglify.online/compare' },
  openGraph: {
    title: 'Side-by-Side Stock Comparison Tool — Swinglify',
    description: 'Use our free stock comparison tool to analyze and compare multiple Indian stocks in real-time.',
    url: 'https://swinglify.online/compare',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Swinglify Stock Comparison Tool' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Side-by-Side Stock Comparison Tool — Swinglify',
    description: 'Use our free stock comparison tool to analyze and compare multiple Indian stocks in real-time.',
    images: ['/og-image.png'],
  },
};

export default function CompareLayout({ children }) {
  return children;
}
