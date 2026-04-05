import './globals.css';
import ThemeProvider from '../components/ThemeProvider';
import VisitorTracker from '../components/VisitorTracker';
import AuthProvider from '../components/AuthProvider';
import OnboardingModal from '../components/OnboardingModal';
import StructuredData from '../components/StructuredData';

import Script from 'next/script';

export const metadata = {

  title: {
    default: 'Swinglify — Simplifying your Swing Trades',
    template: '%s | Swinglify',
  },
  description: 'Swinglify is a free swing trading platform for Indian stocks. Screen NSE & BSE stocks with RSI, MACD, Bollinger Bands. Track your portfolio, set price alerts, and find the best swing trade opportunities — all in one place.',
  keywords: [
    'swing trading india',
    'swing trading screener',
    'nse stock screener',
    'bse stock screener',
    'free stock screener india',
    'indian stock market analysis',
    'swing trade stocks nse',
    'best stocks for swing trading india',
    'nifty 50 swing trading',
    'rsi screener india',
    'macd screener nse',
    'bollinger bands screener',
    'stock portfolio tracker india',
    'price alert nse stocks',
    'technical analysis indian stocks',
    'intraday to swing trading',
    'stock market dashboard india',
    'nse live market data',
    'bse stock analysis',
    'free trading tools india',
    'stock watchlist india',
    'swing trading for beginners india',
    'nifty swing trading strategy',
    'volume breakout screener',
    'oversold stocks india',
    'overbought stocks nse',
  ],
  authors: [{ name: 'Swinglify', url: 'https://swinglify.online' }],
  creator: 'Swinglify',
  publisher: 'Swinglify',
  metadataBase: new URL('https://swinglify.online'),
  alternates: {
    canonical: 'https://swinglify.online',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://swinglify.online',
    siteName: 'Swinglify',
    title: 'Swinglify — Simplifying your Swing Trades',
    description: 'Screen NSE & BSE stocks with RSI, MACD & Bollinger Bands. Track portfolio, set alerts, find swing trade opportunities — free.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Swinglify — Swing Trading Platform for Indian Stocks',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@swinglify',
    creator: '@swinglify',
    title: 'Swinglify — Simplifying your Swing Trades',
    description: 'Screen NSE & BSE stocks with RSI, MACD & Bollinger Bands. Track your portfolio and set price alerts — all free.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '3FzEun-VL4BV6YQsSIuM0Hv1Sswwe3sEmQFsXWRkq9g',
  },
  category: 'finance',
};

export default function RootLayout({ children }) {
  const themeScript = `
    (function() {
      try {
        var t = 'dark'; // Light theme disabled — always use dark
        document.documentElement.setAttribute('data-theme', t);
        
        if (window.location.pathname.startsWith('/vinit_admin')) {
          document.documentElement.style.setProperty('--accent', '#6366f1');
          document.documentElement.style.setProperty('--accent-bg', 'rgba(99, 102, 241, 0.1)');
        } else {
          var accent = localStorage.getItem('swinglify_accent') || '#6366f1';
          document.documentElement.style.setProperty('--accent', accent);
          var r = parseInt(accent.slice(1, 3), 16);
          var g = parseInt(accent.slice(3, 5), 16);
          var b = parseInt(accent.slice(5, 7), 16);
          document.documentElement.style.setProperty('--accent-bg', 'rgba('+r+','+g+','+b+',0.1)');
          var rh = Math.min(255, r + 64);
          var gh = Math.min(255, g + 64);
          var bh = Math.min(255, b + 64);
          document.documentElement.style.setProperty('--accent-hover', '#'+((1<<24)|(rh<<16)|(gh<<8)|bh).toString(16).slice(1));
        }
      } catch(e) {}
    })();
  `;
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-init">{themeScript}</Script>
      </head>
      <body suppressHydrationWarning={true}>
        <StructuredData />
        <AuthProvider>
          <ThemeProvider>
            <VisitorTracker />
            <OnboardingModal />
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
