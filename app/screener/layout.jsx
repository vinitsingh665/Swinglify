export const metadata = {
  title: 'Stock Screener — Filter NSE & BSE Stocks by RSI, MACD, Volume',
  description: 'Free stock screener for Indian markets. Filter NSE & BSE stocks by RSI, MACD, Bollinger Bands, volume breakout, and market cap.',
  keywords: [
    'stock screener india',
    'free nse stock screener',
    'bse stock screener',
    'rsi screener india',
    'macd screener nse',
    'bollinger bands screener',
    'volume breakout screener india',
    'swing trading stock filter',
    'ema crossover screener',
    'oversold stocks today india',
  ],
  alternates: { canonical: 'https://swinglify.online/screener' },
  openGraph: {
    title: 'Free Stock Screener for NSE & BSE — Filter by RSI, MACD, Volume',
    description: 'Screen Indian stocks with technical indicators. Find oversold, volume breakout, and trending stocks.',
    url: 'https://swinglify.online/screener',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Swinglify Stock Screener' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Stock Screener for NSE & BSE — Swinglify',
    description: 'Screen Indian stocks with technical indicators. Find oversold, breakout, and trending stocks.',
    images: ['/og-image.png'],
  },
};

export default function ScreenerLayout({ children }) {
  return children;
}
