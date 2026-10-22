import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { fetchFromTradingView, parseStockData, FIELDS } from '../../../lib/api-core';
import { SCREENER_PRESETS } from '../../../lib/screener-presets';
import ScreenerClient from '../ScreenerClient';

export const revalidate = 300; // Recache every 5 minutes

export async function generateStaticParams() {
  return Object.keys(SCREENER_PRESETS).map(preset => ({ preset }));
}

export async function generateMetadata({ params }) {
  const { preset } = await params;
  const config = SCREENER_PRESETS[preset];

  if (!config) {
    return { title: 'Screener Strategy Not Found | Swinglify' };
  }

  return {
    title: config.metaTitle,
    description: config.metaDescription,
    keywords: config.keywords,
    alternates: {
      canonical: `https://swinglify.online/screener/${config.slug}`,
    },
    openGraph: {
      title: config.metaTitle,
      description: config.metaDescription,
      url: `https://swinglify.online/screener/${config.slug}`,
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: config.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: config.metaTitle,
      description: config.metaDescription,
      images: ['/og-image.png'],
    },
  };
}

const SECTORS = [
  'Technology', 'Finance', 'Health Technology', 'Consumer Non-Durables',
  'Energy Minerals', 'Process Industries', 'Producer Manufacturing',
  'Consumer Durables', 'Consumer Services', 'Industrial Services',
  'Utilities', 'Non-Energy Minerals', 'Communications',
  'Distribution Services', 'Transportation', 'Retail Trade',
  'Commercial Services', 'Electronic Technology', 'Health Services',
  'Miscellaneous'
];

async function getPresetStocks(config) {
  try {
    const tvBody = {
      ...config.tvQuery,
      symbols: { query: { types: ['stock'] } },
      columns: FIELDS,
    };

    const tvData = await fetchFromTradingView(tvBody);
    return parseStockData(tvData);
  } catch (e) {
    console.error(`[Screener Preset SSR] Failed to fetch stocks for ${config.slug}:`, e);
    return [];
  }
}

export default async function PresetScreenerPage({ params }) {
  const { preset } = await params;
  const config = SCREENER_PRESETS[preset];

  if (!config) {
    notFound();
  }

  const initialStocks = await getPresetStocks(config);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": config.title,
    "description": config.description,
    "url": `https://swinglify.online/screener/${config.slug}`,
    "numberOfItems": initialStocks.length,
    "itemListElement": initialStocks.slice(0, 30).map((stock, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "url": `https://swinglify.online/stock/${stock.symbol}`,
      "name": `${stock.symbol} — ${stock.name}`
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <Suspense fallback={null}>
        <ScreenerClient
          initialStocks={initialStocks}
          initialSectors={SECTORS}
          initialFilters={config.filters}
          initialIndex={config.initialIndex || null}
          seoHeader={{
            badge: config.badge,
            title: config.title,
            description: config.description,
          }}
        />
      </Suspense>
    </>
  );
}
