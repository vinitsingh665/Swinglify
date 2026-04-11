export const metadata = {
  title: 'Portfolio Tracker — Track Your Indian Stock Holdings & Returns',
  description: 'Free portfolio tracker for Indian stocks. Monitor NSE & BSE holdings, track profit/loss, view allocation charts in one dashboard.',
  keywords: [
    'stock portfolio tracker india',
    'free portfolio tracker nse',
    'indian stock portfolio manager',
    'track stock holdings india',
    'portfolio profit loss tracker',
    'nse bse portfolio app',
    'stock investment tracker free',
    'mutual fund portfolio tracker india',
    'portfolio allocation chart stocks',
    'stock returns calculator india',
    'average buy price tracker',
    'best portfolio tracker app india',
    'demat portfolio tracker free',
    'stock cagr calculator india',
    'multi stock portfolio manager free',
  ],
  alternates: { canonical: 'https://swinglify.online/portfolio' },
  openGraph: {
    title: 'Free Stock Portfolio Tracker for Indian Markets — Swinglify',
    description: 'Track your NSE & BSE holdings, monitor P&L, and view allocation charts.',
    url: 'https://swinglify.online/portfolio',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Swinglify Portfolio Tracker' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Stock Portfolio Tracker — Swinglify',
    description: 'Track your NSE & BSE holdings, monitor P&L, and view allocation charts.',
    images: ['/og-image.png'],
  },
};

export default function PortfolioLayout({ children }) {
  return children;
}
