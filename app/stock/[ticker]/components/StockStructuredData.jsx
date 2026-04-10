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
    </>
  );
}
