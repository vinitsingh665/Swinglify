export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/settings',
          '/profile',
          '/vinit_admin',
          '/api/auth/',
          '/api/community/posts/*/vote',
          '/api/community/posts/*/comments',
          '/api/portfolio/',
          '/api/alerts/',
          '/api/watchlist/',
          '/api/user/',
          '/api/feedback/',
        ],
      },
    ],
    sitemap: 'https://www.swinglify.online/sitemap.xml',
  };
}
