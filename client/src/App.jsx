import { useState, useMemo } from 'react';
import Header from './components/Header';
import TickerBar from './components/TickerBar';
import CategoryNav from './components/CategoryNav';
import SubFilter from './components/SubFilter';
import StatsBar from './components/StatsBar';
import StockTable from './components/StockTable';
import StockModal from './components/StockModal';
import Footer from './components/Footer';
import { useStockData } from './hooks/useStockData';
import { applySubFilter } from './utils';

export default function App() {
  const [category, setCategory] = useState('nifty50');
  const [categoryName, setCategoryName] = useState('Nifty 50');
  const [subFilter, setSubFilter] = useState('all');
  const [modalSymbol, setModalSymbol] = useState(null);

  const { stocks, loading, error, lastUpdated, countdown, refresh } = useStockData(category, 10);

  const filteredStocks = useMemo(() => applySubFilter(stocks, subFilter), [stocks, subFilter]);
  const avgChange = useMemo(() => {
    if (filteredStocks.length === 0) return 0;
    return filteredStocks.reduce((sum, s) => sum + (s.change || 0), 0) / filteredStocks.length;
  }, [filteredStocks]);

  const handleCategoryChange = (id, label) => {
    setCategory(id);
    setCategoryName(label.replace(/[🟢🔴🔥]\s*/g, ''));
    setSubFilter('all');
  };

  return (
    <>
      <div className="bg-gradient"></div>
      <div className="bg-grid"></div>

      <div className="app">
        <Header countdown={countdown} onRefresh={refresh} onOpenStock={setModalSymbol} />
        <TickerBar />
        <CategoryNav activeCategory={category} onCategoryChange={handleCategoryChange} />
        <SubFilter activeFilter={subFilter} onFilterChange={setSubFilter} />
        <StatsBar
          stockCount={filteredStocks.length}
          categoryName={categoryName}
          lastUpdated={lastUpdated}
          avgChange={avgChange}
        />

        {error ? (
          <div className="table-container glass-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>⚠️</div>
            <div style={{ color: 'var(--red)', fontWeight: 600, marginBottom: 8 }}>{error}</div>
            <button onClick={refresh} style={{
              padding: '8px 20px', background: 'var(--accent-blue)', color: 'white', border: 'none',
              borderRadius: 100, fontFamily: 'var(--font-sans)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600
            }}>Retry</button>
          </div>
        ) : (
          <StockTable stocks={filteredStocks} loading={loading} onOpenStock={setModalSymbol} />
        )}

        <Footer />
      </div>

      {modalSymbol && <StockModal symbol={modalSymbol} onClose={() => setModalSymbol(null)} />}
    </>
  );
}
