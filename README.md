<p align="center">
  <img src="public/logo.png" alt="Swinglify Logo" width="100" />
</p>

<h1 align="center">Swinglify 📈</h1>

<p align="center">
  <strong>The Premium Swing Trading Intelligence Platform for Indian Markets</strong>
</p>

<p align="center">
  <a href="https://www.swinglify.online">🌐 Live App</a> &nbsp;·&nbsp;
  <a href="#-key-features">✨ Features</a> &nbsp;·&nbsp;
  <a href="#-getting-started">🚀 Get Started</a> &nbsp;·&nbsp;
  <a href="#-technology-stack">🛠 Tech Stack</a>
</p>

---

Swinglify is a modern, high-performance web application that empowers swing traders with **real-time market insights**, **AI-powered analysis**, **advanced technical screening**, and a **vibrant community hub** — all wrapped in a beautifully engineered *"Midnight Quantum"* dark-mode experience. Built with Next.js 16, React 19, and MongoDB, it's designed to be the only trading companion you'll ever need for NSE & BSE markets.

---

## 🌟 Key Features

### 🏠 Immersive Landing Page
- **Interactive 3D Hero Mockup** — A live, clickable dashboard preview that cycles through Dashboard, Screener, Alerts, and Portfolio views.
- **Market Marquee** — Real-time scrolling ticker bar with live index data.
- **Bento Feature Grid** — Visually rich feature cards with glassmorphism styling.

---

### 📊 Market Intelligence Dashboard
- **Live Market Pulse** — Real-time tracking of Nifty 50, Bank Nifty, and Sensex with bullish/bearish sentiment analysis.
- **Advance/Decline Insights** — Visual market breadth gauge to quickly assess the day's momentum.
- **Dynamic Opportunities** — Auto-generated, actionable lists for Top Movers, Volume Spikes, RSI Breakouts, and 52-Week Highs.

---

### 🔬 Advanced Stock Screener
- **Multi-Parameter Filtering** — Screen 2,000+ NSE/BSE equities by market cap, price structure, performance, and technical indicators (RSI, MACD, Bollinger Bands, EMAs).
- **15+ Index Categories** — One-click filtering across Broad Market (Nifty 500), Size-Based (Midcap 150), Sectoral (IT, Auto, Pharma), and Thematic (PSU Bank) indices.
- **Technical Signal Scores** — Integrated composite indicator scores: Strong Buy, Buy, Hold, Sell, Strong Sell.

---

### 📈 Market Intelligence & Analytics
- **EMA Market Breadth** — At-a-glance visualization of stocks trading above their 10, 20, 50, and 200 EMAs.
- **Sector Heatmaps & Performance** — Real-time tracking of the strongest and weakest sectors.
- **Trend & Momentum Signals** — Aggregated overbought/oversold RSI states and pivotal EMA crossovers.
- **Top Opportunities Today** — Curated list of actionable setups detected by the analytics engine.

---

### 🤖 AI-Powered Insights (Groq + Llama)
- **Per-Stock AI Analysis** — On-demand, 2-sentence technical outlook for any stock using Llama 3.1 8B, factoring in RSI, price, and signal data.
- **Daily Market Wrap-Up** — Auto-generated 3-paragraph market summary using Llama 3.3 70B, delivered via a scheduled Vercel cron job every trading day.
- **Smart Alert Suggestions** — AI recommends 3 contextual price alerts based on the day's most active stocks.

---

### 💼 Portfolio Tracker
- **Holdings Management** — Add holdings via an intuitive modal, track average buy prices against live quotes.
- **Asset Allocation Donut Chart** — Interactive, sector-weighted visualization of your portfolio.
- **Live P&L** — Real-time profit & loss calculations against current market prices.

---

### 🔔 Smart Alerts System
- **Custom Price Alerts** — Configure Above/Below price alerts for any NSE/BSE stock, persisted in MongoDB.
- **Notification Dropdown** — Real-time notification bell with triggered/active alert states, timestamps, and unread indicators.
- **Alert Types** — Support for Price, Volume, and RSI-based alert conditions.

---

### 👀 Watchlist
- **Personalized Stock Tracking** — Add stocks to your watchlist with a single click from any table or search result.
- **Live Quotes** — Watchlist items display real-time prices, change percentages, and technical signals.
- **Deep Links** — Context-aware "Add to Portfolio" and "Set Alert" actions directly within the watchlist.

---

