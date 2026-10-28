"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

const PERIODS = ['1D', '1W', '1Y', 'Max'];

export default function StockChart({ symbol }) {
  const canvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const containerRef = useRef(null);
  const [activePeriod, setActivePeriod] = useState('1D');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoverInfo, setHoverInfo] = useState(null);
  const timerRef = useRef(null);
  const chartMetaRef = useRef(null);

  const fetchChart = useCallback(async () => {
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
    try {
      const url = `/api/chart?symbol=${encodeURIComponent(symbol)}&period=${activePeriod}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setChartData(data);
      } else {
        setChartData(null);
      }
    } catch (e) {
      console.error('Stock chart fetch failed:', e);
      setChartData(null);
    } finally {
      setLoading(false);
    }
  }, [symbol, activePeriod]);

  useEffect(() => {
    setLoading(true);
    fetchChart();
    timerRef.current = setInterval(fetchChart, 30000);
    return () => clearInterval(timerRef.current);
  }, [fetchChart]);

  // Draw the MAIN chart (only when data/period changes — NOT on hover)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const overlay = overlayCanvasRef.current;
    if (overlay) {
      overlay.width = rect.width * dpr;
      overlay.height = rect.height * dpr;
    }

    const padding = { top: 12, right: 55, bottom: 32, left: 10 };
    const chartW = rect.width - padding.left - padding.right;
    const chartH = rect.height - padding.top - padding.bottom;

    if (!chartData?.points?.length) {
      ctx.fillStyle = '#555';
      ctx.font = '12px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(loading ? 'Loading chart…' : 'No data available', rect.width / 2, rect.height / 2);
      chartMetaRef.current = null;
      return;
    }

    const points = chartData.points;
    const values = points.map(p => p.value);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = maxVal - minVal || 1;
    const isPositive = values[values.length - 1] >= values[0];
    const lineColor = isPositive ? '#22c55e' : '#ef4444';
    const fillTop = isPositive ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)';

    chartMetaRef.current = { padding, chartW, chartH, minVal, maxVal, range, lineColor, rectW: rect.width, rectH: rect.height };

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(rect.width - padding.right, y);
      ctx.stroke();
    }

    // Prev close line (1D)
    const prevClose = chartData.previousClose;
    if (activePeriod === '1D' && prevClose && prevClose >= minVal && prevClose <= maxVal) {
      const prevY = padding.top + chartH - ((prevClose - minVal) / range) * chartH;
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding.left, prevY);
      ctx.lineTo(rect.width - padding.right, prevY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#666';
      ctx.font = '9px Inter, system-ui';
      ctx.textAlign = 'right';
      ctx.fillText('Prev Close', rect.width - 4, prevY - 4);
    }

    // Area fill
    const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
    gradient.addColorStop(0, fillTop);
    gradient.addColorStop(1, 'transparent');
    ctx.beginPath();
    points.forEach((p, i) => {
      const x = padding.left + (i / (points.length - 1)) * chartW;
      const y = padding.top + chartH - ((p.value - minVal) / range) * chartH;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.lineTo(padding.left + chartW, padding.top + chartH);
    ctx.lineTo(padding.left, padding.top + chartH);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    points.forEach((p, i) => {
      const x = padding.left + (i / (points.length - 1)) * chartW;
      const y = padding.top + chartH - ((p.value - minVal) / range) * chartH;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Live dot
    const lastPt = points[points.length - 1];
    const dotX = padding.left + chartW;
    const dotY = padding.top + chartH - ((lastPt.value - minVal) / range) * chartH;
    ctx.beginPath();
    ctx.arc(dotX, dotY, 6, 0, Math.PI * 2);
    ctx.fillStyle = isPositive ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
    ctx.fillStyle = lineColor;
    ctx.fill();

    // Y labels
    ctx.fillStyle = '#555';
    ctx.font = '10px Inter, system-ui';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const val = maxVal - (range / 4) * i;
      const y = padding.top + (chartH / 4) * i + 3;
      ctx.fillText('₹' + val.toFixed(2), rect.width - 4, y);
    }

    // X labels
    ctx.fillStyle = '#555';
    ctx.font = '10px Inter, system-ui';
    ctx.textAlign = 'center';
    const labelCount = 5;
    for (let i = 0; i < labelCount; i++) {
      const idx = Math.floor((i / (labelCount - 1)) * (points.length - 1));
      const pt = points[idx];
      const d = new Date(pt.time);
      let label;
      if (activePeriod === '1D') label = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
      else if (activePeriod === '1W') label = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
      else label = d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
      const x = padding.left + (i / (labelCount - 1)) * chartW;
      ctx.fillText(label, x, rect.height - 8);
    }
  }, [chartData, loading, activePeriod]);

  // Draw crosshair on a SEPARATE overlay canvas (purely imperative, no React re-render)
  const drawCrosshair = useCallback((info) => {
    const overlay = overlayCanvasRef.current;
    const meta = chartMetaRef.current;
    if (!overlay || !meta) return;
    const dpr = window.devicePixelRatio || 1;
    const ctx = overlay.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, meta.rectW, meta.rectH);
    if (!info) return;

    const { padding, chartH, minVal, range, lineColor, rectW } = meta;
    const hoverY = padding.top + chartH - ((info.price - minVal) / range) * chartH;

    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(info.x, padding.top);
    ctx.lineTo(info.x, padding.top + chartH);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(padding.left, hoverY);
    ctx.lineTo(rectW - padding.right, hoverY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.arc(info.x, hoverY, 4, 0, Math.PI * 2);
    ctx.fillStyle = lineColor;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!chartData?.points?.length || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const padding = { left: 10, right: 55 };
    const chartW = rect.width - padding.left - padding.right;
    const ratio = (x - padding.left) / chartW;
    const idx = Math.max(0, Math.min(chartData.points.length - 1, Math.round(ratio * (chartData.points.length - 1))));
    const pt = chartData.points[idx];
    if (pt) {
      const info = { price: pt.value, time: pt.time, x, high: pt.high, low: pt.low, volume: pt.volume };
      drawCrosshair(info);
      setHoverInfo(info);
    }
  }, [chartData, drawCrosshair]);

  const handleMouseLeave = useCallback(() => {
    drawCrosshair(null);
    setHoverInfo(null);
  }, [drawCrosshair]);

  return (
    <div className="stock-chart-container">
      <div className="stock-chart-header">
        <div className="stock-chart-title">
          <span className="stock-chart-label">{symbol} • NSE</span>
          {loading && <span className="stock-chart-updating">Updating…</span>}
        </div>
        <div className="stock-chart-periods">
          {PERIODS.map(p => (
            <button
              key={p}
              className={`stock-chart-period-btn ${activePeriod === p ? 'active' : ''}`}
              onClick={() => setActivePeriod(p)}
            >{p}</button>
          ))}
        </div>
      </div>

      {/* Tooltip — always rendered with fixed height to prevent layout shifts */}
      <div className="stock-chart-tooltip" style={{ visibility: hoverInfo ? 'visible' : 'hidden', minHeight: 24 }}>
        <span className="stock-chart-tooltip-price">₹{hoverInfo?.price?.toFixed(2) || '0.00'}</span>
        <span className="stock-chart-tooltip-time">
          {hoverInfo ? new Date(hoverInfo.time).toLocaleString('en-IN', {
            day: 'numeric', month: 'short',
            hour: '2-digit', minute: '2-digit', hour12: true,
          }) : '\u00A0'}
        </span>
        {hoverInfo?.high && (
          <span className="stock-chart-tooltip-hl">
            H: ₹{hoverInfo.high.toFixed(2)} · L: ₹{hoverInfo.low?.toFixed(2)}
          </span>
        )}
      </div>

      {/* Canvas — two layers: base chart + overlay for crosshair */}
      <div
        className="stock-chart-canvas-wrap"
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ touchAction: 'none', position: 'relative' }}
      >
        <canvas ref={canvasRef} className="stock-chart-canvas" />
        <canvas
          ref={overlayCanvasRef}
          className="stock-chart-canvas"
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
        />
      </div>

      <div className="stock-chart-footer">
        <span>Data from Yahoo Finance</span>
        <span>Auto-refreshes every 30s</span>
      </div>
    </div>
  );
}
