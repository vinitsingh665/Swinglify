"use client";

const formatVol = (v) => {
  if (!v) return '—';
  if (v >= 10000000) return `${(v / 10000000).toFixed(1)}Cr`;
  if (v >= 100000) return `${(v / 100000).toFixed(1)}L`;
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
  return v.toLocaleString('en-IN');
};

const formatMCap = (m) => {
  if (!m) return '—';
  if (m >= 10000000000000) return `${(m / 10000000000000).toFixed(2)}L Cr`;
  if (m >= 100000000000) return `${(m / 10000000).toFixed(0)} Cr`;
  return `${(m / 10000000).toFixed(0)} Cr`;
};

export default function InsightsPanel({ stock, onClose }) {
  if (!stock) return null;

  const isUp = (stock.change || 0) >= 0;

  // Generate the "Meaning" insights dynamically based on the TradingView data points
  const insights = [];

  // Volatility / Volume logic
  if (stock.volume && stock.avgVolume10d && stock.volume > stock.avgVolume10d * 2) {
    insights.push({ type: 'accent', text: `Huge volume spike detected (${(stock.volume/stock.avgVolume10d).toFixed(1)}x average). Institutional activity likely.` });
  } else if (stock.volume && stock.avgVolume10d && stock.volume > stock.avgVolume10d * 1.3) {
    insights.push({ type: 'accent', text: "Above average volume supporting current price move." });
  }

  // RSI Logic
  if (stock.rsi != null) {
    if (stock.rsi < 30) insights.push({ type: 'positive', text: "RSI is deeply oversold (<30) → watch for a possible bounce or reversal." });
    else if (stock.rsi > 70) insights.push({ type: 'negative', text: "RSI is overbought (>70) → strong momentum, but risk of pullback exists." });
  }

  // Trend / Change Logic
  if (stock.perfWeek != null && stock.perfWeek > 5) {
    insights.push({ type: 'positive', text: `Strong weekly momentum (+${stock.perfWeek.toFixed(1)}% this week).` });
  } else if (stock.perfWeek != null && stock.perfWeek < -5) {
    insights.push({ type: 'negative', text: `Significant weekly weakness (${stock.perfWeek.toFixed(1)}% this week).` });
  }

  // EMA Logic
  if (stock.ema50 != null && stock.ema200 != null && stock.price != null) {
    if (stock.ema50 > stock.ema200 && stock.price > stock.ema50) {
      insights.push({ type: 'positive', text: "Price is above both long-term and short-term moving averages. Bullish trend holds." });
    }
  }

  if (insights.length === 0) {
    insights.push({ type: 'neutral', text: "Trading at average volume with neutral momentum indicators. Consolidating." });
  }

  return (
    <div className="wl-panel">
      <button className="wlp-close" onClick={onClose} title="Close Insights">
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
          <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div className="wlp-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {stock.logo ? <img src={stock.logo} style={{ width: 36, height: 36, borderRadius: '50%', background: 'white', padding: 2 }} alt="" /> : null}
          <div>
            <div className="wlp-sym">{stock.symbol}</div>
            <div className="wlp-name">{stock.name}</div>
          </div>
        </div>
        
        <div className="wlp-price-wrap">
          <div className="wlp-price">₹{stock.price?.toLocaleString('en-IN')}</div>
          <div className={`wlp-change ${isUp ? 'up' : 'down'}`}>
            {isUp ? '+' : ''}{stock.change?.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="wlp-stats">
        <div className="wlp-stat">
          <span className="wlp-sl">Volume</span>
          <span className="wlp-sv">{formatVol(stock.volume)}</span>
        </div>
        <div className="wlp-stat">
          <span className="wlp-sl">Market Cap</span>
          <span className="wlp-sv">{formatMCap(stock.marketCap)}</span>
        </div>
        <div className="wlp-stat">
          <span className="wlp-sl">RSI</span>
          <span className="wlp-sv">{stock.rsi != null ? stock.rsi.toFixed(1) : '—'}</span>
        </div>
        <div className="wlp-stat">
          <span className="wlp-sl">Sector</span>
          <span className="wlp-sv" style={{ fontSize: '0.65rem' }}>{stock.sector || '—'}</span>
        </div>
      </div>

      <div className="wlp-edge">
        <div className="wlp-edge-title">
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"></path></svg>
          Trading Edge Analysis
        </div>
        
        {insights.map((insight, idx) => (
          <div key={idx} className={`wlp-insight ${insight.type}`}>
            {insight.text}
          </div>
        ))}

        <a 
          href={`https://in.tradingview.com/chart/?symbol=NSE:${stock.symbol}`} 
          target="_blank" 
          rel="noreferrer"
          style={{
            display: 'block', textAlign: 'center', marginTop: 16, padding: '10px',
            background: 'var(--bg-input)', border: '1px solid var(--border)',
            borderRadius: 8, color: 'var(--text-primary)', textDecoration: 'none',
            fontSize: '0.75rem', fontWeight: 700
          }}
        >
          Open Chart on TradingView ↗
        </a>
      </div>
    </div>
  );
}
