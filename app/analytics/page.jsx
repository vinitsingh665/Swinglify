"use client";

import { useState, useEffect } from 'react';
import './analytics.css';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import MarketPulse from './components/MarketPulse';
import SectorPerformance from './components/SectorPerformance';
import TrendSignals from './components/TrendSignals';
import OpportunitiesToday from './components/OpportunitiesToday';
import MarketTrends from './components/MarketTrends';

export default function AnalyticsPage() {
  const [theme, setThemeState] = useState('dark');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Theme persistence
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) setThemeState(saved);
  }, []);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/analytics');
        const json = await res.json();
        if (json.success) setData(json);
      } catch (err) {
        console.error('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="app-layout" data-theme={theme}>
      <Sidebar theme={theme} setTheme={setTheme} />
      <div className="main-area">
        <TopBar />
        <div className="analytics-layout">
          
          <h1 className="st-title" style={{ fontSize: '1.4rem', fontWeight: 800, paddingLeft: 4 }}>Market Intelligence</h1>

          {loading ? (
            <div className="analytics-loading">
              <div className="spinner" />
              <div>Analyzing market data...</div>
            </div>
          ) : !data ? (
            <div className="analytics-loading">Failed to load market data</div>
          ) : (
            <>
              {/* 1. Market Pulse Strip */}
              <MarketPulse pulse={data.marketPulse} indices={data.indices} sectors={data.sectors} />

              {/* 2. Sector Performance */}
              <SectorPerformance sectors={data.sectors} />

              {/* 3. Trend & Momentum Signals */}
              <TrendSignals signals={data.signals} />

              {/* Bottom Twin Columns */}
              <div className="analytics-bottom">
                {/* 4. Top Opportunities */}
                <OpportunitiesToday opportunities={data.opportunities} />

                {/* 5. Market Trends */}
                <MarketTrends indices={data.indices} />
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
