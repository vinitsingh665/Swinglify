"use client";
import React from 'react';

import Link from 'next/link';

export default function SmartStockTable({ onOpenStock }) {
  const stocks = [
    { symbol: 'RELIANCE', price: '2,954.20', change: '+1.2%', isUp: true, signal: 'BUY', vol: '+142%' },
    { symbol: 'TCS', price: '3,842.10', change: '+0.8%', isUp: true, signal: 'NEUTRAL', vol: '+45%' },
    { symbol: 'HDFC', price: '1,432.50', change: '-1.5%', isUp: false, signal: 'SELL', vol: '+210%' },
    { symbol: 'INFY', price: '1,654.30', change: '+2.1%', isUp: true, signal: 'BUY', vol: '+180%' },
    { symbol: 'ITC', price: '412.80', change: '+0.4%', isUp: true, signal: 'NEUTRAL', vol: '+22%' },
    { symbol: 'ICICIBANK', price: '1,084.20', change: '-0.6%', isUp: false, signal: 'SELL', vol: '+85%' },
    { symbol: 'SBIN', price: '842.10', change: '+3.2%', isUp: true, signal: 'STRONG BUY', vol: '+320%' },
    { symbol: 'BHARTIARTL', price: '1,245.60', change: '+1.8%', isUp: true, signal: 'BUY', vol: '+115%' },
  ];

  return (
    <div className="smart-table-wrapper">
      <div className="smart-table-header">
        <div>
          <h2 className="smart-table-title">Smart List</h2>
          <span className="smart-table-subtitle">High conviction setups today</span>
        </div>
        <Link href="/screener" className="smart-table-view-all">View Full Screen</Link>
      </div>
      <table className="smart-table">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Price</th>
            <th>Signal</th>
            <th>Vol Change</th>
            <th>Trend</th>
            <th className="text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map(s => (
            <tr key={s.symbol}>
              <td>
                <div className="st-sym">{s.symbol}</div>
              </td>
              <td>
                <div className="st-price">{s.price}</div>
                <div className={`st-change ${s.isUp ? 'up' : 'down'}`}>{s.change}</div>
              </td>
              <td>
                <span className={`st-signal ${s.signal.replace(' ', '-').toLowerCase()}`}>{s.signal}</span>
              </td>
              <td>
                <div className="st-vol">{s.vol}</div>
              </td>
              <td>
                <div className="st-sparkline">
                  <svg viewBox="0 0 60 20" preserveAspectRatio="none">
                    <path d={s.isUp ? "M0,15 L15,10 L30,12 L45,5 L60,2" : "M0,5 L15,8 L30,6 L45,15 L60,18"}
                          fill="none" stroke={s.isUp ? "var(--green)" : "var(--red)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </td>
              <td className="text-right">
                <button className="st-btn" onClick={() => onOpenStock && onOpenStock(s.symbol)}>Analyze</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
