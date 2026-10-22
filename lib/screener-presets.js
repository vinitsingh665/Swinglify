export const SCREENER_PRESETS = {
  'rsi-oversold': {
    slug: 'rsi-oversold',
    badge: 'Dip Buying / Reversal',
    title: 'RSI Oversold Stocks on NSE (RSI < 30)',
    metaTitle: 'RSI Oversold Stocks NSE Today (Below 30) | Free Swing Screener',
    metaDescription: 'Live list of RSI oversold stocks on NSE today. Identify high-probability swing trading bounce setups and mean-reversion opportunities with 14-day RSI under 30.',
    keywords: [
      'rsi oversold stocks nse',
      'oversold stocks today india',
      'stocks with rsi below 30 india',
      'swing trade oversold stocks nse',
      'mean reversion stocks nse',
    ],
    description: 'Discover Indian equities currently trading in deeply oversold territory with 14-day RSI under 30. Oversold conditions often precede strong mean-reversion bounces for disciplined swing traders looking for entry points near key supports.',
    filters: {
      exchange: 'NSE', priceMin: '', priceMax: '', changeMin: '', volumeMin: '',
      rsiMode: 'oversold', emaMode: null, marketCap: null, sector: null, signal: null,
      sortBy: 'volume', sortOrder: 'desc'
    },
    tvQuery: {
      filter: [
        { left: 'is_primary', operation: 'equal', right: true },
        { left: 'exchange', operation: 'equal', right: 'NSE' },
        { left: 'RSI', operation: 'less', right: 30 },
      ],
      sort: { sortBy: 'volume', sortOrder: 'desc' },
      range: [0, 100],
    }
  },

  'volume-breakouts': {
    slug: 'volume-breakouts',
    badge: 'Institutional Accumulation',
    title: 'Volume Breakout Stocks on NSE Today',
    metaTitle: 'Volume Breakout Stocks NSE Today — Unusual Volume Scanner',
    metaDescription: 'Scan NSE stocks breaking out on unusual heavy volume today. Spot institutional accumulation and momentum surges across Indian markets on Swinglify.',
    keywords: [
      'volume breakout stocks nse',
      'high volume breakout stocks today',
      'unusual volume screener india',
      'breakout stocks nse bse',
      'momentum breakout stocks india',
    ],
    description: 'Volume precedes price. These Indian stocks are experiencing heavy volume surges surpassing their 10-day moving average and breaking above their upper Bollinger Band, signalling institutional interest and potential momentum continuation.',
    filters: {
      exchange: 'NSE', priceMin: '', priceMax: '', changeMin: '', volumeMin: '',
      rsiMode: null, emaMode: null, marketCap: null, sector: null, signal: null,
      sortBy: 'volume', sortOrder: 'desc'
    },
    tvQuery: {
      filter: [
        { left: 'is_primary', operation: 'equal', right: true },
        { left: 'exchange', operation: 'equal', right: 'NSE' },
        { left: 'close', operation: 'greater', right: 'BB.upper' },
        { left: 'volume', operation: 'greater', right: 'average_volume_10d_calc' },
      ],
      sort: { sortBy: 'volume', sortOrder: 'desc' },
      range: [0, 100],
    }
  },

  'golden-cross': {
    slug: 'golden-cross',
    badge: 'Bullish Trend Structure',
    title: 'Golden Cross & Bullish Trend Stocks (NSE)',
    metaTitle: 'Golden Cross Stocks NSE — Bullish Moving Average Screener',
    metaDescription: 'Find Golden Cross and structural uptrend stocks on NSE. Screen Indian stocks where short-term moving averages have crossed above long-term averages.',
    keywords: [
      'golden cross stocks nse',
      'bullish trend stocks india',
      'ema crossover screener nse',
      'stocks above 200 ema india',
      'swing trading trend following nse',
    ],
    description: 'Golden Cross formations occur when a faster moving average rises above a longer-term trend benchmark (EMA 50 crossing above EMA 200). These stocks exhibit strong structural buyer support and favorable risk-reward setups.',
    filters: {
      exchange: 'NSE', priceMin: '', priceMax: '', changeMin: '', volumeMin: '',
      rsiMode: null, emaMode: 'golden', marketCap: null, sector: null, signal: null,
      sortBy: 'volume', sortOrder: 'desc'
    },
    tvQuery: {
      filter: [
        { left: 'is_primary', operation: 'equal', right: true },
        { left: 'exchange', operation: 'equal', right: 'NSE' },
        { left: 'EMA50', operation: 'greater', right: 'EMA200' },
        { left: 'close', operation: 'greater', right: 'EMA50' },
      ],
      sort: { sortBy: 'volume', sortOrder: 'desc' },
      range: [0, 100],
    }
  },

  '52-week-high': {
    slug: '52-week-high',
    badge: 'Market Leaders',
    title: 'Stocks Near 52-Week High (NSE & BSE)',
    metaTitle: 'Stocks Near 52-Week High NSE Today — Momentum Leader Screener',
    metaDescription: 'Track Indian stocks trading near or hitting fresh 52-week highs on the NSE & BSE. Spot leading momentum stocks and stage-2 breakouts across Indian equity markets.',
    keywords: [
      'stocks near 52 week high nse',
      '52 week high breakout stocks india',
      'momentum stocks nse today',
      'stage 2 breakout stocks india',
      'all time high stocks nse',
    ],
    description: 'Stocks hovering near 52-week highs demonstrate exceptional relative strength against the broader market. Leading institutions continually accumulate stocks breaking through annual highs.',
    filters: {
      exchange: 'NSE', priceMin: '', priceMax: '', changeMin: '', volumeMin: '',
      rsiMode: null, emaMode: null, marketCap: null, sector: null, signal: null,
      sortBy: 'change', sortOrder: 'desc'
    },
    tvQuery: {
      filter: [
        { left: 'is_primary', operation: 'equal', right: true },
        { left: 'exchange', operation: 'equal', right: 'NSE' },
        { left: 'price_52_week_high', operation: 'greater', right: 0 },
      ],
      sort: { sortBy: 'change', sortOrder: 'desc' },
      range: [0, 100],
    }
  },

  'top-gainers': {
    slug: 'top-gainers',
    badge: 'Momentum Movers',
    title: 'Top Gaining Stocks on NSE Today',
    metaTitle: 'Top Gainers NSE Today — Live Stock Screener & Technicals',
    metaDescription: 'Track top stock gainers on NSE today with real-time percentage moves, RSI, MACD, and volume analysis. Find active swing trading momentum opportunities.',
    keywords: [
      'top gainers nse today',
      'top gainer stocks india',
      'high percentage gainers nse',
      'live market movers nse',
      'swing trade momentum gainers',
    ],
    description: 'Track today’s highest percentage gainers across NSE listed equities with real-time price updates, volume expansion, and technical signal ratings on Swinglify.',
    initialIndex: 'gainers',
    filters: {
      exchange: 'NSE', priceMin: '', priceMax: '', changeMin: '', volumeMin: '',
      rsiMode: null, emaMode: null, marketCap: null, sector: null, signal: null,
      sortBy: 'change', sortOrder: 'desc'
    },
    tvQuery: {
      filter: [
        { left: 'is_primary', operation: 'equal', right: true },
        { left: 'exchange', operation: 'equal', right: 'NSE' },
        { left: 'change', operation: 'greater', right: 0 },
      ],
      sort: { sortBy: 'change', sortOrder: 'desc' },
      range: [0, 100],
    }
  }
};
