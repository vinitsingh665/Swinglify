"use client";
import { formatTime } from '../utils';

export default function StatsBar({ stockCount, categoryName, lastUpdated, avgChange }) {
  return (
    <div className="stats-bar">
      <div className="stat-item">
        <span className="stat-label">Stocks</span>
        <span className="stat-value">{stockCount}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Category</span>
        <span className="stat-value">{categoryName}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Last Updated</span>
        <span className="stat-value">{formatTime(lastUpdated)}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Avg Change</span>
        <span className="stat-value" style={{ color: avgChange >= 0 ? 'var(--green)' : 'var(--red)' }}>
          {avgChange >= 0 ? '+' : ''}{avgChange.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}
