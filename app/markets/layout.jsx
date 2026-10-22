export const metadata = {
  title: 'Markets — Live NSE & BSE Stock Prices, Volume & Signals',
  description: 'Track live stock prices for NSE & BSE. View real-time price changes, volume data, buy/sell signals for Nifty 50, 200, and all listed stocks.',
  keywords: [
    'nse live stock prices',
    'bse stock prices today',
    'indian stock market live quotes',
    'top gainers nse today',
    'top losers bse today',
    'most active stocks nse',
    'nifty 50 live stock analysis',
    'stock buy sell signals india',
    'volume breakout stocks nse',
    'sector performance nse india',
  ],
  alternates: { canonical: 'https://swinglify.online/markets' },
  openGraph: {
    title: 'Live NSE & BSE Stock Prices — Swinglify Markets',
    description: 'Real-time stock prices, volume, buy/sell signals for all NSE & BSE listed stocks.',
    url: 'https://swinglify.online/markets',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Swinglify Live Markets' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Live NSE & BSE Stock Prices — Swinglify Markets',
    description: 'Real-time stock prices, volume, buy/sell signals for all NSE & BSE listed stocks.',
    images: ['/og-image.png'],
  },
};

export default function MarketsLayout({ children }) {
  return children;
}
