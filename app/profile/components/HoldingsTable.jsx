"use client";

const formatNum = (val, maxDec = 1) => {
  if (val == null || isNaN(val)) return '0';
  if (val >= 10000000) return `${(val/10000000).toFixed(2)}Cr`;
  if (val >= 100000) return `${(val/100000).toFixed(2)}L`;
  if (val >= 1000) return `${(val/1000).toFixed(1)}K`;
  return val.toLocaleString('en-IN', { maximumFractionDigits: maxDec });
};

const formatCurrency = (val) => {
  if (val == null || isNaN(val)) return '₹0';
  const abs = Math.abs(val);
  const sign = val < 0 ? '-' : '';
  return `${sign}₹${formatNum(abs, 2)}`;
};

export default function HoldingsTable({ holdings, quotes, onEdit, onRemove }) {
  if (!holdings.length) {
    return (
      <div className="pt-card">
        <div className="empty-portfolio">
          <h3>No Holdings Yet</h3>
          <p>Start building your portfolio by adding stocks using the "+ Add Stock" button above.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-card">
      <table className="p-table">
        <thead>
          <tr>
            <th>Stock</th>
            <th>Qty</th>
            <th>Avg Price</th>
            <th>Current Price</th>
            <th>Total Value</th>
            <th>P&L</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map(h => {
            const quote = quotes[h.symbol];
            const currentPrice = quote?.price || h.avgPrice;
            const totalValue = h.qty * currentPrice;
            const invested = h.qty * h.avgPrice;
            const pl = totalValue - invested;
            const plPct = invested > 0 ? ((pl / invested) * 100).toFixed(2) : '0.00';
            const isProfit = pl >= 0;

            return (
              <tr key={h.id} className="p-tr">
                <td>
                  <div className="company-info-wrap">
                    <div className="logo-swap-container">
                       <div className="logo-view">
                          {quote?.logo ? (
                            <img src={quote.logo} alt="" className="h-logo" />
                          ) : (
                            <div className="h-logo-fallback">{h.symbol?.charAt(0)}</div>
                          )}
                       </div>
                       <div className="logo-action-view">
                          <button className="h-btn" title="Edit" onClick={() => onEdit(h)}>✏️</button>
                          <button className="h-btn sell" title="Remove" onClick={() => onRemove(h.id)}>✖</button>
                       </div>
                    </div>
                    <div>
                      <div className="h-sym">{h.symbol}</div>
                      <div className="h-name">{quote?.name || h.name || ''}</div>
                    </div>
                  </div>
                </td>
                <td className="pt-qty">{formatNum(h.qty)}</td>
                <td className="pt-price">{formatCurrency(h.avgPrice)}</td>
                <td className="pt-price">{formatCurrency(currentPrice)}</td>
                <td className="pt-price">{formatCurrency(totalValue)}</td>
                <td>
                  <div className={`pt-pl ${isProfit ? 'profit-glow' : 'loss-glow'}`}>
                    <span className="pt-pl-abs">{isProfit ? '+' : ''}{formatCurrency(Math.abs(pl))}</span>
                    <span className="pt-pl-pct">{isProfit ? '+' : ''}{plPct}%</span>
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
