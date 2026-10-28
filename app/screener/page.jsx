import { fetchFromTradingView, parseStockData, FIELDS } from '../../lib/api-core';
import ScreenerClient from './ScreenerClient';
import { Suspense } from 'react';

// ISR: revalidate every 10 minutes (stock data stays fresh but cacheable on CDN)
export const revalidate = 600;

// Sector list — same as the API route
const SECTORS = [
  'Technology', 'Finance', 'Health Technology', 'Consumer Non-Durables',
  'Energy Minerals', 'Process Industries', 'Producer Manufacturing',
  'Consumer Durables', 'Consumer Services', 'Industrial Services',
  'Utilities', 'Non-Energy Minerals', 'Communications',
  'Distribution Services', 'Transportation', 'Retail Trade',
  'Commercial Services', 'Electronic Technology', 'Health Services',
  'Miscellaneous'
];

// Server-side: pre-fetch default screener data (Swing preset: price above EMA50, sorted by volume)
async function getInitialStocks() {
  try {
    const filters = [
      { left: 'is_primary', operation: 'equal', right: true },
      { left: 'exchange', operation: 'equal', right: 'NSE' },
      { left: 'market_cap_basic', operation: 'greater', right: 1000000000 },
    ];

    const tvBody = {
      filter: filters,
      symbols: { query: { types: ['stock'] } },
      columns: FIELDS,
      sort: { sortBy: 'volume', sortOrder: 'desc' },
      range: [0, 200],
    };

    const tvData = await fetchFromTradingView(tvBody);
    const stocks = parseStockData(tvData);
    return stocks;
  } catch (e) {
    console.error('[Screener SSR] Failed to pre-fetch:', e);
    return [];
  }
}

export default async function ScreenerPage() {
  const initialStocks = await getInitialStocks();

  return (
    <Suspense fallback={null}>
      <ScreenerClient
        initialStocks={initialStocks}
        initialSectors={SECTORS}
      />
    </Suspense>
  );
}
