import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Swinglify — Simplifying your Swing Trades';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #0a0a1a 0%, #0d0d2b 40%, #1a0a2e 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid background */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          display: 'flex',
        }} />

        {/* Glow circles */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px',
          width: '400px', height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)',
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', left: '-80px',
          width: '350px', height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)',
          display: 'flex',
        }} />

        {/* Main content */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          zIndex: 1,
        }}>
          {/* Logo name */}
          <div style={{
            fontSize: '72px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #ffffff 0%, #c7d2fe 50%, #818cf8 100%)',
            backgroundClip: 'text',
            color: 'transparent',
            letterSpacing: '-2px',
            display: 'flex',
          }}>
            Swinglify
          </div>

          {/* Tagline */}
          <div style={{
            fontSize: '28px',
            color: 'rgba(255,255,255,0.7)',
            fontWeight: '400',
            letterSpacing: '1px',
            display: 'flex',
          }}>
            Simplifying your Swing Trades
          </div>

          {/* Separator line */}
          <div style={{
            width: '120px',
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #6366f1, transparent)',
            borderRadius: '4px',
            margin: '8px 0',
            display: 'flex',
          }} />

          {/* Feature pills */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginTop: '8px',
          }}>
            {['Stock Screener', 'Portfolio Tracker', 'Price Alerts', 'Community'].map((f) => (
              <div key={f} style={{
                padding: '8px 20px',
                borderRadius: '20px',
                background: 'rgba(99,102,241,0.15)',
                border: '1px solid rgba(99,102,241,0.3)',
                color: '#c7d2fe',
                fontSize: '16px',
                fontWeight: '500',
                display: 'flex',
              }}>
                {f}
              </div>
            ))}
          </div>

          {/* Bottom tag */}
          <div style={{
            marginTop: '24px',
            fontSize: '18px',
            color: 'rgba(255,255,255,0.4)',
            fontWeight: '500',
            letterSpacing: '3px',
            display: 'flex',
          }}>
            NSE &bull; BSE &bull; FREE
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
