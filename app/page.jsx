import LandingNav from '../components/landing/LandingNav';
import LandingHero from '../components/landing/Hero3D';
import LiveScannerFeed from '../components/landing/LiveScannerFeed';
import RiskCalculator from '../components/landing/RiskCalculator';
import BentoFeatures from '../components/landing/BentoFeatures';
import PresetGrid from '../components/landing/PresetGrid';
import PlatformComparison from '../components/landing/PlatformComparison';
import LandingFooter from '../components/landing/LandingFooter';

import './landing.css'; 

export const metadata = {
  title: 'Swinglify — The Premium Swing Trading Platform for Indian Stocks',
  description: 'Screen 3,000+ NSE & BSE stocks with 40+ technical indicators, automated volume breakouts, RSI momentum scores, Fibonacci confluence, and stock comparisons — 100% free.',
  keywords: [
    'swing trading india',
    'stock screener india',
    'free nse stock screener',
    'volume breakout screener',
    'rsi screener nse',
    'stock comparison tool india',
    'technical analysis indian stocks',
  ],
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
        <LandingFooter />
      </main>
    </div>
  );
}
