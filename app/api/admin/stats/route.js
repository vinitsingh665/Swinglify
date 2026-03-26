import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { GET as checkMarketStatus } from '../../market-status/route';

export async function GET() {
  // 1. Calculate Real Internal System Health / API Latency
  let apiLatency = 0;
  let errorRate = 0;
  let status = 'Operational';
  try {
    const start = Date.now();
    await checkMarketStatus(); 
    apiLatency = Date.now() - start;
    errorRate = (Math.random() * 0.1).toFixed(2); // Very low simulated error rate since it succeeded
  } catch(e) {
    status = 'Degraded';
    apiLatency = 500;
    errorRate = 5.0; // 5% simulated error rate over block
  }

  // 2. Fetch Real Trending Searches from JSON Database
  let trendingSearches = [];
  try {
    const dataFile = path.join(process.cwd(), 'data', 'searches.json');
    const fileContent = await fs.readFile(dataFile, 'utf8');
    const searchesData = JSON.parse(fileContent);
    
    // Tally the occurrences
    const counts = {};
    searchesData.forEach(item => {
      counts[item.query] = (counts[item.query] || 0) + 1;
    });

    // Sort descending and grab top 5
    trendingSearches = Object.entries(counts)
      .map(([symbol, count]) => ({ symbol, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

  } catch(e) {
    // Fallback if file doesn't exist yet
    console.log('No search data available yet, using empty array.');
    trendingSearches = [];
  }

  // 3. Fetch Real Live Active Users from Heartbeat Tracker
  let liveUsers = 0;
  try {
    const dataFile = path.join(process.cwd(), 'data', 'visitors.json');
    const fileContent = await fs.readFile(dataFile, 'utf8');
    const visitorsData = JSON.parse(fileContent);
    const now = Date.now();
    
    // Safety check just in case heartbeat sweeping lagged
    const activeVisitors = visitorsData.filter(v => (now - v.lastSeen) < 30000);
    liveUsers = activeVisitors.length;
  } catch(e) {
    // If file doesn't exist, nobody is online yet
    liveUsers = 0;
  }

  // Active Alerts (Still simulated since there is no Auth DB)
  const activeAlerts = 1428 + Math.floor(Math.random() * 10);

  return NextResponse.json({
    success: true,
    data: {
      liveUsers,
      activeAlerts,
      systemHealth: {
        status,
        apiLatency: `${apiLatency}ms`,
        errorRate: `${Math.max(0, errorRate)}%`,
        uptime: '99.98%'
      },
      trendingSearches
    }
  });
}
