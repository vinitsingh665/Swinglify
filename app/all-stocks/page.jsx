import { fetchFromTradingView } from '../../lib/api-core';
import Link from 'next/link';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import DirectoryClient from './DirectoryClient';
import './all-stocks.css';

export const metadata = {
  title: 'All NSE & BSE Stocks A-Z Directory',
  description: 'Complete alphabetized directory of all 3,000+ NSE and BSE stocks available for technical analysis and swing trading on Swinglify.',
};

export const revalidate = 86400; // Recache once a day

async function fetchAllStocks() {
  const body = {
    filter: [{ left: 'is_primary', operation: 'equal', right: true }],
    symbols: { query: { types: ['stock'] } },
    columns: ['name'],
    sort: { sortBy: 'name', sortOrder: 'asc' },
    range: [0, 4000],
  };

  try {
    const tvData = await fetchFromTradingView(body);
    if (!tvData?.data) return {};

    // Group by first letter
    const grouped = {};
    for (let charCode = 65; charCode <= 90; charCode++) {
      grouped[String.fromCharCode(charCode)] = [];
    }
    grouped['#'] = []; // For numbers or symbols

    tvData.data.forEach(item => {
      const sym = item.d[0];
      if (/^[a-zA-Z0-9]+$/.test(sym)) {
        const firstChar = sym.charAt(0).toUpperCase();
        if (grouped[firstChar]) {
          grouped[firstChar].push(sym);
        } else {
          grouped['#'].push(sym);
        }
      }
    });

    // Remove empty groups & deduplicate
    Object.keys(grouped).forEach(k => {
      if (grouped[k].length === 0) {
        delete grouped[k];
      } else {
        grouped[k] = [...new Set(grouped[k])];
      }
    });

    return grouped;
  } catch (err) {
    console.error('Directory fetch failed:', err);
    return {};
  }
}

export default async function AllStocksDirectory() {
  const groupedStocks = await fetchAllStocks();
  const letters = Object.keys(groupedStocks).sort();

  return (
    <div className="app-layout" data-theme="dark">
      <Sidebar />
      <div className="main-area">
        <TopBar />
        <div className="directory-page">
          <div className="directory-header">
            <h1>Stock Directory A-Z</h1>
            <p>Browse technical analysis for over 3,000+ NSE and BSE listed stocks.</p>
          </div>
          
          <DirectoryClient groupedStocks={groupedStocks} letters={letters} />
        </div>
      </div>
    </div>
  );
}
