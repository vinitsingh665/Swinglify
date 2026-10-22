import { fetchFromTradingView } from '../lib/api-core';
import dbConnect from '../lib/mongodb';
import Post from '../models/Post';
import { POPULAR_COMPARISONS } from '../lib/compare-presets';

export default async function sitemap() {
  const baseUrl = 'https://swinglify.online';

  // ─── Static pages ────────────────────────────────────────────────────────────
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/all-stocks`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.95 },
    { url: `${baseUrl}/dashboard`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/markets`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/screener`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/screener/rsi-oversold`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.85 },
    { url: `${baseUrl}/screener/volume-breakouts`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.85 },
    { url: `${baseUrl}/screener/golden-cross`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.85 },
    { url: `${baseUrl}/screener/52-week-high`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.85 },
    { url: `${baseUrl}/screener/top-gainers`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.85 },
    { url: `${baseUrl}/analytics`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/community`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.8 },
    { url: `${baseUrl}/compare`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/info/help`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/info/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/info/bug-report`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.2 },
    { url: `${baseUrl}/info/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/info/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/info/changelog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.4 },
  ];

  // ─── Dynamic stock pages ─────────────────────────────────────────────────────
  let stockPages = [];
  try {
    // Fetch all NSE & BSE primary stocks
    const body = {
      filter: [
        { left: 'is_primary', operation: 'equal', right: true },
      ],
      symbols: { query: { types: ['stock'] } },
      columns: ['name', 'market_cap_basic'],
      sort: { sortBy: 'market_cap_basic', sortOrder: 'desc' },
      range: [0, 3000],
    };

    const tvData = await fetchFromTradingView(body);

    if (tvData?.data) {
      stockPages = tvData.data
        .filter(item => {
          const sym = item.d[0];
          // Skip symbols with special chars that break XML (M&M, L&T, etc.)
          return sym && /^[A-Z0-9_-]+$/i.test(sym);
        })
        .map(item => {
          const symbol = item.d[0];
          const marketCap = item.d[1] || 0;

          // Higher priority for large-cap stocks (more searched)
          let priority = 0.5;
          if (marketCap >= 500000000000) priority = 0.8;       // Large cap (₹50K Cr+)
          else if (marketCap >= 100000000000) priority = 0.7;   // Mid cap (₹10K Cr+)
          else if (marketCap >= 10000000000) priority = 0.6;    // Small cap (₹1K Cr+)

          return {
            url: `${baseUrl}/stock/${encodeURIComponent(symbol)}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority,
          };
        });
    }
  } catch (e) {
    console.error('Sitemap: Failed to fetch stock symbols:', e);
    // Sitemap will still work with static pages only
  }

  // ─── Dynamic community post pages ──────────────────────────────────────────
  let communityPages = [];
  try {
    await dbConnect();
    const posts = await Post.find({}, { _id: 1, createdAt: 1 })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();
    communityPages = posts.map(post => ({
      url: `${baseUrl}/community/${post._id}`,
      lastModified: post.createdAt ? new Date(post.createdAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));
  } catch (e) {
    console.error('Sitemap: Failed to fetch community posts:', e);
  }

  // ─── Programmatic Comparison pages ──────────────────────────────────────────
  const comparisonPages = Object.keys(POPULAR_COMPARISONS).map(slug => ({
    url: `${baseUrl}/compare/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.75,
  }));

  console.log(`Sitemap generated: ${staticPages.length} static + ${comparisonPages.length} compare + ${stockPages.length} stock + ${communityPages.length} community pages`);

  return [...staticPages, ...comparisonPages, ...stockPages, ...communityPages];
}
