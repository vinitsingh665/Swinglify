export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/settings', '/profile', '/api/'],
      },
    ],
    sitemap: 'https://swinglify.com/sitemap.xml',
  };
}
