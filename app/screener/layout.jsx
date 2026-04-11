export const metadata = {
  title: 'Stock Screener — Filter NSE & BSE Stocks by RSI, MACD, Volume',
  description: 'Free stock screener for Indian markets. Filter NSE & BSE stocks by RSI, MACD, Bollinger Bands, volume breakout, and market cap.',
  keywords: [
    'stock screener india',
    'nse stock screener free',
    'rsi screener nse',
    'macd screener india',
    'bollinger bands stock filter',
    'volume breakout screener india',
    'technical analysis screener nse',
    'oversold stocks screener',
    'swing trading stock filter',
    'free stock screener nse bse',
    'momentum stocks screener india',
    'ema crossover screener nse',
    'penny stocks screener india',
    'small cap stock screener nse',
    'overbought oversold stocks today',
    'best stocks to buy today india screener',
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
