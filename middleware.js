import { NextResponse } from 'next/server';

export function middleware(request) {
  const host = request.headers.get('host') || '';

  // Redirect www.swinglify.online → swinglify.online (301 permanent)
  if (host.startsWith('www.')) {
    const nonWwwHost = host.replace(/^www\./, '');
    const url = request.nextUrl.clone();
    url.host = nonWwwHost;
    url.protocol = 'https';
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  // Run on all paths except static files and Next.js internals
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.png|og-image.png).*)'],
};
