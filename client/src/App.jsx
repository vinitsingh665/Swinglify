import { useState, useMemo, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import OverviewCards from './components/OverviewCards';
import StockTable from './components/StockTable';
import StockModal from './components/StockModal';
import SearchBar from './components/SearchBar';
import { useStockData } from './hooks/useStockData';

export default function App() {
  const [category, setCategory] = useState('nifty50');
  const [categoryName, setCategoryName] = useState('Nifty 50');
  const [modalSymbol, setModalSymbol] = useState(null);
  const [theme, setThemeState] = useState('dark');

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

  const { stocks, loading, error, lastUpdated, countdown, refresh } = useStockData(category, 10);

  const handleCategoryChange = useCallback((id, label) => {
    setCategory(id);
    setCategoryName(label.replace(/[🟢🔴🔥]\s*/g, ''));
  }, []);

  // Search shortcut handled entirely inside SearchBar now

  return (
    <div className="app-layout">
      <Sidebar theme={theme} setTheme={setTheme} />

      <div className="main-area">
        <TopBar />

        <div className="content">
          <div className="content-inner">
            {/* Overview Header */}
            <div className="overview-header">
              <h1 className="overview-title">Overview</h1>
              <SearchBar onOpenStock={setModalSymbol} />
            </div>

            {/* Cards Grid */}
            <OverviewCards
              theme={theme}
              categoryName={categoryName}
              onCategoryChange={handleCategoryChange}
              onOpenStock={setModalSymbol}
            />

            {/* Stock Table */}
            {error ? (
              <div className="table-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: '2rem', marginBottom: 12 }}>⚠️</div>
                <div style={{ color: 'var(--red)', fontWeight: 600, marginBottom: 8 }}>{error}</div>
                <button onClick={refresh} style={{
                  padding: '10px 24px', background: 'var(--accent)', color: 'white', border: 'none',
                  borderRadius: '8px', fontFamily: 'var(--font)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600
                }}>Retry</button>
              </div>
            ) : (
              <StockTable stocks={stocks} loading={loading} onOpenStock={setModalSymbol} />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {modalSymbol && <StockModal symbol={modalSymbol} onClose={() => setModalSymbol(null)} />}
    </div>
  );
}
