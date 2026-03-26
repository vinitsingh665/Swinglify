"use client";
import { useIndices } from '../../../hooks/useStockData';
import { formatNumber } from '../../../utils';

export default function MarketSummaryStrip() {
  const { indices } = useIndices();
  
  const topIndices = indices.filter(i => 
    i.symbol === 'NIFTY' || i.symbol === 'BANKNIFTY' || i.symbol === 'SENSEX' || i.name?.includes('Sensex')
  ).slice(0, 3);

  // Fallbacks if data not loaded yet
  const displayIndices = topIndices.length > 0 ? topIndices : [
    { symbol: 'NIFTY', name: 'Nifty 50', value: 0, change: 0 },
    { symbol: 'BANKNIFTY', name: 'Bank Nifty', value: 0, change: 0 }
  ];

  return (
    <div className="market-summary-strip">
      {displayIndices.map(idx => (
        <div key={idx.symbol} className="mss-item border-glass">
          <div className="mss-left">
            <div className="mss-header">
              <span className="mss-name">{idx.name || idx.symbol}</span>
              <span className={`mss-change ${idx.change >= 0 ? 'positive' : 'negative'}`}>
                {idx.change >= 0 ? '+' : ''}{idx.change}%
              </span>
            </div>
            <div className="mss-value">{formatNumber(idx.value)}</div>
          </div>
          
          <div className="mss-sparkline">
            <svg viewBox="0 0 100 20" preserveAspectRatio="none">
              <path 
                d={idx.change >= 0 ? "M0,15 Q25,18 50,10 T100,2" : "M0,5 Q25,2 50,10 T100,18"} 
                fill="none" 
                stroke={idx.change >= 0 ? "var(--green)" : "var(--red)"} 
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}
