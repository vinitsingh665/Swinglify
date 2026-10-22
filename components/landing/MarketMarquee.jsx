"use client";

export default function MarketMarquee() {
  const tickers = [
    { sym: 'NIFTY 50', val: '24,850.20', chg: '+0.45%', isUp: true },
    { sym: 'BANK NIFTY', val: '51,240.60', chg: '+0.82%', isUp: true },
    { sym: 'SENSEX', val: '81,425.10', chg: '+0.38%', isUp: true },
    { sym: 'INDIA VIX', val: '13.25', chg: '-3.10%', isUp: false },
    { sym: 'RELIANCE', val: '₹2,940.50', chg: '+1.65%', isUp: true },
    { sym: 'TATAMOTORS', val: '₹984.60', chg: '+3.45%', isUp: true },
    { sym: 'TRENT', val: '₹5,420.00', chg: '+5.82%', isUp: true },
    { sym: 'HDFCBANK', val: '₹1,680.10', chg: '+0.95%', isUp: true },
    { sym: 'ZOMATO', val: '₹274.20', chg: '+4.12%', isUp: true },
    { sym: 'TCS', val: '₹4,120.00', chg: '-0.40%', isUp: false },
    { sym: 'BAJFINANCE', val: '₹7,250.00', chg: '+2.15%', isUp: true },
    { sym: 'ICICIBANK', val: '₹1,240.80', chg: '+1.30%', isUp: true },
  ];

  // Triplicate array for smooth endless loop
  const displayItems = [...tickers, ...tickers, ...tickers];

  return (
    <div className="landing-marquee-wrapper" aria-hidden="true">
      <div className="landing-marquee-track">
        {displayItems.map((item, index) => (
          <div key={index} className="marquee-ticker-pill">
            <span className="marquee-pill-sym">{item.sym}</span>
            <span className="marquee-pill-val">{item.val}</span>
            <span className={`marquee-pill-chg ${item.isUp ? 'pos' : 'neg'}`}>
              {item.isUp ? '▲' : '▼'} {item.chg}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
