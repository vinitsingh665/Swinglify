"use client";
import React, { useState } from 'react';
import { formatNumber } from '../../../utils';
import { useWatchlist } from '../../../hooks/useWatchlist';

// Premium SVG Sparkline Generator
const MiniChart = ({ change }) => {
  const isPos = change >= 0;
  const path = isPos 
    ? "M0,15 L10,12 L20,14 L30,5 L40,10 L50,0" 
    : "M0,5 L10,8 L20,6 L30,15 L40,10 L50,20";
    
  return (
    <svg width="48" height="24" viewBox="0 0 50 24" style={{ overflow: 'visible', opacity: 0.8 }}>
      <path d={path} fill="none" stroke={isPos ? 'var(--green)' : 'var(--red)'} strokeWidth="1.5" />
    </svg>
  );
};

export default function MarketTable({ stocks, loading, onOpenStock }) {
  const { addStock, removeStock, hasStock } = useWatchlist();
  const [toastMsg, setToastMsg] = useState('');

  const handleToggleWatchlist = (e, symbol) => {
    e.stopPropagation();
    if (hasStock(symbol)) {
      removeStock(symbol);
      setToastMsg(`${symbol} removed from watchlist`);
    } else {
      addStock(symbol);
      setToastMsg(`${symbol} added to watchlist ⭐`);
    }
    setTimeout(() => setToastMsg(''), 2000);
  };

  if (loading) {
    return (
      <div className="market-table-card border-glass">
        <table className="market-table skeleton-table">
          <thead>
            <tr><th>Stock</th><th>Price</th><th>% Change</th><th>Volume</th><th>Signal</th><th>Chart</th></tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
              <tr key={i} className="skeleton-row">
                <td><div className="skeleton-base" style={{width: 120, height: 24, borderRadius: 6}}></div></td>
                <td><div className="skeleton-base" style={{width: 60, height: 20, borderRadius: 6}}></div></td>
                <td><div className="skeleton-base" style={{width: 50, height: 20, borderRadius: 6}}></div></td>
                <td><div className="skeleton-base" style={{width: 60, height: 20, borderRadius: 6}}></div></td>
                <td><div className="skeleton-base" style={{width: 40, height: 20, borderRadius: 6}}></div></td>
                <td><div className="skeleton-base" style={{width: 48, height: 20, borderRadius: 6}}></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!stocks || stocks.length === 0) {
    return <div className="no-data border-glass">No stocks found matching these criteria.</div>;
  }

  return (
    <div className="market-table-card border-glass">
      <div className="market-table-wrapper">
        <table className="market-table">
          <thead>
            <tr>
              <th className="th-company">Asset</th>
              <th className="th-price">Price</th>
              <th className="th-change">24h Change</th>
              <th className="th-vol">Volume</th>
              <th className="th-signal">Signal</th>
              <th className="th-chart">Trend</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map(stock => {
              const score = stock.indicatorScore?.score || 50;
              const signal = score >= 55 ? 'BUY' : score <= 45 ? 'SELL' : 'HOLD';
              const isPos = stock.change >= 0;
              const inWatchlist = hasStock(stock.symbol);

              return (
                <tr 
                  key={stock.symbol} 
                  className="market-tr"
                >
                  <td className="td-company">
                    <div className="company-info" onClick={() => onOpenStock(stock.symbol)}>
                       {stock.logo ? (
                         <img src={stock.logo} alt={stock.symbol} className="m-logo" />
                       ) : (
                         <div className="m-logo-placeholder">{stock.symbol.charAt(0)}</div>
                       )}
                       <div className="c-text">
                         <span className="c-sym">{stock.symbol}</span>
                         <span className="c-name">
                           {stock.name}
                           <span className={`ex-badge ${stock.exchange?.toLowerCase()}`}>{stock.exchange}</span>
                         </span>
                       </div>
                    </div>
                  </td>
                  
                  <td className="td-price" onClick={() => onOpenStock(stock.symbol)}>
                    <span className={`m-price ${isPos ? 'flash-green' : 'flash-red'}`}>
                        ₹{stock.price?.toLocaleString('en-IN') || '--'}
                    </span>
                  </td>
                  
                  <td className="td-change" onClick={() => onOpenStock(stock.symbol)}>
                    <span className={`m-change ${isPos ? 'positive' : 'negative'}`}>
                      {isPos ? '+' : ''}{stock.change}%
                    </span>
                  </td>
                  
                  <td className="td-vol font-mono" onClick={() => onOpenStock(stock.symbol)}>
                    {formatNumber(stock.volume)}
                  </td>
                  
                  <td className="td-signal" onClick={() => onOpenStock(stock.symbol)}>
                    <span className={`m-badge ${signal.toLowerCase()}`}>{signal}</span>
                  </td>
                  
                  <td className="td-chart">
                     <div className="chart-swap-container">
                       <div className="chart-view">
                         <MiniChart change={stock.change} />
                       </div>
                       <div className="action-view">
                         <button 
                           className={`ra-btn ${inWatchlist ? 'active' : ''}`} 
                           title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                           onClick={(e) => handleToggleWatchlist(e, stock.symbol)}
                           style={inWatchlist ? { background: 'var(--accent-bg)', borderColor: 'var(--accent)' } : {}}
                         >
                           {inWatchlist ? '★' : '⭐'}
                         </button>
                         <button className="ra-btn" title="Open Chart" onClick={() => onOpenStock(stock.symbol)}>📊</button>
                         <button className="ra-btn primary" title="Quick Trade">⚡</button>
                       </div>
                     </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Toast notification */}
      {toastMsg && (
        <div style={{
          position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--bg-card)', border: '1px solid var(--accent)', borderRadius: 10,
          padding: '10px 20px', color: 'var(--text-primary)', fontSize: '0.82rem',
          fontWeight: 600, zIndex: 9999, boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
          animation: 'modalIn 0.2s ease-out'
        }}>
          {toastMsg}
        </div>
      )}
    </div>
  );
}

