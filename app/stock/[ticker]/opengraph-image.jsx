import { ImageResponse } from 'next/og';
import { fetchFromTradingView, parseStockData, FIELDS } from '../../../lib/api-core';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }) {
  const { ticker } = await params;
  const symbol = (ticker || 'STOCK').toUpperCase();

  let priceStr = null;
  let changeStr = null;
  let isUp = true;
  let rsiStr = null;
  let signalStr = 'BUY / SELL SIGNAL';

  try {
    const body = {
      filter: [{ left: 'name,logoid,description', operation: 'match', right: symbol }],
      symbols: { query: { types: ['stock'] } },
      columns: FIELDS,
      range: [0, 5],
    };
    const tvData = await fetchFromTradingView(body);
    const stocks = parseStockData(tvData);
    const exact = stocks.find(s => s.symbol === symbol) || stocks[0];
    if (exact) {
      priceStr = `₹${exact.price?.toLocaleString('en-IN')}`;
      isUp = (exact.change || 0) >= 0;
      changeStr = `${isUp ? '+' : ''}${(exact.change || 0).toFixed(2)}%`;
      if (exact.rsi != null) rsiStr = `RSI: ${exact.rsi.toFixed(1)}`;
      if (exact.indicatorScore?.label) signalStr = exact.indicatorScore.label;
    }
  } catch (e) {
    // Fallback gracefully without throwing
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 70px',
          background: 'linear-gradient(135deg, #090a16 0%, #0d0f28 50%, #150d2e 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow ambient background circles */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            right: '-120px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Top Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            >
              S
            </div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.5px' }}>
              Swinglify
            </div>
          </div>

          <div
            style={{
              padding: '8px 18px',
              borderRadius: '999px',
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.35)',
              color: '#c7d2fe',
              fontSize: '18px',
              fontWeight: '600',
              display: 'flex',
            }}
          >
            NSE &bull; BSE LIVE
          </div>
        </div>

        {/* Center Main Symbol & Price Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '24px' }}>
            <div
              style={{
                fontSize: '84px',
                fontWeight: '900',
                color: '#ffffff',
                letterSpacing: '-2px',
                lineHeight: 1,
              }}
            >
              {symbol}
            </div>

            {priceStr && (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
                <div style={{ fontSize: '56px', fontWeight: '800', color: '#f1f5f9' }}>
                  {priceStr}
                </div>
                <div
                  style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    color: isUp ? '#22c55e' : '#ef4444',
                  }}
                >
                  {changeStr}
                </div>
              </div>
            )}
          </div>

          <div style={{ fontSize: '24px', color: 'rgba(255, 255, 255, 0.65)', fontWeight: '400' }}>
            Real-time Technical Analysis, RSI, MACD & Swing Trading Signals
          </div>
        </div>

        {/* Bottom Metrics Pill Bar */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {rsiStr && (
            <div
              style={{
                padding: '10px 22px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#e2e8f0',
                fontSize: '20px',
                fontWeight: '600',
                display: 'flex',
              }}
            >
              {rsiStr}
            </div>
          )}

          <div
            style={{
              padding: '10px 22px',
              borderRadius: '12px',
              background: signalStr.includes('BUY')
                ? 'rgba(34, 197, 94, 0.15)'
                : signalStr.includes('SELL')
                ? 'rgba(239, 68, 68, 0.15)'
                : 'rgba(99, 102, 241, 0.15)',
              border: signalStr.includes('BUY')
                ? '1px solid rgba(34, 197, 94, 0.4)'
                : signalStr.includes('SELL')
                ? '1px solid rgba(239, 68, 68, 0.4)'
                : '1px solid rgba(99, 102, 241, 0.4)',
              color: signalStr.includes('BUY')
                ? '#4ade80'
                : signalStr.includes('SELL')
                ? '#f87171'
                : '#a5b4fc',
              fontSize: '20px',
              fontWeight: '700',
              display: 'flex',
            }}
          >
            Signal: {signalStr}
          </div>

          <div
            style={{
              marginLeft: 'auto',
              color: 'rgba(255,255,255,0.4)',
              fontSize: '18px',
              fontWeight: '500',
            }}
          >
            swinglify.online/stock/{symbol}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
