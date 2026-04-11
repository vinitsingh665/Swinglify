export const metadata = {
  title: 'Price Alerts — Get Real-Time Notifications for Indian Stocks',
  description: 'Set custom price alerts for NSE & BSE stocks. Get notified when your target price is hit or when RSI/MACD signals trigger.',
  keywords: [
    'stock price alerts india',
    'nse price notification',
    'free stock alerts app',
    'real time stock alerts nse',
    'macd alerts india',
    'rsi alerts indian stocks',
    'stock breakout alerts',
    'price target alerts nse',
    'best stock alert app india',
    'mobile stock notifications india',
  ],
  alternates: { canonical: 'https://swinglify.online/alerts' },
  openGraph: {
    title: 'Stock Price Alerts — Free NSE & BSE Alerts | Swinglify',
    description: 'Set custom price alerts for Indian stocks and receive notifications when targets hit.',
    url: 'https://swinglify.online/alerts',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Swinglify Price Alerts' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stock Price Alerts — Free NSE & BSE Alerts | Swinglify',
    description: 'Set custom price alerts for Indian stocks and receive notifications when targets hit.',
    images: ['/og-image.png'],
  },
};

export default function AlertsLayout({ children }) {
  return children;
}
