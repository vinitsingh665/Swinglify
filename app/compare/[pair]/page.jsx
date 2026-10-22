import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { POPULAR_COMPARISONS } from '../../../lib/compare-presets';
import { CompareContent } from '../page';

export const revalidate = 300; // Recache every 5 minutes

export async function generateStaticParams() {
  return Object.keys(POPULAR_COMPARISONS).map(pair => ({ pair }));
}

export async function generateMetadata({ params }) {
  const { pair } = await params;
  const config = POPULAR_COMPARISONS[pair];

  if (!config) {
    return { title: 'Stock Comparison Not Found | Swinglify' };
  }

  return {
    title: config.metaTitle,
    description: config.metaDescription,
    alternates: {
      canonical: `https://swinglify.online/compare/${config.slug}`,
    },
    openGraph: {
      title: config.metaTitle,
      description: config.metaDescription,
      url: `https://swinglify.online/compare/${config.slug}`,
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

export default async function ProgrammaticComparePage({ params }) {
  const { pair } = await params;
  const config = POPULAR_COMPARISONS[pair];

  if (!config) {
    notFound();
  }

  const comparisonSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": config.title,
    "description": config.summary,
    "url": `https://swinglify.online/compare/${config.slug}`,
    "numberOfItems": config.symbols.length,
    "itemListElement": config.symbols.map((sym, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "url": `https://swinglify.online/stock/${sym}`,
      "name": `${sym} Stock Analysis`
    }))
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
        "name": "Compare",
        "item": "https://swinglify.online/compare"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": config.title,
        "item": `https://swinglify.online/compare/${config.slug}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(comparisonSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Suspense fallback={<div style={{ padding: '40px', color: '#888', textAlign: 'center', fontFamily: 'Inter' }}>Loading comparison...</div>}>
        <CompareContent
          initialSymbols={config.symbols}
          seoHeader={{
            title: config.title,
            summary: config.summary,
          }}
        />
      </Suspense>
    </>
  );
}