### ⚖️ Stock Comparison Tool
- **Side-by-Side Metrics** — Compare up to 4 NSE stocks simultaneously across key fundamentals and technicals.
- **Performance Chart** — Visual comparison chart showing relative performance.
- **Winner Insight** — AI-style summary highlighting the best-performing stock and why.

---

### 💬 Community Trading Hub
- **Structured Insight Cards** — Share setups with stock ticker, strategy tag (Breakout, Pullback, Momentum, etc.), sentiment (Bullish/Bearish/Neutral), timeframe, confidence level, target price, and stop-loss.
- **9 Strategy Tags** — Breakout, Pullback, Support Bounce, Resistance Rejection, High Volume, Reversal, Momentum, Gap Up, Gap Down.
- **Voting & Comments** — Full Reddit-style upvoting/downvoting with nested comment threads.
- **Right Panel Intelligence** — Most Discussed stocks, Strong Signals aggregation, Community Sentiment Gauge, and Top Analysts leaderboard.
- **Advanced Filtering** — Filter posts by strategy tag, timeframe, sentiment, and your watchlist stocks.

---

### 👤 User Profiles & Settings
- **Profile Management** — Edit username, display name, and profile picture with Google OAuth.
- **Preferences** — Customizable accent color, theme preferences, and trading experience level.
- **Notifications** — Granular notification preferences for alerts, community, and market events.
- **Data & Privacy** — Export data, manage connected accounts, and account deletion.

---

### 🔍 Universal Search
- **Instant Stock Search** — `⌘K` / `Ctrl+K` shortcut to search 2,000+ stocks with live price previews.
- **Debounced API Calls** — Efficient search with expandable result dropdown and click-to-open stock modals.

---

### 📱 Mobile-First Experience
- **Adaptive UI** — Fully responsive design with a persistent mobile bottom navigation bar featuring an expandable secondary flyout menu.
- **Mobile Panel Toggles** — Community filters and insights panels convert to slide-out drawers on mobile.
- **Touch-Optimized** — Large tap targets, swipe-friendly interactions, and optimized spacing.

---

### 🔐 Authentication & Admin
- **Google OAuth** — Secure sign-in via NextAuth.js with Google provider.
- **User Badges** — Special role badges for verified contributors and admins.
- **Admin Command Center** — Password-protected `/vinit_admin` panel for platform management.
- **Visitor Tracking** — Anonymous visit counting with MongoDB-backed analytics.

---

### 🌐 SEO & Performance
- **Full SEO Suite** — Dynamic OpenGraph images, structured data (JSON-LD), sitemap, robots.txt, and comprehensive meta tags.
- **Google Search Console** — Verified and optimized for search indexing.
- **Optimized Loading** — Skeleton loading states for every page, Suspense boundaries, and efficient data caching.

---

## 🛠 Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, HTML5, Vanilla CSS |
| **Design System** | Custom *"Midnight Quantum"* theme — Glassmorphism, CSS variables, customizable accent colors |
| **Backend / API** | Next.js API Routes (Serverless), 20+ API endpoints |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Authentication** | NextAuth.js v4 (Google OAuth) |
| **AI Engine** | Groq SDK — Llama 3.1 8B (instant analysis), Llama 3.3 70B (market wrap-ups) |
| **Market Data** | TradingView Screener API (reverse-engineered payload mapping) |
| **Emails** | Nodemailer (SMTP — Gmail) |
| **Deployment** | Vercel (with Cron Jobs for automated market wrap-ups) |

---

## 📁 Project Structure

