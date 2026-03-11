import { useState, useMemo } from 'react';
import { formatNumber, formatVolume, formatMarketCap, formatCompact, getSignalClass, formatSignal } from '../utils';

export default function StockTable({ stocks, loading, onOpenStock }) {
  const [sortConfig, setSortConfig] = useState({ key: null, order: 'desc' });

  const sortedStocks = useMemo(() => {
    if (!sortConfig.key) return stocks;
    return [...stocks].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      if (typeof aVal === 'string') {
        aVal = (aVal || '').toLowerCase();
        bVal = (bVal || '').toLowerCase();
        return sortConfig.order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      aVal = aVal || 0;
      bVal = bVal || 0;
      return sortConfig.order === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [stocks, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      order: prev.key === key && prev.order === 'desc' ? 'asc' : 'desc'
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '';
    return sortConfig.order === 'asc' ? ' ↑' : ' ↓';
  };

  if (loading) {
    return (
      <div className="table-container glass-card">
        <div className="table-wrapper">
          <table className="stock-table">
            <thead><tr>
              <th className="th-rank">#</th>
              <th className="th-symbol">Symbol</th>
              <th className="th-name">Company</th>
              <th className="th-price">Price (₹)</th>
              <th className="th-change">Change %</th>
              <th className="th-change-abs">Change (₹)</th>
              <th className="th-volume">Volume</th>
              <th className="th-mcap">Market Cap</th>
              <th className="th-ind">Indicator Call</th>
              <th className="th-52w">52W Range</th>
              <th className="th-rec">Signal</th>
            </tr></thead>
            <tbody>
              {Array.from({ length: 15 }, (_, i) => (
                <tr key={i} className="skeleton-row">
                  {Array.from({ length: 11 }, (_, j) => (
                    <td key={j}><div className="skeleton skeleton-block" style={{ width: [20,80,140,70,55,55,60,70,40,120,50][j], height: 14, marginLeft: j >= 3 && j <= 8 ? 'auto' : undefined, borderRadius: j === 10 ? 100 : 4 }}></div></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container glass-card">
      <div className="table-wrapper">
        <table className="stock-table">
          <thead>
            <tr>
              <th className="th-rank">#</th>
              <th className="th-symbol sortable" onClick={() => handleSort('symbol')}>Symbol{getSortIcon('symbol')}</th>
              <th className="th-name sortable" onClick={() => handleSort('name')}>Company{getSortIcon('name')}</th>
              <th className="th-price sortable" onClick={() => handleSort('price')}>Price (₹){getSortIcon('price')}</th>
              <th className="th-change sortable" onClick={() => handleSort('change')}>Change %{getSortIcon('change')}</th>
              <th className="th-change-abs sortable" onClick={() => handleSort('changeAbs')}>Change (₹){getSortIcon('changeAbs')}</th>
              <th className="th-volume sortable" onClick={() => handleSort('volume')}>Volume{getSortIcon('volume')}</th>
              <th className="th-mcap sortable" onClick={() => handleSort('marketCap')}>Market Cap{getSortIcon('marketCap')}</th>
              <th className="th-ind sortable" onClick={() => handleSort('indicatorScore.score')}>Indicator Call{getSortIcon('indicatorScore.score')}</th>
              <th className="th-52w">52W Range</th>
              <th className="th-rec sortable" onClick={() => handleSort('recommendation')}>Signal{getSortIcon('recommendation')}</th>
            </tr>
          </thead>
          <tbody>
            {sortedStocks.map((s, i) => {
              const changeClass = (s.change || 0) >= 0 ? 'positive' : 'negative';
              const changeSign = (s.change || 0) >= 0 ? '+' : '';
              const absSign = (s.changeAbs || 0) >= 0 ? '+' : '';
              const w52Low = s.week52Low || s.low || 0;
              const w52High = s.week52High || s.high || 1;
              const w52Range = w52High - w52Low;
              const w52Pos = w52Range > 0 ? ((s.price - w52Low) / w52Range * 100) : 50;
              const rangeColorClass = w52Pos > 60 ? 'in-green' : w52Pos < 40 ? 'in-red' : 'in-neutral';

              return (
                <tr key={s.symbol} onClick={() => onOpenStock(s.symbol)} style={{ animationDelay: `${Math.min(i * 0.02, 0.5)}s` }}>
                  <td className="td-rank">{i + 1}</td>
                  <td className="td-symbol">
                    {s.logo && <img className="stock-logo" src={s.logo} alt={s.symbol} onError={(e) => e.target.style.display = 'none'} />}
                    {s.symbol}
                  </td>
                  <td className="td-name" title={s.name}>{s.name}</td>
                  <td className="td-price">₹{formatNumber(s.price)}</td>
                  <td className={`td-change ${changeClass}`}>{changeSign}{(s.change || 0).toFixed(2)}%</td>
                  <td className={`td-change-abs ${changeClass}`}>{absSign}₹{formatNumber(Math.abs(s.changeAbs || 0))}</td>
                  <td className="td-volume">{formatVolume(s.volume)}</td>
                  <td className="td-mcap">{formatMarketCap(s.marketCap)}</td>
                  <td className="td-ind">
                    <IndicatorBadge ind={s.indicatorScore} />
                  </td>
                  <td className="td-52w">
                    <div className="range-bar">
                      <div className="range-values">
                        <div className="range-track">
                          <div className={`range-fill ${rangeColorClass}`} style={{ width: `${Math.max(0, Math.min(100, w52Pos))}%` }}></div>
                        </div>
                        <div className="range-labels">
                          <span>₹{formatCompact(w52Low)}</span>
                          <span>₹{formatCompact(w52High)}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="td-rec">
                    <span className={`signal-badge ${getSignalClass(s.recommendation)}`}>{formatSignal(s.recommendation)}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function IndicatorBadge({ ind }) {
  if (!ind) return <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>—</span>;

  const { label, score } = ind;
  let color, bg, border;
  if (label === 'STRONG BUY')  { color = 'var(--green)'; bg = 'rgba(16,185,129,0.12)'; border = 'rgba(16,185,129,0.3)'; }
  else if (label === 'BUY')    { color = 'var(--green-bright)'; bg = 'rgba(16,185,129,0.07)'; border = 'rgba(16,185,129,0.18)'; }
  else if (label === 'STRONG SELL') { color = 'var(--red)'; bg = 'rgba(239,68,68,0.12)'; border = 'rgba(239,68,68,0.3)'; }
  else if (label === 'SELL')   { color = 'var(--red-bright)'; bg = 'rgba(239,68,68,0.07)'; border = 'rgba(239,68,68,0.18)'; }
  else { color = 'var(--text-muted)'; bg = 'rgba(148,163,184,0.06)'; border = 'rgba(148,163,184,0.15)'; }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, minWidth: 90 }}>
      <span style={{
        display: 'inline-block', padding: '2px 8px', borderRadius: 100,
        fontSize: '0.66rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px',
        color, background: bg, border: `1px solid ${border}`, whiteSpace: 'nowrap'
      }}>{label}</span>
      <div style={{ width: '80%', height: 3, background: 'rgba(148,163,184,0.1)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: 2, transition: 'width 0.5s ease' }} />
      </div>
      <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>{score}%</span>
    </div>
  );
}
