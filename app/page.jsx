import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import Hero3D from '../components/landing/Hero3D';
import MarketMarquee from '../components/landing/MarketMarquee';
import BentoFeatures from '../components/landing/BentoFeatures';
import LandingFooter from '../components/landing/LandingFooter';

import './landing.css'; 
import '../components/seo-hero.css';

export const metadata = {
  title: 'Swinglify — Award-Winning Swing Trading Platform for India',
  description: 'Free premium swing trading platform for NSE & BSE stocks. Advanced stock screener with 40+ technical indicators (RSI, MACD, Bollinger Bands), real-time portfolio tracking, and instant alerts. Build your wealth with the best swing trading tool in India.',
  keywords: 'swing trading india, nse stock screener, bse stock analysis, technical analysis app, rsi macd scanner, free trading tools india, stock alerts nse, swinglify',
};

export default function HomePage() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <TopBar />
        <div className="landing-page">
          <div className="landing-content">
            <Hero3D />
            <MarketMarquee />
            <BentoFeatures />
            <LandingFooter />
          </div>
        </div>
      </div>
    </div>
  );
}
