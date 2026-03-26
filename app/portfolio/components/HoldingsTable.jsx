"use client";

export default function HoldingsTable({ holdings, quotes, onEdit, onRemove }) {
  if (holdings.length === 0) {
    return (
      <div className="pf-empty">
        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📂</div>
        <h3>No holdings yet</h3>
        <p>Add your first stock to start tracking your portfolio.</p>
      </div>
    );
  }

  return (
    <div className="pt-card">
      <div className="table-wrapper">
        <table className="p-table">
          <thead>
            <tr>
              <th>Stock / Company</th>
              <th>Qty</th>
              <th>Avg Price</th>
              <th>LTP</th>
              <th>Unrealized P&L</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map(h => {
              const q = quotes[h.symbol];
              const ltp = q?.price || h.avgPrice;
              const pnl = (ltp - h.avgPrice) * h.qty;
              const pnlPct = h.avgPrice > 0 ? (((ltp - h.avgPrice) / h.avgPrice) * 100).toFixed(2) : 0;
              const isUp = pnl >= 0;

              const logoUrl = h.logo || q?.logo;

              return (
                <tr key={h.id} className="p-tr">
                  <td>
                    <div className="company-info-wrap">
                      <div className="logo-swap-container">
                        <div className="logo-view">
                          {logoUrl ? (
                            <img 
                              src={logoUrl}
                              alt={h.symbol}
                              className="h-logo"
                              onError={(e) => { 
                                e.target.style.display = 'none'; 
                                if(e.target.nextSibling) e.target.nextSibling.style.display = 'flex'; 
                              }}
                            />
                          ) : null}
                          <div className="h-logo-fallback" style={{
                            display: logoUrl ? 'none' : 'flex',
                            background: `hsl(${(h.symbol.charCodeAt(0) * 20) % 360}, 60%, 20%)`,
                            color: `hsl(${(h.symbol.charCodeAt(0) * 20) % 360}, 80%, 80%)`,
                            borderColor: `hsl(${(h.symbol.charCodeAt(0) * 20) % 360}, 60%, 30%)`
                          }}>
                            {h.symbol.charAt(0)}
                          </div>
                        </div>
                        <div className="logo-action-view">
                          <button className="h-btn" onClick={(e) => { e.stopPropagation(); onEdit(h); }} title="Edit">
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg>
                          </button>
                          <button className="h-btn sell" onClick={(e) => { e.stopPropagation(); onRemove(h.id); }} title="Remove">
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                          </button>
                        </div>
                      </div>
                      <div>
                        <div className="h-sym">{h.symbol}</div>
                        {h.name && <div className="h-name">{h.name}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="pt-qty">{h.qty}</td>
                  <td className="pt-price">₹{h.avgPrice.toLocaleString('en-IN')}</td>
                  <td className="pt-price">₹{ltp.toLocaleString('en-IN')}</td>
                  <td>
                    <div className="pt-pl">
                      <span className={`pt-pl-abs ${isUp ? 'profit-glow' : 'loss-glow'}`}>
                        {isUp ? '+' : ''}₹{pnl.toLocaleString('en-IN')}
                      </span>
                      <span className="pt-pl-pct">({isUp ? '+' : ''}{pnlPct}%)</span>
                    </div>
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
