export async function generateMetadata({ params }) {
  const { ticker } = await params;
  const symbol = ticker.toUpperCase();

  return {
    title: `${symbol} Share Price, RSI, MACD & Technical Analysis`,
    description: `${symbol} live share price, RSI, MACD, Bollinger Bands & EMA analysis. Free swing trading signals for ${symbol} on NSE & BSE — Swinglify.`.slice(0, 155),
    keywords: [
      `${symbol} share price`,
      `${symbol} share price today`,
      `${symbol} RSI`,
      `${symbol} MACD`,
      `${symbol} technical analysis`,
      `${symbol} swing trading`,
      `${symbol} stock analysis`,
      `${symbol} NSE`,
      `${symbol} BSE`,
      `${symbol} Bollinger Bands`,
      `${symbol} EMA`,
      `buy or sell ${symbol}`,
    ],
    alternates: {
      canonical: `https://swinglify.online/stock/${symbol}`,
    },
    openGraph: {
      title: `${symbol} — Live Price & Technical Analysis | Swinglify`,
      description: `Real-time ${symbol} analysis with RSI, MACD, Bollinger Bands & AI swing trading signals. Free on Swinglify.`,
      url: `https://swinglify.online/stock/${symbol}`,
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `${symbol} stock analysis on Swinglify` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${symbol} Share Price & Analysis | Swinglify`,
      description: `${symbol} live price, RSI, MACD analysis. Free swing trading signals.`,
      images: ['/og-image.png'],
    },
  };
}

export default async function StockLayout({ children }) {
  return children;
}
