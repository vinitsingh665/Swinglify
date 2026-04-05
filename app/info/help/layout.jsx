export const metadata = {
  title: 'Help Center & FAQs — Swinglify',
  description: 'Find answers, guides, and troubleshooting steps for Swinglify. Learn how to use the stock screener, set up price alerts, and manage your portfolio.',
  keywords: ['swinglify help', 'swing trading tutorial', 'how to use stock screener', 'setup stock price alerts', 'stock market faqs india', 'swinglify faq'],
  alternates: { canonical: 'https://swinglify.online/info/help' },
  openGraph: {
    title: 'Swinglify Help Center & Guides',
    description: 'Learn how to master technical analysis and swing trading with our comprehensive guides.',
    url: 'https://swinglify.online/info/help',
  },
};

function FaqStructuredData() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Swinglify?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Swinglify is a premium technical analysis and swing trading platform designed specifically for the Indian Stock Market (NSE & BSE). It provides live data, screeners, and automated signal detection."
        }
      },
      {
        "@type": "Question",
        "name": "Is Swinglify free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Currently, yes! We are in early access, and all core features—including the live screener, alerts, and portfolio tracking—are completely free."
        }
      },
      {
        "@type": "Question",
        "name": "How do I add stocks to my Watchlist?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Navigate to the Markets or Screener page. You'll see a star (★) icon next to every stock ticker. Click it to add or remove the stock from your personal Watchlist."
        }
      },
      {
        "@type": "Question",
        "name": "How real-time is the market data?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our dashboard processes live ticks during NSE/BSE market hours (9:15 AM to 3:30 PM IST). There may be a standard exchange delay of a few seconds depending on the data provider."
        }
      },
      {
        "@type": "Question",
        "name": "What technical indicators are available?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our screener supports RSI (Relative Strength Index), MACD, Bollinger Bands, EMA Crossovers, and Volume Breakout detection. We are constantly adding new indicators based on community feedback."
        }
      },
      {
        "@type": "Question",
        "name": "How do Buy/Sell signals work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Signals are generated using algorithmic composites of multiple momentum and trend indicators. They highlight potential swing setups but should not be taken as direct financial advice."
        }
      },
      {
        "@type": "Question",
        "name": "Can I get alerts on my phone?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. By configuring alerts on the Alerts page, you can receive email notifications when a stock crosses a specific price, volume threshold, or RSI level."
        }
      },
      {
        "@type": "Question",
        "name": "How many active alerts can I have?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Free tier users can maintain up to 20 active alerts simultaneously."
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}

export default function HelpLayout({ children }) {
  return (
    <>
      <FaqStructuredData />
      {children}
    </>
  );
}
