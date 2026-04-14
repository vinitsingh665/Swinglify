import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import Hero3D from '../components/landing/Hero3D';
import MarketMarquee from '../components/landing/MarketMarquee';
import BentoFeatures from '../components/landing/BentoFeatures';
import LandingFooter from '../components/landing/LandingFooter';

import './landing.css'; 
import '../components/seo-hero.css';

export const metadata = {
  title: 'Swinglify — Swing Trading, Stock Screener & Portfolio Tracker',
  description: 'Free premium swing trading platform for NSE & BSE stocks. Advanced stock screener, real-time portfolio tracker, stock comparison tool, and instant alerts. Build your wealth with the best trading tool in India.',
  keywords: 'swing trading india, portfolio tracker, stock comparison, stock compare tool, stock comparisons, stock comparison tool, stock comparison chart, stock broker comparison india, stock broker comparison, nse stock screener, bse stock analysis, free trading tools india',
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
