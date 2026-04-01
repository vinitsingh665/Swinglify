export default function MarketMarquee() {
  // Mock live data to give the authentic trading terminal feel right on load
  const tickers = [
    { sym: 'NIFTY 50', val: '22,419.55', chg: '+0.54%' },
    { sym: 'BANKNIFTY', val: '47,581.00', chg: '+0.82%' },
    { sym: 'RELIANCE', val: '2,890.15', chg: '+1.20%' },
    { sym: 'TCS', val: '4,015.60', chg: '-0.35%' },
    { sym: 'INFY', val: '1,502.80', chg: '-1.10%' },
    { sym: 'HDFCBANK', val: '1,440.00', chg: '+0.45%' },
    { sym: 'ICICIBANK', val: '1,050.25', chg: '+1.05%' },
    { sym: 'SBIN', val: '755.30', chg: '+2.10%' },
    { sym: 'ITC', val: '412.00', chg: '+0.15%' },
  ];

  const items = [...tickers, ...tickers, ...tickers]; // Triplicate for endless loop

  return (
    <div className="landing-marquee">
      <div className="marquee-content">
        {items.map((t, i) => {
          const isUp = t.chg.startsWith('+');
          return (
            <div className="ticker-item" key={i}>
              <span className="ticker-sym">{t.sym}</span>
              <span style={{ color: 'rgba(255,255,255,0.9)' }}>{t.val}</span>
              <span className={isUp ? "ticker-pos" : "ticker-neg"}>
                {isUp ? '▲' : '▼'}{t.chg}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
