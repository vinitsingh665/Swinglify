export default function StructuredData() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Swinglify",
    "url": "https://swinglify.online",
    "description": "Free swing trading platform for Indian stocks. Screen NSE & BSE stocks with RSI, MACD, Bollinger Bands. Track portfolio, set price alerts, and find swing trade opportunities.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://swinglify.online/markets?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Swinglify",
    "url": "https://swinglify.online",
    "logo": "https://swinglify.online/logo.png",
    "description": "Swinglify simplifies swing trading for Indian stock market investors with free screening tools, portfolio tracking, and community insights.",
    "sameAs": [
      "https://twitter.com/swinglify"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "url": "https://swinglify.online/info/contact"
    }
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Swinglify",
    "url": "https://swinglify.online",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "description": "Free swing trading screener and portfolio tracker for NSE & BSE stocks. Technical analysis with RSI, MACD, Bollinger Bands, EMA crossovers, volume breakout detection, and real-time price alerts.",
    "featureList": [
      "Stock Screener with 40+ technical indicators",
      "Real-time NSE & BSE stock prices",
      "Portfolio tracker with P&L analytics",
      "Price alert notifications",
      "Community trading insights",
      "Stock comparison tool",
      "Sector-wise performance heatmap",
      "Watchlist management"
    ],
    "screenshot": "https://swinglify.online/og-image.png",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "ratingCount": "120",
      "bestRating": "5"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
    </>
  );
}