```
swinglify/
├── app/
│   ├── page.jsx              # Landing page (Hero3D, Marquee, Bento)
│   ├── layout.jsx            # Root layout, theme init, SEO metadata
│   ├── globals.css           # Full design system (55K+ lines)
│   ├── dashboard/            # Market Intelligence Dashboard
│   ├── screener/             # Advanced Stock Screener
│   ├── analytics/            # Market Breadth, Sectors, Trends
│   ├── portfolio/            # Portfolio Tracker
│   ├── watchlist/            # Personal Watchlist
│   ├── alerts/               # Price Alert Management
│   ├── compare/              # Stock Comparison Tool
│   ├── community/            # Trading Community Hub
│   ├── markets/              # Live Market Overview
│   ├── profile/              # User Profile & Settings
│   ├── settings/             # App Preferences
│   ├── info/                 # Help, Privacy, Terms, Changelog, Contact, Bug Report
│   ├── vinit_admin/          # Admin Command Center
│   └── api/                  # 20+ serverless API routes
│       ├── screener/         # TradingView data proxy
│       ├── analytics/        # Market breadth & sectors
│       ├── community/        # Posts, comments, votes, trending, signals
│       ├── alerts/           # Alert CRUD + trigger checks
│       ├── portfolio-quotes/ # Live portfolio pricing
│       ├── search/           # Stock search API
│       ├── stock/            # Individual stock data
│       ├── feed/             # AI market wrap-up feed
│       ├── cron/             # Automated daily tasks
│       └── ...               # Auth, admin, onboarding, user, etc.
├── components/
│   ├── landing/              # Hero3D, MarketMarquee, BentoFeatures, LandingFooter
│   ├── dashboard/            # Dashboard-specific components
│   ├── Header.jsx            # App header
│   ├── Sidebar.jsx           # Collapsible sidebar navigation
│   ├── TopBar.jsx            # Top navigation bar
│   ├── MobileBottomNav.jsx   # Mobile bottom navigation
│   ├── SearchBar.jsx         # Universal ⌘K search
│   ├── StockModal.jsx        # Stock detail modal
│   ├── StockTable.jsx        # Reusable stock data table
│   ├── NotificationDropdown.jsx # Alert notification bell
│   ├── OnboardingModal.jsx   # New user onboarding
│   ├── ThemeProvider.jsx     # Global theme + accent color manager
│   └── ...
├── hooks/                    # Custom React hooks
│   ├── usePortfolio.js       # Portfolio state + DB sync
│   ├── useAlerts.js          # Alert management
│   ├── useWatchlist.js       # Watchlist persistence
│   └── useStockData.js       # Market data + search
├── lib/
│   ├── api-core.js           # TradingView API integration (20K+ lines)
│   ├── ai.js                 # Groq/Llama AI integrations
│   ├── auth.js               # NextAuth configuration
│   ├── mongodb.js            # MongoDB connection singleton
│   └── badges.js             # User badge definitions
├── models/                   # Mongoose schemas
│   ├── User.js               # User profiles
│   ├── Post.js               # Community posts
│   ├── Comment.js            # Nested comments
│   ├── Alert.js              # Price alerts
│   ├── Signal.js             # Trading signals
│   ├── Feedback.js           # User feedback
│   ├── InsightCache.js       # AI insight cache
│   ├── Search.js             # Search analytics
│   └── Visitor.js            # Visitor tracking
├── utils.js                  # Shared utility functions
├── vercel.json               # Cron job configuration
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **MongoDB Atlas** connection string
- **Google OAuth** Client ID & Secret (for authentication)
- **Groq API Key** (for AI-powered insights — [get one free](https://console.groq.com))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vinitsingh665/Swinglify.git
   cd Swinglify
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   # NextAuth
   NEXTAUTH_URL=http://localhost:3050
   NEXTAUTH_SECRET=your_nextauth_secret_here

   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   # MongoDB
   MONGODB_URI=your_mongodb_connection_string

   # Groq AI
   GROQ_API_KEY=your_groq_api_key

   # Email (for contact/bug report forms)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   RECEIVER_EMAIL=your_receiver_email

   # Admin Panel
   ADMIN_PASSWORD=your_admin_password

   # Vercel Cron (for automated market wrap-ups)
   CRON_SECRET=your_cron_secret
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   # → http://localhost:3050
   ```

---

## 🏗 Architecture Highlights

- **`lib/api-core.js`** — The central nervous system for market data. Handles complex payload structuring to query the TradingView Screener API, caches responses, and parses raw numerical data into human-readable signal scores and EMA targets. 20,000+ lines of battle-tested logic.

- **`lib/ai.js`** — Three specialized AI functions powered by Groq: per-stock swing analysis (Llama 3.1 8B), daily market wrap-ups (Llama 3.3 70B), and smart alert suggestions. Low-temperature settings for consistent, analytical outputs.

- **`hooks/`** — Custom React hooks (`usePortfolio`, `useAlerts`, `useWatchlist`, `useStockData`) that manage local storage state synchronization alongside MongoDB persistence for authenticated users.

- **`components/`** — A library of 25+ reusable, styled components adhering strictly to the custom CSS theme variables. Zero dependency on utility frameworks like Tailwind.

- **Cron System** — Vercel-scheduled daily market wrap-up generation at 4:15 PM IST (10:45 UTC) on weekdays, stored in MongoDB and served via the `/feed` endpoint.

---

## 📄 License

This project is proprietary. All rights reserved.

---

<p align="center">
  Made with ❤️ for Indian swing traders
</p>
