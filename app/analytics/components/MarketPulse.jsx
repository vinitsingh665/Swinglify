"use client";

export default function MarketPulse({ pulse, indices, sectors }) {
  if (!pulse || !indices) return null;

  const nifty = indices.find(i => i.symbol === 'NIFTY');
  const bankNifty = indices.find(i => i.symbol === 'BANKNIFTY');
  const vix = indices.find(i => i.symbol === 'INDIA_VIX');

  const advWidth = pulse.totalStocks ? (pulse.advancing / pulse.totalStocks) * 100 : 50;
  const decWidth = pulse.totalStocks ? (pulse.declining / pulse.totalStocks) * 100 : 50;

  return (
    <div className="market-pulse">
      <div className="mp-top">
        {/* Indices */}
        <div className="mp-indices">
          {[nifty, bankNifty, vix].filter(Boolean).map(idx => (
            <div key={idx.symbol} className="mp-index">
              <span className="mp-index-name">{idx.name}</span>
              <span className="mp-index-val">{idx.value?.toLocaleString('en-IN') || '—'}</span>
              <span className={`mp-index-change ${(idx.change || 0) >= 0 ? 'up' : 'down'}`}>
                {idx.symbol !== 'INDIA_VIX' && (idx.change || 0) >= 0 ? '+' : ''}{idx.change?.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>

        {/* Sentiment & Adv/Dec */}
        <div className="mp-sentiment">
          <div className="mp-advdec">
            <div className="mp-advdec-label">Advance / Decline Ratio: {pulse.advDecRatio.toFixed(2)}</div>
            <div className="mp-advdec-bar">
              <div className="adv" style={{ width: `${advWidth}%` }} />
              <div className="dec" style={{ width: `${decWidth}%` }} />
            </div>
            <div className="mp-advdec-nums">
              <span className="adv-n">{pulse.advancing} Adv</span>
              <span className="dec-n">{pulse.declining} Dec</span>
            </div>
          </div>

          <div className={`mp-sentiment-badge ${pulse.sentiment.includes('Bullish') ? 'bullish' : pulse.sentiment.includes('Bearish') ? 'bearish' : 'neutral'}`}>
            {pulse.sentiment}
          </div>
        </div>
      </div>

      {/* Sector Heatmap (1D returns) */}
      <div className="mp-heatmap">
        {(sectors || []).map(sec => {
          // Calculate heat color based on 1D change
          const chg = sec.change1D || 0;
          let bg = 'var(--bg-card)';
          if (chg >= 2) bg = '#166534'; // strong green
          else if (chg > 0.5) bg = '#15803d'; // green
          else if (chg > 0) bg = '#22c55e'; // light green
          else if (chg <= -2) bg = '#991b1b'; // strong red
          else if (chg < -0.5) bg = '#b91c1c'; // red
          else if (chg < 0) bg = '#ef4444'; // light red

          return (
            <div key={sec.name} className="mp-heat-tile" style={{ background: bg }}>
              <div className="mp-ht-name">{sec.name.substring(0, 8)}</div>
              <div className="mp-ht-val">{chg > 0 ? '+' : ''}{chg.toFixed(1)}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
