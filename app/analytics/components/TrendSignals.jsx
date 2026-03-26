"use client";

function SignalCard({ title, data, type }) {
  const { count, stocks } = data || { count: 0, stocks: [] };

  let cls = 'blue';
  if (type === 'bull') cls = 'green';
  if (type === 'bear') cls = 'red';
  if (type === 'accent') cls = 'accent';

  return (
    <div className="ts-card">
      <div className="ts-header">
        <span className="ts-label">{title}</span>
        <span className={`ts-count ${cls}`}>{count}</span>
      </div>
      <div className="ts-chips">
        {(stocks || []).map(s => {
          const isUp = (s.change || 0) >= 0;
          return (
            <div key={s.symbol} className="ts-chip" title={`${s.name} (₹${s.price})`}>
              {s.logo ? <img src={s.logo} className="ts-chip-logo" alt="" /> : null}
              <span>{s.symbol}</span>
              <span className={`ts-chip-change ${isUp ? 'up' : 'down'}`}>
                {isUp ? '+' : ''}{s.change?.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TrendSignals({ signals }) {
  if (!signals) return null;

  return (
    <div className="trend-signals">
      <SignalCard
        title="RSI Oversold (<30)"
        data={signals.rsiOversold}
        type="bull"
      />
      <SignalCard
        title="RSI Overbought (>70)"
        data={signals.rsiOverbought}
        type="bear"
      />
      <SignalCard
        title="EMA Crossover (50>200)"
        data={signals.emaCrossover}
        type="accent"
      />
      <SignalCard
        title="52W Breakouts"
        data={signals.breakouts}
        type="blue"
      />
    </div>
  );
}
