import { useIndices } from '../hooks/useStockData';
import { formatNumber } from '../utils';

export default function TickerBar() {
  const { indices } = useIndices();

  return (
    <div className="ticker-bar">
      <div className="ticker-content">
        {indices.length === 0 ? (
          <div className="ticker-placeholder">Loading indices...</div>
        ) : (
          indices.map((idx, i) => {
            const changeClass = idx.change >= 0 ? 'positive' : 'negative';
            const sign = idx.change >= 0 ? '+' : '';
            return (
              <div key={idx.symbol || i} style={{ display: 'contents' }}>
                {i > 0 && <div className="ticker-divider"></div>}
                <div className="ticker-item">
                  <span className="ti-name">{idx.name || idx.symbol}</span>
                  <span className="ti-value">{formatNumber(idx.value)}</span>
                  <span className={`ti-change ${changeClass}`}>{sign}{idx.change}%</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
