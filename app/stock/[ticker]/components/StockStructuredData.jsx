export default function StockStructuredData({ stock }) {
  if (!stock) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": `${stock.symbol} Share`,
    "description": `${stock.name} (${stock.symbol}) — Live share price ₹${stock.price?.toLocaleString('en-IN')}, RSI ${stock.rsi ?? 'N/A'}, traded on ${stock.exchange || 'NSE'}. Technical analysis and swing trading signals.`,
    "url": `https://swinglify.online/stock/${stock.symbol}`,
    "provider": {
      "@type": "Organization",
      "name": "Swinglify",
      "url": "https://swinglify.online"
    },
    "category": "Stock",
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Exchange",
        "value": stock.exchange || "NSE"
      },
      {
        "@type": "PropertyValue",
        "name": "Sector",
        "value": stock.sector || "N/A"
      },
      {
        "@type": "PropertyValue",
        "name": "Current Price",
        "value": `₹${stock.price?.toLocaleString('en-IN') ?? 'N/A'}`
      },
      {
        "@type": "PropertyValue",
        "name": "Market Cap",
        "value": stock.marketCap ? `₹${(stock.marketCap / 10000000).toFixed(0)} Cr` : "N/A"
      },
      {
        "@type": "PropertyValue",
        "name": "RSI (14)",
        "value": stock.rsi ?? "N/A"
      },
      {
        "@type": "PropertyValue",
        "name": "P/E Ratio",
        "value": stock.pe ?? "N/A"
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://swinglify.online"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Screener",
        "item": "https://swinglify.online/screener"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `${stock.symbol}`,
        "item": `https://swinglify.online/stock/${stock.symbol}`
      }
    ]
  };

  const changeUp = (stock.change || 0) >= 0;
  const changeSign = changeUp ? '+' : '';
  const rsiStatus = stock.rsi != null
    ? stock.rsi < 30 ? 'oversold (dip buying opportunity)' : stock.rsi > 70 ? 'overbought (caution / profit booking zone)' : 'neutral momentum'
    : 'neutral';

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is ${stock.symbol} live share price today?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${stock.symbol} (${stock.name}) is currently trading at ₹${stock.price?.toLocaleString('en-IN') ?? '—'} on ${stock.exchange || 'NSE'} with a 24-hour price change of ${changeSign}${(stock.change || 0).toFixed(2)}%.`
        }
      },
      {
        "@type": "Question",
        "name": `What is ${stock.symbol} RSI indicator reading?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The 14-day RSI (Relative Strength Index) for ${stock.symbol} is currently ${stock.rsi != null ? stock.rsi.toFixed(1) : 'N/A'}, indicating ${rsiStatus}.`
        }
      },
      {
        "@type": "Question",
        "name": `Is ${stock.symbol} good for swing trading right now?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `According to Swinglify's composite indicator analysis, ${stock.symbol} holds a ${stock.indicatorScore?.label || 'NEUTRAL'} rating with a momentum score of ${stock.indicatorScore?.score ?? 50}/100 based on RSI, MACD crossovers, and moving averages.`
        }
      },
      {
        "@type": "Question",
        "name": `What is the 52-week range for ${stock.symbol}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${stock.symbol} has a 52-week high of ₹${stock.week52High?.toLocaleString('en-IN') ?? '—'} and a 52-week low of ₹${stock.week52Low?.toLocaleString('en-IN') ?? '—'}.`
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
