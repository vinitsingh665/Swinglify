"use client";

const formatVol = (v) => {
  if (!v) return '—';
  if (v >= 10000000) return `${(v / 10000000).toFixed(1)}Cr`;
  if (v >= 100000) return `${(v / 100000).toFixed(1)}L`;
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
  return v.toLocaleString('en-IN');
};

function getSignalClass(rec) {
  if (!rec) return 'neutral';
  if (rec.includes('BUY')) return 'buy';
  if (rec.includes('SELL')) return 'sell';
  return 'neutral';
}

function getSignalLabel(rec) {
  if (!rec) return 'HOLD';
  return rec.replace('STRONG_', 'S.').replace('_', ' ');
}

function MiniSparkline({ change = 0 }) {
  // Purely visual representation based on change direction
  // A real sparkline needs historical array data, so we simulate trend via a CSS bar chart
  const isUp = change >= 0;
  const h1 = Math.floor(Math.random() * 8) + 4;
  const h2 = Math.floor(Math.random() * 8) + 6;
  const h3 = isUp ? 14 : 4;
  return (
    <div className="wl-spark">
      <div className={`wl-sp-bar ${isUp ? 'up' : 'down'}`} style={{ height: `${h1}px` }} />
      <div className={`wl-sp-bar ${isUp ? 'up' : 'down'}`} style={{ height: `${h2}px` }} />
      <div className={`wl-sp-bar ${isUp ? 'up' : 'down'}`} style={{ height: `${h3}px` }} />
    </div>
  );
}

export default function WatchlistTable({ stocks, loading, symbolsCount, onRemove, selectedSymbol, onSelect }) {
  if (symbolsCount === 0) {
    return (
      <div className="wl-empty">
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        <div className="wl-empty-title">Start tracking stocks to build your edge</div>
        <span>Search and add your first stock using the search bar above to see real-time data, trend signals, and instant trading opportunities.</span>
      </div>
    );
  }

  if (loading && stocks.length === 0) {
    return (
      <div className="wl-empty" style={{ minHeight: 300 }}>
        <div style={{ width: 30, height: 30, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: 16 }} />
        <div>Syncing market data...</div>
      </div>
    );
  }

  // Filtered out empty stocks or failed fetches
  const validStocks = stocks.filter(s => s && s.symbol);

  if (validStocks.length === 0) {
    return (
      <div className="wl-empty" style={{ minHeight: 300 }}>
        <div>No stocks match active filters.</div>
      </div>
    );
  }

  return (
    <div className="wl-table-wrap">
      <table className="wl-table">
        <thead>
          <tr>
            <th>Stock</th>
            <th>Price</th>
            <th>Change</th>
            <th>Volume</th>
            <th>Signal</th>
            <th style={{ textAlign: 'right', paddingRight: 40 }}>Trend</th>
          </tr>
        </thead>
        <tbody>
          {validStocks.map((s) => {
            const isUp = (s.change || 0) >= 0;
            return (
              <tr 
                key={s.symbol} 
                className={`wl-row ${selectedSymbol === s.symbol ? 'selected' : ''}`}
                onClick={() => onSelect(s.symbol)}
              >
                <td>
                  <div className="wl-stock">
                    {s.logo ? <img src={s.logo} className="wl-logo" alt="" /> : <div className="wl-logo-fallback">{s.symbol[0]}</div>}
                    <div>
                      <div className="wl-sym">{s.symbol}</div>
                      <div className="wl-name" style={{fontSize:'0.65rem',color:'var(--text-dim)'}}>{s.name?.substring(0, 15)}</div>
                    </div>
                  </div>
                </td>
                <td><span className="wl-price">₹{s.price?.toLocaleString('en-IN')}</span></td>
                <td>
                  <span className={`wl-change ${isUp ? 'up' : 'down'}`}>
                    {isUp ? '+' : ''}{s.change?.toFixed(2)}%
                  </span>
                </td>
                <td><span className="wl-vol">{formatVol(s.volume)}</span></td>
                <td>
                  <span className={`wl-signal ${getSignalClass(s.recommendation)}`}>
                    {getSignalLabel(s.recommendation)}
                  </span>
                </td>
                <td align="right">
                  <MiniSparkline change={s.change || 0} />
                </td>

                <td style={{ padding: 0, width: 0, border: 'none' }}>
                  <div className="wl-actions" onClick={(e) => e.stopPropagation()}>
                    <a
                      href={`https://www.tradingview.com/chart/?symbol=NSE%3A${s.symbol}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="wl-btn tv-link-btn"
                      title={`View ${s.symbol} on TradingView`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg width="13" height="13" viewBox="0 0 36 28" fill="none">
                        <path d="M14 22H7V11h7v11zm11 0h-7V6h7v16zm11 0h-7V0h7v22zM3 28H0V0h3v28z" fill="currentColor"/>
                      </svg>
                    </a>
                    <button className="wl-btn" title="Add to Portfolio" onClick={(e) => { e.stopPropagation(); window.location.href = `/portfolio?symbol=${s.symbol}`; }}>💼</button>
                    <button className="wl-btn" title="Set Alert" onClick={(e) => { e.stopPropagation(); window.location.href = `/alerts?symbol=${s.symbol}`; }}>🔔</button>
                    <button className="wl-btn danger" title="Remove" onClick={(e) => { e.stopPropagation(); onRemove(s.symbol); }}>⭐</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
