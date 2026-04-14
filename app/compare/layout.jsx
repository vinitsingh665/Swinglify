export const metadata = {
  title: 'Stock Comparison Tool — Compare Stocks Side-by-Side',
  description: 'Use our free stock comparison tool to compare multiple Indian stocks side-by-side. Analyze performance, technical indicators, and make the best stock comparisons for your portfolio.',
  keywords: [
    'stock comparison',
    'stock compare tool',
    'stock comparisons',
    'stock comparison tool',
    'stock comparison chart',
    'stock broker comparison india',
    'stock broker comparison',
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
