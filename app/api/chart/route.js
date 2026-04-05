import { NextResponse } from 'next/server';

// In-memory cache for chart data
const chartCache = new Map();
const CHART_CACHE_TTL = 20 * 1000; // 20 seconds

// Map our index names to Yahoo Finance tickers
const INDEX_TICKERS = {
  'nifty50':     '^NSEI',
  'banknifty':   '^NSEBANK',
  'midcap100':   'NIFTY_MIDCAP_100.NS', // Supports both Intraday and Historical
  'smallcap100': 'HDFCSML250.NS', // Proxy ETF for Smallcap because ^CNXSC lacks history on Yahoo
  'sensex':      '^BSESN',
};

// Map period buttons to Yahoo Finance params
const PERIOD_CONFIG = {
  '1D': { interval: '5m',  range: '1d'  },
  '1W': { interval: '15m', range: '5d'  },
  '1Y': { interval: '1d',  range: '1y'  },
  'Max': { interval: '1wk', range: 'max' },
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const index = searchParams.get('index') || 'nifty50';
    const period = searchParams.get('period') || '1D';
    const stockSymbol = searchParams.get('symbol'); // e.g. "RELIANCE"

    // If a specific stock symbol is provided, use it; otherwise map from index
    let ticker;
    let isStock = false;
    if (stockSymbol) {
      ticker = `${stockSymbol.toUpperCase()}.NS`;
      isStock = true;
    } else {
      ticker = INDEX_TICKERS[index] || '^NSEI';
    }
    const config = PERIOD_CONFIG[period] || PERIOD_CONFIG['1D'];
    
    const cacheKey = `chart_${ticker}_${period}`;
    const cached = chartCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CHART_CACHE_TTL) {
      return NextResponse.json({ ...cached.data, cached: true });
    }

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=${config.interval}&range=${config.range}&includePrePost=false`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Yahoo Finance returned ${response.status}`);
    }

    const json = await response.json();
    const result = json?.chart?.result?.[0];

    if (!result) {
      throw new Error('No chart data available');
    }

    const timestamps = result.timestamp || [];
    const quotes = result.indicators?.quote?.[0] || {};
    const meta = result.meta || {};

    // Build chart points - filter out null values
    const points = [];
    for (let i = 0; i < timestamps.length; i++) {
      const close = quotes.close?.[i];
      if (close != null && !isNaN(close)) {
        points.push({
          time: timestamps[i] * 1000, // Convert to milliseconds
          value: Math.round(close * 100) / 100,
          open: quotes.open?.[i] ? Math.round(quotes.open[i] * 100) / 100 : null,
          high: quotes.high?.[i] ? Math.round(quotes.high[i] * 100) / 100 : null,
          low: quotes.low?.[i] ? Math.round(quotes.low[i] * 100) / 100 : null,
          volume: quotes.volume?.[i] || 0,
        });
      }
    }

    const responseData = {
      success: true,
      ticker,
      index,
      period,
      isStock,
      stockSymbol: stockSymbol || null,
      name: meta.shortName || meta.symbol || ticker,
      currentPrice: meta.regularMarketPrice ? Math.round(meta.regularMarketPrice * 100) / 100 : null,
      previousClose: meta.chartPreviousClose ? Math.round(meta.chartPreviousClose * 100) / 100 : null,
      points,
      lastUpdated: new Date().toISOString(),
    };

    chartCache.set(cacheKey, { data: responseData, timestamp: Date.now() });
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Chart API error:', error.message);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch chart data', details: error.message },
      { status: 500 }
    );
  }
}
