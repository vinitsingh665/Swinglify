"use client";

function TrendCard({ idx }) {
  if (!idx) return null;

  const isUp = (idx.change || 0) >= 0;

  return (
    <div className="mt-card">
      <div className="mt-card-header">
        <span className="mt-card-name">{idx.name}</span>
        <div>
          <span className="mt-card-value">{idx.value?.toLocaleString('en-IN')}</span>
          <span className={`mt-card-change ${isUp ? 'up' : 'down'}`}>
            {isUp ? '+' : ''}{idx.change?.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="mt-perfs">
        <div className="mt-perf">
          <span className="mt-perf-label">1D</span>
          <span className={`mt-perf-val ${(idx.change||0) >= 0 ? 'up' : 'down'}`}>{(idx.change||0) >= 0 ? '+' : ''}{idx.change?.toFixed(2)}%</span>
        </div>
        <div className="mt-perf">
          <span className="mt-perf-label">1W</span>
          <span className={`mt-perf-val ${(idx.perfWeek||0) >= 0 ? 'up' : 'down'}`}>{(idx.perfWeek||0) >= 0 ? '+' : ''}{idx.perfWeek?.toFixed(2)}%</span>
        </div>
        <div className="mt-perf">
          <span className="mt-perf-label">1M</span>
          <span className={`mt-perf-val ${(idx.perfMonth||0) >= 0 ? 'up' : 'down'}`}>{(idx.perfMonth||0) >= 0 ? '+' : ''}{idx.perfMonth?.toFixed(2)}%</span>
        </div>
        <div className="mt-perf">
          <span className="mt-perf-label">YTD</span>
          <span className={`mt-perf-val ${(idx.perfYTD||0) >= 0 ? 'up' : 'down'}`}>{(idx.perfYTD||0) >= 0 ? '+' : ''}{idx.perfYTD?.toFixed(2)}%</span>
        </div>
      </div>
    </div>
  );
}

export default function MarketTrends({ indices }) {
  if (!indices) return null;

  const nifty = indices.find(i => i.symbol === 'NIFTY');
  const bankNifty = indices.find(i => i.symbol === 'BANKNIFTY');
  const midcap = indices.find(i => i.symbol === 'NIFTY_MID_SELECT');

  return (
    <div className="mkt-trends">
      <div className="mt-title">Market Trends</div>
      <div className="mt-cards">
        <TrendCard idx={nifty} />
        <TrendCard idx={bankNifty} />
        <TrendCard idx={midcap} />
      </div>
    </div>
  );
}
