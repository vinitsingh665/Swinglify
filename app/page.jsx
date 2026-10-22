import LandingNav from '../components/landing/LandingNav';
import LandingHero from '../components/landing/Hero3D';
import LiveScannerFeed from '../components/landing/LiveScannerFeed';
import RiskCalculator from '../components/landing/RiskCalculator';
import BentoFeatures from '../components/landing/BentoFeatures';
import PresetGrid from '../components/landing/PresetGrid';
import PlatformComparison from '../components/landing/PlatformComparison';
import LandingFAQ from '../components/landing/LandingFAQ';
import LandingFooter from '../components/landing/LandingFooter';

import './landing.css'; 

export const metadata = {
  title: 'Swinglify — The Premium Swing Trading Platform for Indian Stocks',
  description: 'Screen 3,000+ NSE & BSE stocks with 40+ technical indicators, automated volume breakouts, RSI momentum scores, Fibonacci confluence, and stock comparisons — 100% free.',
  keywords: [
    'swing trading india',
    'stock screener india',
    'free nse stock screener',
    'bse stock screener',
    'rsi screener nse',
    'volume breakout screener',
    'golden cross stocks india',
    'stock comparison tool india',
    'technical analysis indian stocks',
    'best swing trading platform india',
  ],
  alternates: {
    canonical: 'https://swinglify.online',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://swinglify.online',
    siteName: 'Swinglify',
    title: 'Swinglify — The Premium Swing Trading Platform for Indian Stocks',
    description: 'Screen 3,000+ NSE & BSE stocks with 40+ technical indicators, automated volume breakouts, RSI momentum scores, and stock comparisons — 100% free.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Swinglify — Premium Swing Trading Platform for Indian Stocks',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@swinglify',
    creator: '@swinglify',
    title: 'Swinglify — Premium Swing Trading Platform for Indian Stocks',
    description: 'Screen 3,000+ NSE & BSE stocks with 40+ technical indicators, automated volume breakouts, and RSI scores — 100% free.',
    images: ['/og-image.png'],
  },
};

export default function HomePage() {
  return (
    <div className="landing-viewport">
      <LandingNav />
      <main className="landing-main-stream">
        <LandingHero />
        <LiveScannerFeed />
        <RiskCalculator />
        <BentoFeatures />
        <PresetGrid />
        <PlatformComparison />
        <LandingFAQ />
        <LandingFooter />
      </main>
    </div>
  );
}
