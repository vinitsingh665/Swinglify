"use client";
import { useState, useMemo, useEffect } from 'react';
import { formatNumber, formatVolume, formatMarketCap, formatCompact, getSignalClass, formatSignal } from '../utils';

export default function StockTable({ stocks, loading, onOpenStock }) {
  const [sortConfig, setSortConfig] = useState({ key: null, order: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Reset to first page only when sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sortConfig.key, sortConfig.order]);

  const sortedStocks = useMemo(() => {
    if (!sortConfig.key) return stocks;
    return [...stocks].sort((a, b) => {
      let aVal, bVal;
      if (sortConfig.key === 'indicatorScore') {
        aVal = a.indicatorScore?.score || 0;
        bVal = b.indicatorScore?.score || 0;
      } else {
        aVal = a[sortConfig.key];
        bVal = b[sortConfig.key];
      }
      if (typeof aVal === 'string') {
        aVal = (aVal || '').toLowerCase();
        bVal = (bVal || '').toLowerCase();
        return sortConfig.order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      aVal = aVal || 0; bVal = bVal || 0;
      return sortConfig.order === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [stocks, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sortedStocks.length / itemsPerPage));
  const validPage = Math.min(currentPage, totalPages);
  const currentStocks = sortedStocks.slice((validPage - 1) * itemsPerPage, validPage * itemsPerPage);

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

  const columns = (
    <tr>
      <th className="th-rank">#</th>
      <th className="th-symbol sortable" onClick={() => handleSort('symbol')}>Vault{getSortIcon('symbol')}</th>
      <th className="th-change sortable" onClick={() => handleSort('change')}>Daily{getSortIcon('change')}</th>
      <th className="th-price sortable" onClick={() => handleSort('price')}>Balance{getSortIcon('price')}</th>
      <th className="th-ind sortable" onClick={() => handleSort('indicatorScore')}>APY{getSortIcon('indicatorScore')}</th>
      <th style={{ textAlign: 'center' }}>State</th>
      <th className="th-volume sortable" onClick={() => handleSort('volume')}>Start Date{getSortIcon('volume')}</th>
      <th style={{ textAlign: 'center' }}>Liquidity</th>
    </tr>
  );

  if (loading) {
    return (
      <div className="table-card">
        <div className="table-wrapper">
          <table className="stock-table">
            <thead>{columns}</thead>
            <tbody>
              {Array.from({ length: 10 }, (_, i) => (
                <tr key={i} className="skeleton-row">
                  {Array.from({ length: 8 }, (_, j) => (
                    <td key={j}><div className="skeleton skeleton-block" style={{ width: [20,130,70,90,50,60,80,50][j], height: 14, borderRadius: 4 }}></div></td>
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
    <div className="table-card">
      <div className="table-wrapper">
        <table className="stock-table">
          <thead>{columns}</thead>
          <tbody>
            {currentStocks.map((s, i) => {
              const globalIndex = (validPage - 1) * itemsPerPage + i;
              const changeSign = (s.change || 0) >= 0 ? '+' : '';
              const changeColor = (s.change || 0) >= 0 ? 'var(--green)' : 'var(--red)';
              const indScore = s.indicatorScore?.score || 0;
              const indLabel = s.indicatorScore?.label || 'NEUTRAL';
              const indColor = indLabel.includes('BUY') ? 'var(--green)' : indLabel.includes('SELL') ? 'var(--red)' : 'var(--text-muted)';

              // Liquidity dots based on volume relative (1-3 dots)
              const vol = s.volume || 0;
              const avgVol = s.avgVolume10d || s.avgVolume30d || vol;
              const volRatio = avgVol > 0 ? vol / avgVol : 1;
              const dots = volRatio > 1.5 ? 3 : volRatio > 0.8 ? 2 : 1;

              return (
                <tr key={s.symbol} onClick={() => onOpenStock(s.symbol)}>
                  {/* # */}
                  <td className="td-rank">{globalIndex + 1}</td>

                  {/* Vault — symbol + name like the reference */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {s.logo && (
                        <img className="stock-logo" src={s.logo} alt={s.symbol}
                          onError={(e) => e.target.style.display = 'none'}
                          style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }}
                        />
                      )}
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{s.name?.split(' ')[0] || s.symbol}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>{s.symbol} · NSE</div>
                      </div>
                    </div>
                  </td>

                  {/* Daily */}
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: changeColor }}>
                    {changeSign}₹{formatNumber(Math.abs(s.changeAbs || 0))}
                  </td>

                  {/* Balance = Price */}
                  <td className="td-price">₹{formatNumber(s.price)}</td>

                  {/* APY = Indicator Score */}
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: indColor, fontSize: '0.8rem' }}>
                      {indScore > 0 ? (
                        <>{changeSign}{indScore}%</>
                      ) : '—'}
                    </span>
                  </td>

                  {/* State = recommendation */}
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {s.recommendation === 'STRONG_BUY' || s.recommendation === 'BUY' ? 'Bullish' :
                       s.recommendation === 'STRONG_SELL' || s.recommendation === 'SELL' ? 'Bearish' : 'Neutral'}
                    </span>
                  </td>

                  {/* Start Date = sector */}
                  <td style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {s.sector || '—'}
                  </td>

                  {/* Liquidity dots */}
                  <td>
                    <div className="liquidity-dots">
                      {Array.from({ length: 3 }, (_, di) => (
                        <div key={di} className={`liquidity-dot ${di >= dots ? 'dim' : ''}`} />
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Showing {(validPage - 1) * itemsPerPage + 1} to {Math.min(validPage * itemsPerPage, sortedStocks.length)} of {sortedStocks.length} assets
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={validPage === 1}
              style={{ padding: '6px 12px', background: 'var(--bg-hover)', border: '1px solid var(--border)', borderRadius: '6px', color: validPage === 1 ? 'var(--text-dim)' : 'var(--text-primary)', cursor: validPage === 1 ? 'not-allowed' : 'pointer', fontSize: '0.78rem', fontWeight: 500, fontFamily: 'var(--font)', transition: 'all 0.15s' }}
            >
              Previous
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={validPage === totalPages}
              style={{ padding: '6px 12px', background: 'var(--bg-hover)', border: '1px solid var(--border)', borderRadius: '6px', color: validPage === totalPages ? 'var(--text-dim)' : 'var(--text-primary)', cursor: validPage === totalPages ? 'not-allowed' : 'pointer', fontSize: '0.78rem', fontWeight: 500, fontFamily: 'var(--font)', transition: 'all 0.15s' }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
